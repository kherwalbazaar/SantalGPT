# SantalGPT - Setup Guide

Complete setup guide for SantalGPT frontend and backend.

## 📋 Prerequisites

- **Node.js 16+** and npm (for frontend)
- **Python 3.8+** and pip (for backend)
- **Google AI Studio API Key** (free from https://aistudio.google.com/)

---

## 🚀 Quick Start

### Step 1: Get Your Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key"
4. Copy the API key (it looks like: `AIzaSy...`)

### Step 2: Setup Backend API

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and add your API key
# GOOGLE_AI_API_KEY=your_actual_api_key_here
```

**Start the backend server:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at: `http://localhost:8000`

**Test the backend:**
- Open: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Step 3: Setup Frontend

```bash
# In the main project directory
npm install

# Create environment file (optional)
cp .env.example .env
```

**Start the frontend:**
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🔧 Configuration

### Backend Configuration

**File:** `backend/.env`

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### Frontend Configuration

**File:** `.env` (optional)

```env
VITE_API_URL=http://localhost:8000
```

For production deployment:
```env
VITE_API_URL=https://your-api-server.com
```

---

## 📡 How It Works

### Request Flow

1. User types message in frontend
2. Frontend sends POST request to `/chat` endpoint
3. Backend receives message and sends to Google Gemini AI
4. AI generates response in Santali (Ol Chiki script)
5. Backend returns response to frontend
6. Frontend displays the response

### API Endpoint

**POST** `http://localhost:8000/chat`

**Request:**
```json
{
  "message": "ᱡᱚᱦᱟᱨ, ᱟᱢ ᱚᱠᱚᱭ ᱠᱟᱱᱟᱢ?"
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

---

## 🎯 Features

### Current Features
- ✅ Real AI responses from Google Gemini
- ✅ Santali language focus (Ol Chiki script)
- ✅ Culturally appropriate responses
- ✅ Fallback to mock responses if API fails
- ✅ Message editing (long-press on mobile, hover on desktop)
- ✅ Copy messages to clipboard
- ✅ Chat history with localStorage
- ✅ Voice input support
- ✅ Script switching (Ol Chiki / Latin)
- ✅ Learning resources sidebar

### AI System Prompt
The AI is configured to:
- Respond primarily in Santali (Ol Chiki script)
- Provide culturally appropriate information
- Explain Santali traditions and history
- Respect Santali heritage
- Be friendly and helpful

---

## 🔍 Testing

### Test Backend

```bash
# Check if backend is running
curl http://localhost:8000/

# Send a test message
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "ᱡᱚᱦᱟᱨ"}'

# Health check
curl http://localhost:8000/health
```

### Test Frontend

1. Open http://localhost:5173
2. Type "Hi" or "Johar" - should get friendly greeting
3. Ask about Santali culture
4. Test voice input
5. Test message editing

---

## 🌐 Deployment

### Deploy Backend

**Option 1: Render.com (Free)**
1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Set build command: `pip install -r backend/requirements.txt`
5. Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `GOOGLE_AI_API_KEY`

**Option 2: Railway.app (Free)**
1. Create account at https://railway.app
2. Deploy from GitHub
3. Add environment variables
4. Railway auto-detects Python

**Option 3: Self-hosted VPS**
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run with production settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Deploy Frontend

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm run build
# Deploy dist folder to Netlify
```

**Option 3: GitHub Pages**
```bash
npm run build
# Push dist folder to gh-pages branch
```

**Important:** After deploying frontend, update `.env`:
```env
VITE_API_URL=https://your-backend-url.com
```

---

## 📱 Android APK Wrapping

To wrap the web app as an Android APK:

### Using Bubblewrap (PWA to APK)

1. Install Bubblewrap:
```bash
npm install -g @google-web-components/bubblewrap
```

2. Initialize:
```bash
bubblewrap init --manifest https://your-frontend-url.com/manifest.json
```

3. Build APK:
```bash
bubblewrap build
```

### Using Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
npx cap open android
```

### Using WebView (Simple)

Create Android project with WebView pointing to your frontend URL.

---

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. Use environment variables for all secrets
3. Enable CORS only for your frontend domain in production
4. Implement rate limiting on the backend
5. Add authentication if needed
6. Use HTTPS in production

---

## 🐛 Troubleshooting

### Backend Issues

**"API key not configured"**
- Check `backend/.env` file exists
- Verify API key is correct
- Restart the server

**"Module not found"**
```bash
pip install -r requirements.txt
```

**CORS errors**
- Backend allows all origins by default
- Check `allow_origins` in `main.py`

### Frontend Issues

**"Failed to fetch"**
- Ensure backend is running
- Check `VITE_API_URL` in `.env`
- Check browser console for errors

**Ol Chiki text showing as boxes**
- Ensure Noto Sans Ol Chiki font is loaded
- Check internet connection (font loads from Google)

**API not responding**
- Check backend logs
- Test with curl command
- Verify API key is valid

---

## 📚 Additional Resources

- [Google AI Studio](https://aistudio.google.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Noto Sans Ol Chiki Font](https://fonts.google.com/noto/specimen/Noto+Sans+Ol+Chiki)

---

## 🎓 RAG Enhancement (Advanced)

To add your Santali learning book content:

1. **Prepare your book:**
   - Export as `.txt` or `.pdf`
   - Split into chunks

2. **Install vector database:**
```bash
pip install chromadb langchain
```

3. **Modify backend to use RAG:**
   - Index your book content
   - Search for relevant snippets
   - Include in AI prompt

4. **Benefits:**
   - AI answers based on your book
   - More accurate responses
   - Custom knowledge base

---

## 💡 Tips

1. **Free API Usage:** Google AI Studio offers free tier with rate limits
2. **Testing:** Use backend docs at `/docs` for easy testing
3. **Mobile:** The UI is fully responsive for mobile devices
4. **Offline:** Chat history works offline via localStorage
5. **Voice:** Works best in Chrome/Edge browsers

---

## 🤝 Support

For issues or questions:
- Check the README files in `backend/` and root directory
- Review API documentation at `http://localhost:8000/docs`
- Check browser console for frontend errors
- Check terminal for backend errors

---

**ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱫᱚ ᱡᱤᱣᱤᱫ ᱛᱟᱦᱮᱸᱱᱟ!** (Long live the Santali language!)
