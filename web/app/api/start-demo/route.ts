import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LiveKitApi, CreateRoomRequest, AccessToken, VideoGrants } from 'livekit-api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();
    const { business_type = 'plumbing', location = 'London' } = body;

    // Initialize LiveKit API
    const livekitApi = new LiveKitApi(
      process.env.LIVEKIT_URL || '',
      process.env.LIVEKIT_API_KEY || '',
      process.env.LIVEKIT_API_SECRET || ''
    );

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

    // 2. Create LiveKit room
    const roomName = `demo-${Date.now()}`;
    const room = await livekitApi.room.createRoom(
      new CreateRoomRequest({
        name: roomName,
      })
    );

    // 3. Generate access token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY || '',
      process.env.LIVEKIT_API_SECRET || ''
    );
    at.identity = 'customer';
    at.addGrant(
      new VideoGrants({
        roomJoin: true,
        room: roomName,
      })
    );
    const jwtToken = await at.toJwt();

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

