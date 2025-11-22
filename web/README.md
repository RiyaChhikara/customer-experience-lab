# ServiceVoice Frontend

Next.js 14 frontend for the ServiceVoice AI voice booking agent.

## Features

- 🎙️ Real-time voice conversations with LiveKit
- 👤 AI-generated customer personas
- 📅 Automatic appointment booking
- 💰 Distance-based pricing calculation
- 📸 Photo upload for visual analysis
- 🎨 Beautiful gradient UI (purple-pink-orange theme)

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **LiveKit Client** for WebRTC voice
- **React Hooks** for state management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- FastAPI backend running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local if needed (defaults to localhost:8000)
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx          # Landing page
│   ├── demo/
│   │   └── page.tsx      # Demo interface
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── demo/
│   │   ├── VoiceClient.tsx        # LiveKit voice connection
│   │   ├── PersonaDisplay.tsx    # Customer persona UI
│   │   └── BookingConfirmation.tsx # Booking details
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api.ts            # FastAPI client
│   └── livekit.ts        # LiveKit utilities
└── public/                # Static assets
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, set this to your deployed backend URL.

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy!

The app is fully static-compatible and works great on Vercel.

## API Integration

The frontend connects to the FastAPI backend at:

- `POST /api/start-demo` - Creates LiveKit room and generates persona
- `POST /api/book-appointment` - Books appointment in Google Calendar

See `lib/api.ts` for the full API client implementation.

## LiveKit Integration

The voice client uses LiveKit's WebRTC SDK for real-time audio:

- Connects to LiveKit room via WebSocket
- Publishes microphone audio
- Subscribes to remote participant audio
- Handles mute/unmute and disconnect

See `components/demo/VoiceClient.tsx` for implementation.

## License

MIT
