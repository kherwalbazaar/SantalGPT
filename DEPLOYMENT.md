# Vercel Deployment Guide

## Prerequisites

1. **Gemini AI API Key**: Get your API key from https://aistudio.google.com/app/apikey

## Vercel Configuration Steps

### 1. Add Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables

Add the following environment variable:

- **Name**: `SantaliGPT`
- **Value**: Your Gemini AI API key (e.g., `AIzaSyCgzcTiL_SfWNs-ftQVZeVefkxGLsK4yc8`)
- **Environment**: Production, Preview, Development (select all)

Alternatively, you can use `GOOGLE_AI_API_KEY` instead of `SantaliGPT`.

### 2. Deploy to Vercel

If you haven't already, deploy your project to Vercel:

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### 3. Verify Deployment

After deployment, test the following:

1. **Frontend**: Open your Vercel URL and verify the app loads
2. **API**: Test the API endpoint by sending a message
3. **Fallback**: If API fails, you should see the Santali fallback message

## Troubleshooting

### Blank Screen on Vercel

If you see a blank screen:

1. Check browser console for errors (F12 → Console)
2. Verify the frontend is building correctly
3. Check that the `dist` folder is being generated
4. Ensure Vercel is serving the `index.html` file

### API Not Working

If the API is not working:

1. **Check Environment Variables**: Ensure `SantaliGPT` is set in Vercel
2. **Check API Logs**: Go to Vercel dashboard → Functions → api/index.py → Logs
3. **Test API Endpoint**: Try accessing `/chat` endpoint directly
4. **Verify API Key**: Ensure your Gemini AI API key is valid

### API Returns Fallback Message

If you see the fallback message "ᱤᱠᱟᱹ ᱠᱟᱹᱧ ᱢᱮ, ᱤᱧ ᱱᱤᱛᱚᱜ ᱠᱟᱹᱢᱤ ᱨᱮ ᱢᱤᱱᱟᱹᱧᱟ, ᱛᱷᱚᱲᱟ ᱜᱷᱟᱹᱲᱤᱡ ᱛᱟᱭᱚᱢ ᱟᱨᱦᱚᱸ ᱨᱚᱲ ᱢᱮ":

This means the API is not responding. Check:
1. API key is configured correctly
2. Backend API is deployed and running
3. API endpoint routing is correct

## Local Development

For local development, the app uses `http://localhost:8000` for the API. Make sure:

1. Backend server is running: `cd api && python -m uvicorn index:app --host 0.0.0.0 --port 8000`
2. Frontend dev server is running: `cd frontend && npm run dev`
3. API key is set in `.env` file: `SantaliGPT=your_api_key_here`

## Architecture

- **Frontend**: React/Vite app deployed to Vercel
- **Backend**: FastAPI with Gemini AI deployed to Vercel
- **API Endpoint**: `/chat` (handled by `api/index.py`)
- **Routing**: Vercel handles both frontend and backend routing via `vercel.json`
