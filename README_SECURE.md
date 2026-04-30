# SantalGPT - Secure Full-Stack Architecture

## 🏗️ Architecture Overview

```
Frontend (Next.js + Vercel)
    ↓ (Firebase Auth Token)
Firebase (Auth + Firestore)
    ↓ (Secure API Calls)
Backend API (FastAPI + Vercel Python)
    ↓ (Secure API Key)
Google Gemini API
```

## 🔐 Security Features

- ✅ **No API keys in frontend** - Gemini API key only in backend
- ✅ **Firebase Authentication** - Secure user login
- ✅ **Firestore Database** - User data and chat history
- ✅ **JWT Token Validation** - Secure API communication
- ✅ **Environment Variables** - All secrets in backend .env
- ✅ **Fallback Responses** - Graceful error handling

## 📋 Setup Instructions

### 1. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password + Google)
3. Create Firestore Database
4. Download Service Account Key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file

### 2. Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your secrets:
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
   ```

5. Run locally:
   ```bash
   python main.py
   ```

### 3. Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update Firebase config in `src/firebase/config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY_HERE",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

### 4. Vercel Deployment

#### Frontend Deployment
1. Connect your GitHub repo to Vercel
2. Set root directory to `frontend`
3. Framework preset: Next.js
4. Add environment variables if needed

#### Backend Deployment
1. In the same Vercel project, add backend configuration
2. The `vercel.json` file handles both frontend and backend
3. Set environment variables in Vercel dashboard:
   - `GOOGLE_AI_API_KEY`
   - `JWT_SECRET_KEY`
   - `FIREBASE_SERVICE_ACCOUNT`

## 🚀 Deployment Flow

1. Push code to GitHub
2. Vercel automatically builds and deploys:
   - Next.js frontend (from `/frontend`)
   - Python backend (from `/backend`)
3. API routes: `https://your-app.vercel.app/api/*`
4. Frontend: `https://your-app.vercel.app`

## 📱 Features

- **User Authentication**: Email/Password + Google Sign-In
- **Chat History**: Persistent storage in Firestore
- **Secure API**: All AI calls go through secure backend
- **Real-time Updates**: Firebase real-time listeners
- **Offline Support**: Local storage fallback
- **Mobile Ready**: PWA with install prompt
- **Santali Language**: Ol Chiki script support

## 🔧 API Endpoints

### Authentication (Firebase)
- Sign Up: `auth.createUserWithEmailAndPassword()`
- Sign In: `auth.signInWithEmailAndPassword()`
- Google Sign-In: `auth.signInWithPopup()`

### Chat API (Backend)
- Send Message: `POST /api/chat`
- User Profile: `GET /api/user/profile`
- Update Settings: `POST /api/user/settings`
- Save Prompt: `POST /api/user/save-prompt`
- Get Prompts: `GET /api/user/saved-prompts`

### Firestore Collections
- `users/{userId}` - User profiles and settings
- `users/{userId}/chats/{chatId}` - Chat conversations
- `users/{userId}/savedPrompts/{promptId}` - Saved prompts

## 🛡️ Security Best Practices

1. **Never expose API keys** in frontend code
2. **Use environment variables** for all secrets
3. **Validate Firebase tokens** on backend
4. **Implement rate limiting** in production
5. **Use HTTPS** everywhere
6. **Sanitize user inputs** before processing
7. **Implement proper error handling** without exposing sensitive info

## 🔄 Development Workflow

1. **Local Development**:
   ```bash
   # Terminal 1: Backend
   cd backend && python main.py
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

2. **Testing**:
   - Test authentication flow
   - Verify chat persistence
   - Check API security
   - Test error handling

3. **Deployment**:
   - Push to GitHub
   - Monitor Vercel build logs
   - Test deployed app
   - Monitor error logs

## 📊 Monitoring

- **Frontend**: Vercel Analytics
- **Backend**: Vercel Function Logs
- **Firebase**: Firebase Console
- **Errors**: Integrated error reporting

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS configuration
2. **Auth Failures**: Verify Firebase config and service account
3. **API Errors**: Check backend logs and environment variables
4. **Build Failures**: Check Vercel build logs and dependencies

### Debug Mode

Enable debug logging in backend:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📝 Next Steps

1. Add rate limiting to API
2. Implement user roles and permissions
3. Add analytics and monitoring
4. Create admin dashboard
5. Add more language models
6. Implement file upload for documents

---

**🔒 Remember: Never commit API keys or secrets to version control!**
