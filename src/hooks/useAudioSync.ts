import { Peer } from 'peerjs';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudioSync(roomId: string) {
  const [isHost] = useState(() => !window.location.search.includes('room='));
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);
  const peerRef = useRef<Peer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const peer = new Peer(`disco-${roomId}-${isHost ? 'host' : Date.now()}`);
    peerRef.current = peer;

    peer.on('open', (id) => {
      console.log('Connected with ID:', id);

      if (!isHost) {
        // Listeners connect to host
        const conn = peer.connect(`disco-${roomId}-host`);
        conn.on('open', () => {
          console.log('Connected to host');
          // Call the host
          const call = peer.call(`disco-${roomId}-host`, new MediaStream());

          call.on('stream', (remoteStream) => {
            console.log('Received remote stream');
            mediaStreamRef.current = remoteStream;

            // Find the audio element and set the stream
            const audioElements = document.getElementsByTagName('audio');
            if (audioElements.length > 0) {
              const audioElement = audioElements[0];
              audioElement.srcObject = remoteStream;
              audioElement.play().catch(console.error);
            }
          });
        });
      }
    });

    if (isHost) {
      peer.on('connection', (conn) => {
        console.log('Listener connected:', conn.peer);
        setConnectedPeers((prev) => [...prev, conn.peer]);

        conn.on('close', () => {
          setConnectedPeers((prev) => prev.filter((p) => p !== conn.peer));
        });
      });

      peer.on('call', (call) => {
        console.log('Received call from listener');
        if (mediaStreamRef.current) {
          console.log('Answering with current stream');
          call.answer(mediaStreamRef.current);
        } else {
          console.log('No stream available yet, answering with empty stream');
          const emptyStream =
            audioContextRef.current!.createMediaStreamDestination().stream;
          call.answer(emptyStream);
        }
      });
    }

    return () => {
      peer.destroy();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [roomId, isHost]);

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
      mediaStreamRef.current = destination.stream;

      // Update all existing calls with the new stream
      if (peerRef.current) {
        Object.values(peerRef.current.connections).forEach((conns) => {
          conns.forEach((conn: any) => {
            if (conn.type === 'media') {
              conn.peerConnection
                .getSenders()
                .forEach((sender: RTCRtpSender) => {
                  if (sender.track?.kind === 'audio') {
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
    mediaStreamRef.current = null;
  }, []);

  return {
    isHost,
    startBroadcast,
    stopBroadcast,
    connectedPeers: connectedPeers.length,
  };
}
