@echo off
echo 🌿 Starting SantalGPT Backend Server...
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Error: backend directory not found!
    exit /b 1
)

REM Navigate to backend directory
cd backend

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found!
    echo 📝 Creating .env from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit backend\.env and add your Google AI API key
    echo.
)

REM Install dependencies if needed
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo 📦 Installing Python dependencies...
    pip install -r requirements.txt
    echo.
)

echo 🚀 Starting FastAPI server on http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo.

REM Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
