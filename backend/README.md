# SantalGPT Backend API

FastAPI backend for SantalGPT with Google Gemini AI integration.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Get API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key"
4. Copy your API key

### 3. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```
GOOGLE_AI_API_KEY=your_actual_api_key_here
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production mode:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

The server will start at: `http://localhost:8000`

## API Endpoints

### GET `/`
Check if the API is running.

**Response:**
```json
{
  "message": "SantalGPT Backend is Running!",
  "status": "active",
  "model": "gemini-1.5-flash"
}
```

### POST `/chat`
Send a message to the AI.

**Request Body:**
```json
{
  "message": "ᱡᱚᱦᱟᱨ, ᱟᱢ ᱚᱠᱚᱭ ᱠᱟᱱᱟᱢ?",
  "history": []
}
```

**Response:**
```json
{
  "status": "success",
  "reply": "ᱡᱚᱦᱟᱨ! ᱤᱧ ᱥᱟᱱᱛᱟᱲᱜᱤᱯᱤᱴᱤ ᱠᱟᱱᱟ...",
  "script": "Ol Chiki"
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "api_configured": true
}
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Model Configuration

The AI is configured with a system instruction that ensures it:
- Responds primarily in Santali (Ol Chiki script)
- Provides culturally appropriate responses
- Explains Santali traditions and history
- Respects Santali heritage and Pandit Raghunath Murmu's legacy

## Environment Variables

- `GOOGLE_AI_API_KEY` - Your Google AI Studio API key (required)

## Testing with cURL

```bash
# Test the API
curl http://localhost:8000/

# Send a message
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "ᱡᱚᱦᱟᱨ"}'
```

## Deployment

For production deployment, consider:
- Using a reverse proxy (nginx)
- Setting up SSL/TLS
- Using environment variables for API keys
- Implementing rate limiting
- Adding authentication if needed

## RAG (Retrieval-Augmented Generation)

To enhance the AI with your Santali learning book content:

1. Export your book as `.txt` or `.pdf`
2. Use a vector database (like ChromaDB or FAISS)
3. Modify the `/chat` endpoint to:
   - Search for relevant book snippets
   - Include them in the prompt
   - Generate responses based on your content

## Troubleshooting

**API Key Error:**
- Ensure your API key is correctly set in `.env`
- Check that the key is active in Google AI Studio

**CORS Error:**
- The API allows all origins by default (`allow_origins=["*"]`)
- For production, specify your frontend domain

**Model Error:**
- Ensure you have internet connectivity
- Check that your API key has Gemini access

## License

Built for the Santali community to preserve and promote Santali language and culture.
