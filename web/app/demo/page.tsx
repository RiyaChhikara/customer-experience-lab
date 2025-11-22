// web/app/demo/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { VoiceClient } from '@/components/demo/VoiceClient';
import { PersonaDisplay } from '@/components/demo/PersonaDisplay';
import { BookingConfirmation } from '@/components/demo/BookingConfirmation';
import { startDemo, bookAppointment, parsePersona, Persona, BookingResponse } from '@/lib/api';
import { Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [voiceConfig, setVoiceConfig] = useState<{
    roomName: string;
    token: string;
    livekitUrl: string;
  } | null>(null);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const handleStartDemo = async () => {
    setLoading(true);
    setPersona(null);
    setBooking(null);
    setVoiceConfig(null);
    setShowPhotoUpload(false);
    setShowBooking(false);
    setConversationStarted(false);

    try {
      const response = await startDemo({
        business_type: 'plumbing',
        location: 'London',
      });

      const parsedPersona = parsePersona(response.persona);
      setPersona(parsedPersona);
      setVoiceConfig({
        roomName: response.room_name,
        token: response.token,
        livekitUrl: response.livekit_url,
      });
      setConversationStarted(true);

      // Show photo upload after conversation starts (user can use it anytime)
      setTimeout(() => {
        setShowPhotoUpload(true);
      }, 2000);

      // REMOVED: Automatic booking after 5 seconds
      // Booking should now be triggered by the AI agent during conversation
      
    } catch (error) {
      console.error('Failed to start demo:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to start demo'}\n\nMake sure your backend is running at http://localhost:8000`);
    } finally {
      setLoading(false);
    }
  };

  // New function to handle booking when AI agent requests it
  const handleBookAppointment = async () => {
    if (!persona) return;
    
    try {
      const bookingResponse = await bookAppointment({
        customer_name: persona.name,
        issue: persona.issue,
        address: 'Tower Bridge, London',
        service: 'Emergency Plumbing',
      });
      setBooking(bookingResponse);
      setShowBooking(true);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    if (files.length > 0) {
      // Simulate photo analysis
      setTimeout(() => {
        console.log('Photos uploaded:', files);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <Link href="/" className="text-white/80 hover:text-white mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">ServiceVoice</h1>
          <p className="text-xl md:text-2xl text-white/90">AI Booking Agent Demo</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
          {/* Start Button */}
          <Button
            onClick={handleStartDemo}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl md:text-3xl font-bold py-6 md:py-8 rounded-xl hover:scale-105 transform transition duration-200 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-6 h-6 animate-spin" />
                Analyzing customer complaint...
              </>
            ) : (
              '🎙️ Start Demo Call'
            )}
          </Button>

          {/* Loading State */}
          {loading && (
            <div className="text-center mt-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">Analyzing customer complaint...</p>
            </div>
          )}

          {/* Persona Display */}
          {persona && (
            <>
              <PersonaDisplay persona={persona} />
              
              {/* Voice Client */}
              {voiceConfig && (
                <VoiceClient
                  roomName={voiceConfig.roomName}
                  token={voiceConfig.token}
                  livekitUrl={voiceConfig.livekitUrl}
                  onDisconnect={() => {
                    setVoiceConfig(null);
                  }}
                />
              )}

              {/* Conversation Status */}
              {conversationStarted && !showBooking && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                  <p className="text-gray-800 dark:text-gray-200">
                    💬 <strong>Talk to the AI agent</strong> - Ask about your issue, get a quote, and book an appointment through conversation.
                  </p>
                </div>
              )}

              {/* Manual Booking Button (for testing) */}
              {conversationStarted && !showBooking && (
                <div className="mt-4 text-center">
                  <Button
                    onClick={handleBookAppointment}
                    variant="outline"
                    className="px-6 py-2"
                  >
                    📅 Book Appointment (Manual - for testing)
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    In production, the AI agent will book automatically during conversation
                  </p>
                </div>
              )}

              {/* Photo Upload Section */}
              {showPhotoUpload && (
                <div className="mt-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    📸 Show us the problem
                  </h2>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-6">
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('fileInput')?.click()}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-4 rounded-lg text-xl hover:opacity-90 transition"
                    >
                      📷 Take/Upload Photos (up to 3)
                    </Button>
                    <p className="text-gray-600 dark:text-gray-400 text-center mt-3">
                      AI will analyze the damage
                    </p>
                  </div>
                </div>
              )}

              {/* Booking Confirmation */}
              {showBooking && booking && (
                <BookingConfirmation booking={booking} customerName={persona.name} />
              )}

              {/* Reset Button */}
              {(showBooking || showPhotoUpload) && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="px-8 py-3"
                  >
                    <RefreshCw className="mr-2 w-4 h-4" />
                    Try Another Demo
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/70 text-sm md:text-base">
          <p>Powered by: OpenAI • ElevenLabs • Livekit • Google Calendar • Google Maps</p>
        </div>
      </div>
    </div>
  );
}