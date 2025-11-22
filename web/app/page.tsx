import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, Clock, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            ServiceVoice
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-4">
            Never Miss a Call Again
          </p>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            AI voice agent that answers calls 24/7, books appointments, and handles frustrated customers with empathy.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/demo">
                Try Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>

        {/* Problem Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 mb-16 border border-white/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            The Problem
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-red-500/20 rounded-xl p-6 border border-red-300/30">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-white mb-2">30% Missed Calls</h3>
              <p className="text-white/80">
                SMBs lose 30% of customer calls because they're on jobs
              </p>
            </div>
            <div className="bg-red-500/20 rounded-xl p-6 border border-red-300/30">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">£150-300 Lost Per Call</h3>
              <p className="text-white/80">
                Each missed call represents lost revenue and frustrated customers
              </p>
            </div>
            <div className="bg-red-500/20 rounded-xl p-6 border border-red-300/30">
              <div className="text-4xl mb-4">😤</div>
              <h3 className="text-xl font-bold text-white mb-2">Frustrated Customers</h3>
              <p className="text-white/80">
                Customers expect immediate response, especially for emergencies
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            How ServiceVoice Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition">
              <Phone className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Voice AI</h3>
              <p className="text-gray-600">
                Natural voice conversations that never sleep. Answers every call instantly.
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition">
              <Calendar className="w-10 h-10 text-pink-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Smart Booking</h3>
              <p className="text-gray-600">
                Checks Google Calendar availability and books appointments automatically.
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition">
              <TrendingUp className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Distance Pricing</h3>
              <p className="text-gray-600">
                Calculates travel costs using Google Maps and quotes accurate pricing.
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition">
              <div className="text-2xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">Empathetic AI</h3>
              <p className="text-gray-600">
                Trained on 10,000+ real complaints to handle frustrated customers with empathy.
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition">
              <div className="text-2xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Diagnostic Questions</h3>
              <p className="text-gray-600">
                Asks "What's broken? Where? When?" to gather essential information.
              </p>
            </div>
            <div className="p-6 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition">
              <Clock className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Instant Response</h3>
              <p className="text-gray-600">
                No more voicemails. Customers get immediate help, every time.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Never Miss a Call?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              See ServiceVoice in action with our interactive demo
            </p>
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/demo">
                Start Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-white/70 text-sm">
          <p>Powered by: OpenAI • ElevenLabs • Livekit • Google Calendar • Google Maps</p>
        </div>
      </div>
    </div>
  );
}
