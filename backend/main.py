from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from elevenlabs import ElevenLabs
from livekit import api
from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime, timedelta

load_dotenv()

# Load RAG database
with open('company_rag.json') as f:
    company_rag = json.load(f)

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
elevenlabs_client = ElevenLabs(api_key=os.getenv('ELEVENLABS_API_KEY'))

# Don't initialize Livekit here - we'll create it per request

# Google Calendar
SCOPES = ['https://www.googleapis.com/auth/calendar']
creds = service_account.Credentials.from_service_account_file(
    'google-credentials.json', scopes=SCOPES)
calendar_service = build('calendar', 'v3', credentials=creds)


class DemoRequest(BaseModel):
    business_type: str = "plumbing"
    location: str = "London"

@app.post("/api/ask-company")
async def ask_company(question: dict):
    """Query company knowledge base"""
    user_question = question.get('question', '')
    
    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{
            "role": "system",
            "content": f"""You are QuickFix Plumbing's AI assistant.

COMPLETE COMPANY KNOWLEDGE:
{json.dumps(company_rag, indent=2)}

Answer questions about services, pricing, availability using ONLY this information."""
        }, {
            "role": "user",
            "content": user_question
        }]
    )
    
    return {
        "answer": response.choices[0].message.content,
        "source": "company_rag"
    }

@app.post("/api/start-demo")
async def start_demo(request: DemoRequest):
    try:
        # Create Livekit API instance inside async function
        livekit_api = api.LiveKitAPI(
            url=os.getenv('LIVEKIT_URL'),
            api_key=os.getenv('LIVEKIT_API_KEY'),
            api_secret=os.getenv('LIVEKIT_API_SECRET')
        )
        
        # 1. Generate persona from hardcoded complaint
        complaint = """
        Called for emergency plumbing at 8am. They said 30 minutes. 
        Waited 3 HOURS. Basement flooding. When he showed up, rude and 
        quoted $800 just to look. Tried upselling $5000 pipe replacement!
        """
        
        persona_response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "system",
                "content": "Create a JSON persona with: name, age, issue, emotion, priority (1-10). Be concise."
            }, {
                "role": "user",
                "content": f"Complaint: {complaint}"
            }],
            temperature=0.7
        )
        
        persona = persona_response.choices[0].message.content
        
        # 2. Create Livekit room
        room_name = f"demo-{datetime.now().timestamp()}"
        room = await livekit_api.room.create_room(
            api.CreateRoomRequest(name=room_name)
        )
        
        # 3. Generate access token
        token = api.AccessToken(
            os.getenv('LIVEKIT_API_KEY'),
            os.getenv('LIVEKIT_API_SECRET')
        )
        token.with_identity("customer")
        token.with_grants(api.VideoGrants(room_join=True, room=room_name))
        jwt_token = token.to_jwt()
        
        await livekit_api.aclose()  # Close the session
        
        return {
            "success": True,
            "persona": persona,
            "room_name": room_name,
            "token": jwt_token,
            "livekit_url": os.getenv('LIVEKIT_URL')
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# backend/main.py - Update the book_appointment function
@app.post("/api/book-appointment")
async def book_appointment(data: dict):
    try:
        # Book in Google Calendar
        event = {
            'summary': f"Emergency {data.get('service', 'Plumbing')}",
            'location': data.get('address', ''),
            'description': f"Customer: {data.get('customer_name')}\nIssue: {data.get('issue')}\nPriority: HIGH",
            'start': {
                'dateTime': (datetime.now() + timedelta(hours=1)).isoformat(),
                'timeZone': 'Europe/London',
            },
            'end': {
                'dateTime': (datetime.now() + timedelta(hours=2)).isoformat(),
                'timeZone': 'Europe/London',
            },
        }
        
        result = calendar_service.events().insert(
            calendarId=os.getenv('GOOGLE_CALENDAR_ID'), 
            body=event
        ).execute()
        
        # Add pricing information (mock data for now - you can integrate Google Maps API later)
        pricing = {
            "base_price": 150,
            "travel_fee": 20,
            "total_price": 170,
            "distance_text": "5.2 miles",
            "duration_text": "15 minutes"
        }
        
        return {
            "success": True,
            "booking_url": result.get('htmlLink'),
            "appointment_time": event['start']['dateTime'],
            "pricing": pricing  # Add this line
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)