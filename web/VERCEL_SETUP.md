# Vercel Deployment Setup

## ✅ What's Been Converted

The FastAPI backend has been converted to Vercel API routes (TypeScript). Everything now runs on Vercel!

## 📦 Install Dependencies

Before deploying, install the new packages:

```bash
cd web
npm install
```

This will install:
- `openai` - OpenAI API client
- `livekit-api` - LiveKit API for room management
- `googleapis` - Google Calendar API

## 🔧 Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables:
```
OPENAI_API_KEY=sk-your-key-here
ELEVENLABS_API_KEY=your-key-here
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

**Important:** `GOOGLE_CREDENTIALS` should be the entire JSON content from `google-credentials.json` as a single string.

## 🚀 Deploy to Vercel

1. **Push to GitHub** (if not already done)
2. **Go to Vercel**: https://vercel.com
3. **Import Project** from GitHub
4. **Configure**:
   - Root Directory: `web`
   - Framework: Next.js (auto-detected)
5. **Add Environment Variables** (see above)
6. **Deploy!**

## 📝 API Routes Created

All API routes are now in `web/app/api/`:

- `/api/start-demo` - Creates LiveKit room and generates persona
- `/api/book-appointment` - Books appointment in Google Calendar
- `/api/ask-company` - Queries company knowledge base

## ⚠️ About LiveKit Agent

The LiveKit agent worker (`voice-agent.py`) still needs separate hosting because it's a long-running process. Options:

1. **LiveKit Cloud** - They can host your agent
2. **Run locally** - For demos, run it locally
3. **Free tier services** - Railway/Render (just for the agent)

The frontend and API now work entirely on Vercel!

## 🧪 Testing Locally

```bash
cd web
npm install
npm run dev
```

The API routes will be available at:
- http://localhost:3000/api/start-demo
- http://localhost:3000/api/book-appointment
- http://localhost:3000/api/ask-company

No need to run the Python backend anymore! 🎉

