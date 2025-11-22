'use client';

import { useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceClientProps {
  roomName: string;
  token: string;
  livekitUrl: string;
  onDisconnect?: () => void;
}

export function VoiceClient({ roomName, token, livekitUrl, onDisconnect }: VoiceClientProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContainerRef = useRef<HTMLDivElement>(null);

  // Check if getUserMedia is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navigator = window.navigator;
      const mediaDevices = navigator?.mediaDevices;
      
      if (!mediaDevices || !mediaDevices.getUserMedia) {
        setError('Microphone access not available. Please use HTTPS or localhost.');
        console.error('getUserMedia not available:', {
          hasNavigator: !!navigator,
          hasMediaDevices: !!mediaDevices,
          hasGetUserMedia: !!mediaDevices?.getUserMedia,
        });
      }
    }
  }, []);

  useEffect(() => {
    let currentRoom: Room | null = null;
    let isMounted = true;

    async function connect() {
      // Check prerequisites
      if (typeof window === 'undefined') {
        setError('Browser environment required');
        return;
      }

      const navigator = window.navigator;
      if (!navigator?.mediaDevices?.getUserMedia) {
        setError('Microphone access requires HTTPS or localhost. Current protocol: ' + window.location.protocol);
        return;
      }

      try {
        // Request microphone permission first
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permError) {
          setError('Microphone permission denied. Please allow access and try again.');
          console.error('Permission error:', permError);
          return;
        }

        const newRoom = new Room({
          audioCaptureDefaults: {
            deviceId: 'default',
          },
        });

        currentRoom = newRoom;

        // Handle incoming audio tracks
        newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === Track.Kind.Audio) {
            const audioElement = track.attach();
            audioElement.autoplay = true;
            audioElement.volume = 1.0;
            
            if (audioContainerRef.current) {
              audioContainerRef.current.innerHTML = '';
              audioContainerRef.current.appendChild(audioElement);
            }
            
            audioRef.current = audioElement;
          }
        });

        // Connect to room
        await newRoom.connect(livekitUrl, token);
        await newRoom.localParticipant.setMicrophoneEnabled(true);
        
        if (isMounted) {
          setRoom(newRoom);
          setIsConnected(true);
          setError(null);
          console.log('✅ Connected to LiveKit room:', roomName);
        }
      } catch (error) {
        console.error('❌ Failed to connect to room:', error);
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setError(`Failed to connect: ${errorMessage}`);
        }
      }
    }

    if (!error) {
      connect();
    }

    return () => {
      isMounted = false;
      if (currentRoom) {
        currentRoom.disconnect();
      }
    };
  }, [roomName, token, livekitUrl, error]);

  const toggleMute = async () => {
    if (!room) return;
    
    const newMutedState = !isMuted;
    await room.localParticipant.setMicrophoneEnabled(!newMutedState);
    setIsMuted(newMutedState);
  };

  const hangUp = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
      if (onDisconnect) {
        onDisconnect();
      }
    }
  };

  return (
    <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-300 dark:border-blue-700">
      <p className="font-bold text-xl mb-3 text-gray-800 dark:text-gray-200">
        🎙️ Voice Call {isConnected ? 'Active' : 'Connecting...'} - Speak Now!
      </p>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
          {error.includes('HTTPS') && (
            <p className="text-red-600 dark:text-red-400 text-xs mt-2">
              💡 Tip: Use <code>http://localhost:3000</code> for development or deploy to Vercel for HTTPS.
            </p>
          )}
        </div>
      )}
      
      <div className="flex gap-2">
        <Button
          onClick={toggleMute}
          disabled={!isConnected}
          variant={isMuted ? 'outline' : 'default'}
          className="flex items-center gap-2"
        >
          {isMuted ? (
            <>
              <MicOff className="w-4 h-4" />
              Unmute
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Mute
            </>
          )}
        </Button>
        <Button
          onClick={hangUp}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <PhoneOff className="w-4 h-4" />
          Hang Up
        </Button>
      </div>
      <div ref={audioContainerRef} className="mt-4" />
      {!isConnected && !error && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Connecting to voice call...
        </p>
      )}
    </div>
  );
}