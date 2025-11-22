# ServiceVoice - AI Voice Booking Agent

AI voice agent that answers calls 24/7, books appointments, and handles frustrated customers with empathy. Built for home services SMBs (plumbers, HVAC, electricians).

## 🚀 Quick Start - Run Locally

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+ and pip
- LiveKit Server (cloud or self-hosted)
- API Keys (OpenAI, ElevenLabs, LiveKit, Google Calendar)

### Three Terminals Required

Open **3 separate terminal windows**:

#### Terminal 1: FastAPI Backend
```bash
cd backend
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
python main.py
```
Backend runs at: **http://localhost:8000**

#### Terminal 2: LiveKit Agent Worker
```bash
cd backend
source .venv/bin/activate
python voice-agent.py dev
```
Agent connects to LiveKit and handles voice conversations.

#### Terminal 3: Next.js Frontend
```bash
cd web
npm run dev
```
Frontend runs at: **http://localhost:3000**

---

## 📁 Project Structure

```
customer-experience-lab/
├── web/                    # Next.js 14 frontend (Vercel-ready)
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   └── lib/               # API client & utilities
├── backend/               # FastAPI backend + LiveKit agent
│   ├── main.py           # FastAPI REST API server
│   ├── voice-agent.py    # LiveKit voice agent worker
│   └── requirements.txt  # Python dependencies
├── test/                  # Test notebooks
└── vercel.json           # Vercel deployment config
```

---

## 🛠️ Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Create `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
ELEVENLABS_API_KEY=your-key-here
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
```

### 3. Frontend Setup

```bash
cd web
npm install
```

Create `web/.env.local` (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Testing

1. Start all 3 services (see Quick Start above)
2. Open http://localhost:3000
3. Click "Start Demo Call"
4. Talk to the AI agent through voice
5. Book appointment through conversation

**Important:** Use `http://localhost:3000` (not `127.0.0.1`) for microphone access.

---

## 🌐 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions.

**Quick Summary:**
- **Frontend**: Deploy to Vercel (point to `web/` folder)
- **Backend**: Deploy to Railway/Render (point to `backend/` folder)
- **LiveKit Agent**: Deploy as separate worker (same platform as backend)

---

## 📚 Features

- 🎙️ **24/7 Voice AI** - Natural voice conversations
- 📅 **Smart Booking** - Google Calendar integration
- 💰 **Distance Pricing** - Google Maps distance calculation
- 🧠 **Empathetic AI** - Trained on real customer complaints
- 📸 **Photo Analysis** - Visual problem detection
- ⚡ **Real-time** - WebRTC voice with LiveKit

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- LiveKit Client SDK

**Backend:**
- FastAPI
- LiveKit Agents v1.0+
- OpenAI GPT-4
- ElevenLabs TTS
- Deepgram STT
- Google Calendar API

---

## 📖 API Endpoints

- `POST /api/start-demo` - Creates LiveKit room and generates persona
- `POST /api/book-appointment` - Books appointment in Google Calendar
- `POST /api/ask-company` - Queries company knowledge base

See http://localhost:8000/docs for interactive API documentation.

---

## 🐛 Troubleshooting

### "getUserMedia not available"
- Use `http://localhost:3000` (not `127.0.0.1`)
- Grant microphone permissions in browser
- HTTPS required in production (Vercel provides this)

### Backend won't start
- Check `backend/.env` exists with all variables
- Verify virtual environment is activated
- Check dependencies: `pip list | grep fastapi`

### LiveKit agent won't connect
- Verify LiveKit environment variables
- Check LiveKit server is running
- Review agent logs for connection errors

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `web/.env.local`
- Check CORS settings in `backend/main.py`

---

## 📝 License

MIT

---

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your needs!

---

**Built with ❤️ for SMBs who never want to miss a call again.**
