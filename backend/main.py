from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import logging
from dotenv import load_dotenv
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, auth
from jose import JWTError, jwt
from datetime import datetime, timedelta
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="SantalGPT API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-vercel-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

# Firebase Admin SDK
try:
    # Initialize Firebase Admin with service account
    firebase_creds = os.getenv("FIREBASE_SERVICE_ACCOUNT")
    if firebase_creds:
        cred_dict = json.loads(firebase_creds)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
    else:
        # For development, use default credentials
        firebase_admin.initialize_app()
    logger.info("Firebase Admin initialized successfully")
except Exception as e:
    logger.error(f"Firebase initialization error: {e}")

# Google Gemini API
GOOGLE_AI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")
if not GOOGLE_AI_API_KEY:
    logger.warning("GOOGLE_AI_API_KEY not found in environment variables")
else:
    genai.configure(api_key=GOOGLE_AI_API_KEY)

# System instruction for Gemini
SYSTEM_INSTRUCTION = """
You are SantalGPT, an AI assistant that helps users learn and communicate in Santali (Ol Chiki script). 
You should:
1. Respond primarily in Santali using Ol Chiki script
2. Provide English translations when helpful
3. Be patient and encouraging with language learners
4. Focus on Santali language, culture, and education
5. If asked about other topics, try to relate them to Santali context when possible
"""

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    status: str
    error: Optional[str] = None

class UserSettings(BaseModel):
    theme: str = "light"
    notifications: bool = False
    language: str = "en"

class UserProfile(BaseModel):
    email: str
    displayName: Optional[str] = None
    settings: UserSettings = UserSettings()

# JWT Functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        return uid
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# API Routes
@app.get("/")
async def root():
    return {"message": "SantalGPT API is running"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api_configured": bool(GOOGLE_AI_API_KEY),
        "firebase_configured": bool(firebase_admin.get_app())
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    user_id: str = Depends(verify_firebase_token)
):
    """
    Chat endpoint that processes user messages and returns AI responses
    """
    try:
        if not GOOGLE_AI_API_KEY:
            return ChatResponse(
                reply="ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ",
                status="error",
                error="API key not configured"
            )

        # Initialize Gemini model
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        
        # Start chat with history
        chat_session = model.start_chat(history=request.history)
        
        # Send message with system instruction
        full_prompt = f"{SYSTEM_INSTRUCTION}\n\nUser: {request.message}"
        response = chat_session.send_message(full_prompt)

        return ChatResponse(
            reply=response.text,
            status="success"
        )

    except Exception as e:
        logger.error(f"Chat API error: {e}")
        return ChatResponse(
            reply="ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ",
            status="error",
            error=str(e)
        )

@app.post("/api/user/settings")
async def update_user_settings(
    settings: UserSettings,
    user_id: str = Depends(verify_firebase_token)
):
    """
    Update user settings
    """
    try:
        # Here you would typically save to a database
        # For now, just return success
        return {"status": "success", "message": "Settings updated"}
    except Exception as e:
        logger.error(f"Settings update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update settings")

@app.get("/api/user/profile")
async def get_user_profile(
    user_id: str = Depends(verify_firebase_token)
):
    """
    Get user profile
    """
    try:
        # Get user from Firebase Auth
        user = auth.get_user(user_id)
        return {
            "uid": user.uid,
            "email": user.email,
            "displayName": user.display_name,
            "photoURL": user.photo_url
        }
    except Exception as e:
        logger.error(f"Profile fetch error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")

@app.post("/api/user/save-prompt")
async def save_prompt(
    prompt_data: dict,
    user_id: str = Depends(verify_firebase_token)
):
    """
    Save a prompt for future use
    """
    try:
        # Here you would save to database
        return {"status": "success", "message": "Prompt saved"}
    except Exception as e:
        logger.error(f"Save prompt error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save prompt")

@app.get("/api/user/saved-prompts")
async def get_saved_prompts(
    user_id: str = Depends(verify_firebase_token)
):
    """
    Get user's saved prompts
    """
    try:
        # Here you would fetch from database
        return {"prompts": [], "status": "success"}
    except Exception as e:
        logger.error(f"Fetch prompts error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch prompts")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
