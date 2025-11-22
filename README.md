# ServiceVoice - AI Voice Booking Agent

AI voice agent that answers calls 24/7, books appointments, and handles frustrated customers with empathy. Built for home services SMBs (plumbers, HVAC, electricians).

## 🎉 Everything Runs on Vercel!

The backend has been converted to Vercel API routes (TypeScript). **No separate backend hosting needed!**

## 🚀 Quick Start - Run Locally

### Prerequisites
- Node.js 18+ and npm
- API Keys (OpenAI, ElevenLabs, LiveKit, Google Calendar)

### Setup

```bash
# Navigate to web folder
cd web

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local  # (if exists) or create manually
```

### Environment Variables

Create `web/.env.local`:
```env
OPENAI_API_KEY=sk-your-key-here
ELEVENLABS_API_KEY=your-key-here
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CREDENTIALS={"type":"service_account",...}  # Full JSON as string
```

### Run Development Server

```bash
cd web
npm run dev
```

Open **http://localhost:3000**

**That's it!** No Python backend needed. Everything runs in Next.js.

---

## 🌐 Deploy to Vercel (One-Click!)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Convert to Vercel API routes"
git push
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. **Import Project** from GitHub
3. **Configure**:
   - **Root Directory**: `web`
   - **Framework**: Next.js (auto-detected)
4. **Add Environment Variables** (see VERCEL_SETUP.md)
5. **Deploy!**

**Done!** Your app is live on Vercel. 🎉

---

## 📁 Project Structure

```
customer-experience-lab/
├── web/                    # Next.js 14 app (deploys to Vercel)
│   ├── app/
│   │   ├── api/           # API routes (replaces FastAPI backend)
│   │   │   ├── start-demo/route.ts
│   │   │   ├── book-appointment/route.ts
│   │   │   └── ask-company/route.ts
│   │   ├── demo/          # Demo page
│   │   └── page.tsx       # Landing page
│   ├── components/        # React components
│   ├── lib/
│   │   ├── api.ts         # API client (uses relative paths)
│   │   └── company_rag.json
│   └── package.json
├── backend/                # Python backend (kept for reference)
│   ├── main.py           # Old FastAPI (now converted to API routes)
│   └── voice-agent.py    # LiveKit agent (needs separate hosting)
└── vercel.json           # Vercel config
```

---

## 🛠️ API Routes

All API endpoints are now in `web/app/api/`:

- `POST /api/start-demo` - Creates LiveKit room and generates persona
- `POST /api/book-appointment` - Books appointment in Google Calendar  
- `POST /api/ask-company` - Queries company knowledge base

These run as serverless functions on Vercel.

---

## ⚠️ About LiveKit Agent

The LiveKit agent worker (`backend/voice-agent.py`) is a **long-running process** that can't run on Vercel (serverless functions have time limits).

**Options:**
1. **LiveKit Cloud** - They can host your agent (recommended)
2. **Run locally** - For demos, run `python voice-agent.py dev` locally
3. **Free tier services** - Railway/Render (just for the agent worker)

The frontend and API work perfectly on Vercel without the agent. The agent is only needed for actual voice conversations.

---

## 📚 Features

- 🎙️ **24/7 Voice AI** - Natural voice conversations (requires agent)
- 📅 **Smart Booking** - Google Calendar integration
- 💰 **Distance Pricing** - Google Maps distance calculation
- 🧠 **Empathetic AI** - Trained on real customer complaints
- 📸 **Photo Analysis** - Visual problem detection
- ⚡ **Real-time** - WebRTC voice with LiveKit

---

## 🛠️ Tech Stack

**Frontend & API (Vercel):**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- LiveKit Client SDK
- OpenAI API
- Google Calendar API

**Agent (Separate Hosting):**
- Python
- LiveKit Agents
- OpenAI GPT-4
- ElevenLabs TTS
- Deepgram STT

---

## 🐛 Troubleshooting

### API routes not working
- Check environment variables in Vercel
- Verify `GOOGLE_CREDENTIALS` is valid JSON string
- Check Vercel function logs

### LiveKit connection fails
- Verify `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- Check LiveKit server is running
- Ensure agent worker is running (if using voice)

### Google Calendar errors
- Verify `GOOGLE_CREDENTIALS` is set correctly (full JSON as string)
- Check `GOOGLE_CALENDAR_ID` is correct
- Verify service account has calendar permissions

---

## 📝 License

MIT

---

**Built with ❤️ for SMBs who never want to miss a call again.**

**Now 100% Vercel-ready!** 🚀
