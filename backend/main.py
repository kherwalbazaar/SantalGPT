import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- CONFIGURATION ---
# Replace with your actual API Key from https://aistudio.google.com/
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
    model_name="gemini-1.5-flash"
)

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    message: str
    history: list = []  # Optional conversation history

# --- ENDPOINTS ---
@app.get("/")
def home():
    return {
        "message": "SantalGPT Backend is Running!",
        "status": "active",
        "model": "gemini-1.5-flash"
    }

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        # Start a chat session with optional history
        chat = model.start_chat(history=request.history)
        
        # Prepend system instruction to first message
        full_message = f"{system_instruction}\n\nUser: {request.message}"
        
        # Send the user's message to Gemini
        response = chat.send_message(full_message)
        
        return {
            "status": "success",
            "reply": response.text,
            "script": "Ol Chiki"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "api_configured": API_KEY != "YOUR_GOOGLE_AI_STUDIO_API_KEY"
    }

# To run this: pip install fastapi uvicorn google-generativeai
# Then run: uvicorn main:app --host 0.0.0.0 --port 8000
