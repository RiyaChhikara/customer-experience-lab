import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize Google Calendar
function getCalendarService() {
  const credentials = process.env.GOOGLE_CREDENTIALS;
  if (!credentials) {
    throw new Error('GOOGLE_CREDENTIALS environment variable is not set');
  }

  const credentialsJson = JSON.parse(credentials);
  const auth = new google.auth.GoogleAuth({
    credentials: credentialsJson,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const calendarService = getCalendarService();

    // Book in Google Calendar
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    const event = {
      summary: `Emergency ${data.service || 'Plumbing'}`,
      location: data.address || '',
      description: `Customer: ${data.customer_name}\nIssue: ${data.issue}\nPriority: HIGH`,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'Europe/London',
      },
    };

    const result = await calendarService.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    // Add pricing information (mock data for now - you can integrate Google Maps API later)
    const pricing = {
      base_price: 150,
      travel_fee: 20,
      total_price: 170,
      distance_text: '5.2 miles',
      duration_text: '15 minutes',
    };

    return NextResponse.json({
      success: true,
      booking_url: result.data.htmlLink,
      appointment_time: event.start.dateTime,
      pricing: pricing,
    });
  } catch (error) {
    console.error('Error in book-appointment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to book appointment' },
      { status: 500 }
    );
  }
}

