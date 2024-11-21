import { Peer } from 'peerjs';
import { useCallback, useRef, useState } from 'react';

export function useAudioSync(roomId: string) {
  const [isHost] = useState(() => !window.location.search.includes('room='));
  const peerRef = useRef<Peer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const initializeAudio = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  const startBroadcast = useCallback(
    async (file: File) => {
      const audioContext = await initializeAudio();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      source.connect(audioContext.destination); // Also play locally

      sourceRef.current?.disconnect();
      sourceRef.current = null;

      source.start(0);
      sourceRef.current = source;

      // Broadcast to all connected peers
      if (peerRef.current) {
        const connections = peerRef.current.connections;
        Object.values(connections).forEach((conns) => {
          conns.forEach((conn) => {
            if (conn.type === 'media') {
              (conn as any).peerConnection
                .getSenders()
                .forEach((sender: any) => {
                  if (sender.track.kind === 'audio') {
                    sender.replaceTrack(destination.stream.getAudioTracks()[0]);
                  }
                });
            }
          });
        });
      }
    },
    [initializeAudio]
  );

  const stopBroadcast = useCallback(() => {
    sourceRef.current?.stop();
    sourceRef.current = null;
  }, []);

  return {
    isHost,
    startBroadcast,
    stopBroadcast,
  };
}
