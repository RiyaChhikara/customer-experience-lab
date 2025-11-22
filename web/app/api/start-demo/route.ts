import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SignJWT } from 'jose';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate LiveKit access token (JWT)
async function generateAccessToken(
  apiKey: string,
  apiSecret: string,
  roomName: string,
  identity: string = 'customer'
): Promise<string> {
  const secret = new TextEncoder().encode(apiSecret);
  
  const token = await new SignJWT({
    video: {
      room: roomName,
      roomJoin: true,
    },
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(apiKey)
    .setSubject(identity)
    .setExpirationTime('24h')
    .sign(secret);

  return token;
}

export async function POST(request: NextRequest) {
  try {
    // Get request body (business_type and location kept for future use)
    await request.json();

    const livekitUrl = process.env.LIVEKIT_URL || '';
    const apiKey = process.env.LIVEKIT_API_KEY || '';
    const apiSecret = process.env.LIVEKIT_API_SECRET || '';

    // 1. Generate persona from hardcoded complaint
    const complaint = `
        Called for emergency plumbing at 8am. They said 30 minutes. 
        Waited 3 HOURS. Basement flooding. When he showed up, rude and 
        quoted $800 just to look. Tried upselling $5000 pipe replacement!
    `;

    const personaResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Create a JSON persona with: name, age, issue, emotion, priority (1-10). Be concise.',
        },
        {
          role: 'user',
          content: `Complaint: ${complaint}`,
        },
      ],
      temperature: 0.7,
    });

    const persona = personaResponse.choices[0].message.content;

    // 2. Create LiveKit room via REST API
    const roomName = `demo-${Date.now()}`;
    const livekitApiUrl = livekitUrl.replace('wss://', 'https://').replace('ws://', 'http://');
    
    // Create room using LiveKit REST API
    const authHeader = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    const createRoomResponse = await fetch(`${livekitApiUrl}/twirp/livekit.RoomService/CreateRoom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`,
      },
      body: JSON.stringify({
        name: roomName,
      }),
    });

    if (!createRoomResponse.ok) {
      const errorText = await createRoomResponse.text();
      throw new Error(`Failed to create room: ${createRoomResponse.statusText} - ${errorText}`);
    }

    // 3. Generate access token
    const jwtToken = await generateAccessToken(apiKey, apiSecret, roomName);

    return NextResponse.json({
      success: true,
      persona: persona,
      room_name: roomName,
      token: jwtToken,
      livekit_url: process.env.LIVEKIT_URL,
    });
  } catch (error) {
    console.error('Error in start-demo:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start demo' },
      { status: 500 }
    );
  }
}

