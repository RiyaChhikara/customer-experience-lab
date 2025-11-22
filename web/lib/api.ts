// API client for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface DemoRequest {
  business_type?: string;
  location?: string;
}

export interface Persona {
  name: string;
  age: number;
  issue: string;
  emotion: string;
  priority: number;
}

export interface StartDemoResponse {
  success: boolean;
  persona: string; // JSON string
  room_name: string;
  token: string;
  livekit_url: string;
}

export interface BookingRequest {
  customer_name: string;
  issue: string;
  address: string;
  service: string;
}

export interface Pricing {
  base_price: number;
  travel_fee: number;
  total_price: number;
  distance_text: string;
  duration_text: string;
}

export interface BookingResponse {
  success: boolean;
  booking_url: string;
  appointment_time: string;
  pricing: Pricing;
}

export async function startDemo(request: DemoRequest = {}): Promise<StartDemoResponse> {
  const response = await fetch(`${API_BASE_URL}/api/start-demo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      business_type: request.business_type || 'plumbing',
      location: request.location || 'London',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start demo: ${response.statusText}`);
  }

  return response.json();
}

export async function bookAppointment(request: BookingRequest): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/api/book-appointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to book appointment: ${response.statusText}`);
  }

  return response.json();
}

export function parsePersona(personaJson: string): Persona {
  try {
    return JSON.parse(personaJson);
  } catch (error) {
    throw new Error('Failed to parse persona JSON');
  }
}

