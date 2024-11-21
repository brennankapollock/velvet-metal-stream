import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function AudioStream({ channel }: AudioStreamProps) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;

      // Ensure autoplay works
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Autoplay prevented:', error);
        });
      }
    }
  }, [volume, muted]);

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="flex items-center space-x-4 bg-white/10 backdrop-blur p-4 rounded-lg">
      <audio ref={audioRef} autoPlay playsInline controls={false} />
      <button
        onClick={toggleMute}
        className="p-2 rounded-full hover:bg-white/10 transition-colors"
        aria-label={muted ? 'Unmute' : 'Mute'}
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
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-32 accent-purple-500"
        aria-label="Volume control"
      />
    </div>
  );
}
