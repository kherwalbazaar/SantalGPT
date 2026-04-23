import os
from pathlib import Path
from typing import List

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


API_DIR = Path(__file__).resolve().parent
PROJECT_DIR = API_DIR.parent

# Load environment variables from .env for local development
# On Vercel, environment variables are set directly
if not os.getenv("VERCEL"):
    load_dotenv(API_DIR / ".env")
    load_dotenv(PROJECT_DIR / ".env")

# Get API key from environment (Vercel or .env)
API_KEY = os.getenv("SantaliGPT") or os.getenv("GOOGLE_AI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)

app = FastAPI(title="SantalGPT API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

system_instruction = (
    "You are SantalGPT, a helpful AI assistant created for the Santali community. "
    "Your primary goal is to communicate in the Santali language using the Ol Chiki script. "
    "Even if the user asks in English, Hindi, Odia, or another language, answer in Ol Chiki. "
    "Be friendly, helpful, and culturally respectful."
)


class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []


@app.get("/")
def root():
    return {
        "message": "API working",
    }


@app.get("/hello")
def hello():
    return {
        "status": "success",
        "message": "Hello from SantalGPT FastAPI on Vercel",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "api_configured": bool(API_KEY),
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    if not API_KEY:
        return {
            "status": "error",
            "reply": "ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ",
            "error": "API key not configured"
        }

    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        chat_session = model.start_chat(history=request.history)
        response = chat_session.send_message(
            f"{system_instruction}\n\nUser: {request.message}"
        )

        return {
            "status": "success",
            "reply": response.text,
            "script": "Ol Chiki",
        }
    except Exception as exc:
        return {
            "status": "error",
            "reply": "ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ",
            "error": str(exc)
        }
