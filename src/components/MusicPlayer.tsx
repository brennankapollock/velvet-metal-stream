import React, { useState, useRef } from 'react';
import { Play, Pause, Upload } from 'lucide-react';

interface Props {
  isHost: boolean;
  onPlay: (audioFile: File) => void;
  onPause: () => void;
  onSync: () => void;
}

function MusicPlayer({ isHost, onPlay, onPause, onSync }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
    }
  };

  const handlePlayPause = () => {
    if (file) {
      if (isPlaying) {
        onPause();
      } else {
        onPlay(file);
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-4">
      {isHost && (
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Music</span>
          </button>
          {file && <span className="text-sm opacity-75">{file.name}</span>}
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button
          onClick={handlePlayPause}
          disabled={!file && isHost}
          className={`${
            isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          } text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>
    </div>
  );
}

export default MusicPlayer;