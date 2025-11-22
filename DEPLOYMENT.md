# Deployment Guide

## 🚀 Quick Start - Three Terminals

Open **3 separate terminal windows** and run these commands:

### Terminal 1: FastAPI Backend
```bash
cd /Users/riyachhikara/Documents/GitHub/customer-experience-lab/backend
source .venv/bin/activate
python main.py
```
**Expected output:** `INFO: Uvicorn running on http://0.0.0.0:8000`

### Terminal 2: LiveKit Agent Worker
```bash
cd /Users/riyachhikara/Documents/GitHub/customer-experience-lab/backend
source .venv/bin/activate
python voice-agent.py dev
```
**Expected output:** `INFO livekit.agents registered worker`

### Terminal 3: Next.js Frontend
```bash
cd /Users/riyachhikara/Documents/GitHub/customer-experience-lab/web
npm run dev
```
**Expected output:** `Local: http://localhost:3000`

---

## 🌐 Deploying to Vercel

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
cd /Users/riyachhikara/Documents/GitHub/customer-experience-lab
git init
git add .
git commit -m "Initial commit: ServiceVoice AI booking agent"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `servicevoice`)
   - **Don't** initialize with README (you already have one)

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/servicevoice.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Import Project**:
   - Click "Add New" → "Project"
   - Import from GitHub
   - Select your repository

3. **Configure Project**:
   - **Root Directory**: Set to `web` (not root!)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Environment Variables**:
   Add this variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
   (You'll set this after deploying the backend)

5. **Deploy**: Click "Deploy"

### Step 3: Deploy Backend (Railway/Render)

The backend needs to run separately. Choose one:

#### Option A: Railway (Recommended)

1. **Go to Railway**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select your repository**
4. **Configure**:
   - **Root Directory**: `backend`
   - **Start Command**: `python main.py`
   - **Python Version**: 3.11+

5. **Environment Variables** (add all from `backend/.env`):
   ```
   OPENAI_API_KEY=sk-...
   ELEVENLABS_API_KEY=...
   LIVEKIT_URL=wss://...
   LIVEKIT_API_KEY=...
   LIVEKIT_API_SECRET=...
   GOOGLE_CALENDAR_ID=...
   ```

6. **Add Google Credentials**:
   - Go to "Variables" tab
   - Add `GOOGLE_CREDENTIALS` as a file variable
   - Paste contents of `backend/google-credentials.json`

7. **Get Backend URL**: Railway will give you a URL like `https://your-app.railway.app`

8. **Update Vercel**: Go back to Vercel → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to your Railway URL

#### Option B: Render

1. **Go to Render**: https://render.com
2. **New** → "Web Service"
3. **Connect GitHub** and select repo
4. **Configure**:
   - **Name**: `servicevoice-backend`
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`

5. **Environment Variables**: Add all from `backend/.env`
6. **Get URL** and update Vercel

### Step 4: Deploy LiveKit Agent Worker

The agent also needs to run separately:

#### On Railway (Same Project)

1. In your Railway project, click **"+ New"** → **"Service"**
2. **Deploy from GitHub** → Same repo
3. **Configure**:
   - **Root Directory**: `backend`
   - **Start Command**: `python voice-agent.py dev`
   - **Environment Variables**: Same as backend

#### On Render (Separate Service)

1. **New** → "Background Worker"
2. **Root Directory**: `backend`
3. **Start Command**: `python voice-agent.py dev`
4. **Environment Variables**: Same as backend

---

## 📋 Deployment Checklist

### Before Pushing to GitHub:
- [ ] `.gitignore` excludes sensitive files (`.env`, `google-credentials.json`)
- [ ] All code is committed
- [ ] `vercel.json` points to `web` folder
- [ ] `web/.env.local` is NOT committed (should be in `.gitignore`)

### After Deploying:
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] LiveKit agent worker deployed
- [ ] Environment variables set in all services
- [ ] `NEXT_PUBLIC_API_URL` points to backend URL
- [ ] Test the full flow: http://your-vercel-url.vercel.app

---

## 🔧 Environment Variables Summary

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend (Railway/Render)
```
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
LIVEKIT_URL=wss://...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
GOOGLE_CALENDAR_ID=...
GOOGLE_CREDENTIALS={paste JSON content}
```

### LiveKit Agent (Same as Backend)
Same environment variables as backend.

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Verify backend is running (check Railway/Render logs)
- Check CORS settings in `backend/main.py`

### Voice agent not working
- Verify LiveKit agent worker is running
- Check LiveKit environment variables
- Check WebSocket connections (HTTPS required)

### Google Calendar errors
- Verify `GOOGLE_CREDENTIALS` is set correctly
- Check `GOOGLE_CALENDAR_ID` is correct
- Verify service account has calendar permissions

---

## 📝 Notes

- **Frontend**: Deploys to Vercel (free tier available)
- **Backend**: Needs separate hosting (Railway/Render free tiers available)
- **LiveKit Agent**: Needs separate worker process (can be on same platform as backend)
- **HTTPS Required**: Voice features require HTTPS (Vercel provides this automatically)

---

**Ready to deploy?** Start with Step 1 (GitHub push)!

