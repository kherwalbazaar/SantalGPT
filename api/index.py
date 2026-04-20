import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the FastAPI app from backend/main.py
from main import app

# Vercel expects the FastAPI app to be exported as 'app'
# This is already done in main.py, so we just need to import it