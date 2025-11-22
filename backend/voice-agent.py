# backend/voice-agent.py
import asyncio
import os
from dotenv import load_dotenv
from livekit import agents, rtc
from livekit.agents import (
    JobContext,
    WorkerOptions,
    cli,
    llm,
    AgentSession,
    Agent,
)
from livekit.plugins import openai, elevenlabs, deepgram, silero

load_dotenv()

# Load company RAG knowledge
import json
with open('company_rag.json') as f:
    company_knowledge = json.load(f)


class PlumbingAssistant(Agent):
    def __init__(self):
        super().__init__(
            instructions=f"""You are QuickFix Plumbing AI.

COMPANY INFO:
{json.dumps(company_knowledge, indent=2)}

Ask: What's wrong? Where? When?
Quote prices. Book appointment.
SHORT answers only."""
        )


async def entrypoint(ctx: JobContext):
    """Voice assistant entry point"""
    
    await ctx.connect()
    participant = await ctx.wait_for_participant()
    
    # Create agent session (new v1.0+ API)
    session = AgentSession(
        vad=silero.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=elevenlabs.TTS(
            voice_id="21m00Tcm4TlvDq8ikWAM",
            model_id="eleven_turbo_v2"
        ),
    )
    
    # Create assistant instance
    assistant = PlumbingAssistant()
    
    # Start the session
    await session.start(
        room=ctx.room,
        agent=assistant,
    )
    
    # Say initial greeting
    await asyncio.sleep(1)
    await session.generate_reply(instructions="Say: QuickFix Plumbing. What's the emergency?")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))