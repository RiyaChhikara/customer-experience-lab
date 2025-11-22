// LiveKit client configuration and utilities
import { Room, RoomEvent, Track } from 'livekit-client';

export interface LiveKitConfig {
  url: string;
  token: string;
  roomName: string;
}

export async function connectToRoom(config: LiveKitConfig): Promise<Room> {
  const room = new Room({
    // Enable audio
    audioCaptureDefaults: {
      deviceId: 'default',
    },
    // Publish audio tracks
    publishDefaults: {
      audioPreset: {
        maxBitrate: 16000,
      },
    },
  });

  // Handle track subscriptions
  room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
    if (track.kind === Track.Kind.Audio) {
      const audioElement = track.attach();
      audioElement.autoplay = true;
      // Audio element will be handled by the component
      return audioElement;
    }
  });

  // Connect to room
  await room.connect(config.url, config.token);
  
  // Enable microphone
  await room.localParticipant.setMicrophoneEnabled(true);

  return room;
}

export function disconnectFromRoom(room: Room): void {
  room.disconnect();
}

