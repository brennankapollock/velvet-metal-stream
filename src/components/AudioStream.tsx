import { Volume2, VolumeX } from 'lucide-react';
import { Peer } from 'peerjs';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AudioStreamProps {
  channel: string;
}

export function AudioStream({ channel }: AudioStreamProps) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [peerId] = useState(() => `disco-${channel}-${uuidv4()}`);
  const audioRef = useRef<HTMLAudioElement>(null);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer(peerId);
    peerRef.current = peer;

    peer.on('open', () => {
      console.log('Connected with ID:', peerId);
    });

    peer.on('call', (call) => {
      call.answer(); // Answer the call without sending a stream (listener mode)

      call.on('stream', (remoteStream) => {
        if (audioRef.current) {
          audioRef.current.srcObject = remoteStream;
        }
      });
    });

    return () => {
      peer.destroy();
    };
  }, [peerId]);

  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white/10 backdrop-blur p-4 rounded-lg">
      <audio ref={audioRef} autoPlay playsInline />
      <button
        onClick={toggleMute}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        {muted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="w-32 accent-purple-500"
      />
    </div>
  );
}
