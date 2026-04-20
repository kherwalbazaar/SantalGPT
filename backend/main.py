import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import io
from pypdf import PdfReader
from dotenv import load_dotenv
# Temporarily disabled RAG dependencies due to installation issues
# import numpy as np
# from sentence_transformers import SentenceTransformer
# import faiss

# --- CONFIGURATION ---
# Replace with your actual API Key from https://aistudio.google.com/
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
API_KEY = os.getenv("GOOGLE_AI_API_KEY", "YOUR_GOOGLE_AI_STUDIO_API_KEY")
genai.configure(api_key=API_KEY)

app = FastAPI(title="SantalGPT API")

# Enable CORS so your Web and APK can communicate with this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DOCUMENT STORAGE & RAG SETUP ---
# In-memory storage for documents (can be replaced with database)
documents = []  # List of document chunks
document_metadata = []  # List of document metadata (filename, etc.)

# Initialize sentence transformer for embeddings
embedding_model = None
index = None
rag_error = None

def initialize_rag():
    global embedding_model, index, rag_error
    try:
        from sentence_transformers import SentenceTransformer
        import faiss

        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        # Initialize FAISS index
        index = faiss.IndexFlatL2(384)  # 384 is the embedding dimension for MiniLM
        rag_error = None
        return True
    except Exception as e:
        rag_error = str(e)
        print(f"Error initializing RAG: {rag_error}")
        return False

# RAG is initialized lazily when a document is uploaded. Loading the embedding
# model during module import can make the API startup slow or hang on Windows.

# --- AI MODEL SETUP ---
# System instruction ensures the AI behaves as a Santali expert
system_instruction = (
    "You are SantalGPT, a helpful AI assistant created for the Santali community. "
    "Your primary goal is to communicate in the Santali language using the Ol Chiki script. "
    "Even if the user asks a question in English or Odia, answer them in Ol Chiki. "
    "If the user asks about Santali culture, tradition, or Pandit Raghunath Murmu, "
    "provide detailed and respectful information. "
    "Always be friendly, helpful, and culturally sensitive."
)

model = genai.GenerativeModel(
    model_name="gemini-pro"
)

# --- DOCUMENT PROCESSING FUNCTIONS ---
def extract_text_from_pdf(pdf_file: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PdfReader(io.BytesIO(pdf_file))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into chunks with overlap"""
    chunks = []
    words = text.split()
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk.strip():
            chunks.append(chunk.strip())
    return chunks

def add_document_to_rag(text: str, filename: str):
    """Add document to RAG system"""
    global documents, document_metadata, index, embedding_model
    
    # Try to initialize RAG if not already done
    if embedding_model is None or index is None:
        if not initialize_rag():
            # If RAG fails, just store the text without embeddings
            chunks = chunk_text(text)
            for chunk in chunks:
                documents.append(chunk)
                document_metadata.append({
                    "filename": filename,
                    "chunk_count": len(chunks)
                })
            return
    
    # Chunk the document
    chunks = chunk_text(text)
    
    try:
        import numpy as np
        # Generate embeddings for chunks
        embeddings = embedding_model.encode(chunks)
        
        # Add to FAISS index
        index.add(np.array(embeddings).astype('float32'))
    except ImportError:
        # If numpy is not available, just store chunks
        pass
    
    # Store chunks and metadata
    for chunk in chunks:
        documents.append(chunk)
        document_metadata.append({
            "filename": filename,
            "chunk_count": len(chunks)
        })

def retrieve_relevant_context(query: str, top_k: int = 3) -> str:
    """Retrieve relevant document chunks for a query"""
    global documents, index, embedding_model
    
    if embedding_model is None or index is None or len(documents) == 0:
        return ""
    
    try:
        import numpy as np
        # Generate embedding for query
        query_embedding = embedding_model.encode([query])
        
        # Search FAISS index
        distances, indices = index.search(np.array(query_embedding).astype('float32'), top_k)
        
        # Retrieve relevant chunks
        relevant_chunks = [documents[i] for i in indices[0] if i < len(documents)]
        
        return "\n\n".join(relevant_chunks) if relevant_chunks else ""
    except ImportError:
        # If numpy is not available, return empty context
        return ""

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    message: str
    history: list = []  # Optional conversation history
    use_rag: bool = True  # Whether to use document context

# --- ENDPOINTS ---
@app.get("/")
def home():
    return {
        "message": "SantalGPT Backend is Running!",
        "status": "active",
        "model": "gemini-1.5-flash"
    }

@app.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):
    """Upload a document (PDF or text) for RAG"""
    try:
        # Read file content
        content = await file.read()
        
        # Process based on file type
        if file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(content)
        elif file.filename.endswith('.txt'):
            text = content.decode('utf-8')
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Please upload PDF or TXT files.")
        
        # Add to RAG system
        add_document_to_rag(text, file.filename)
        
        return {
            "status": "success",
            "message": f"Document '{file.filename}' uploaded and processed successfully",
            "chunks_added": len(chunk_text(text))
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        # Retrieve relevant context if RAG is enabled and documents exist
        context = ""
        if request.use_rag and len(documents) > 0:
            context = retrieve_relevant_context(request.message)
        
        # Start a chat session with optional history
        chat = model.start_chat(history=request.history)
        
        # Build message with context if available
        if context:
            full_message = f"{system_instruction}\n\nContext from uploaded documents:\n{context}\n\nUser: {request.message}"
        else:
            full_message = f"{system_instruction}\n\nUser: {request.message}"
        
        # Send the user's message to Gemini
        response = chat.send_message(full_message)
        
        return {
            "status": "success",
            "reply": response.text,
            "script": "Ol Chiki",
            "context_used": len(context) > 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "api_configured": API_KEY != "YOUR_GOOGLE_AI_STUDIO_API_KEY",
        "rag_initialized": embedding_model is not None,
        "rag_error": rag_error,
        "documents_loaded": len(documents)
    }

@app.get("/documents")
def list_documents():
    """List all uploaded documents"""
    unique_docs = {}
    for meta in document_metadata:
        filename = meta["filename"]
        if filename not in unique_docs:
            unique_docs[filename] = meta["chunk_count"]
    
    return {
        "documents": unique_docs,
        "total_chunks": len(documents)
    }

@app.delete("/documents")
def clear_documents():
    """Clear all uploaded documents"""
    global documents, document_metadata, index
    
    if embedding_model is not None:
        try:
            import faiss
            # Reinitialize FAISS index
            index = faiss.IndexFlatL2(384)
        except ImportError:
            index = None
    
    documents = []
    document_metadata = []
    
    return {
        "status": "success",
        "message": "All documents cleared"
    }

# To run this: pip install fastapi uvicorn google-generativeai
# Then run: uvicorn main:app --host 0.0.0.0 --port 8000
