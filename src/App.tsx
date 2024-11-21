import { Headphones } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AudioStream } from './components/AudioStream';
import MusicPlayer from './components/MusicPlayer';
import RoomCreation from './components/RoomCreation';
import RoomInfo from './components/RoomInfo';
import RoomJoin from './components/RoomJoin';
import { useAudioSync } from './hooks/useAudioSync';

function App() {
  const [view, setView] = useState<'create' | 'join' | 'room'>('create');
  const [roomId, setRoomId] = useState('');
  const { isHost, startBroadcast, stopBroadcast } = useAudioSync(roomId);
  const [connectedUsers, setConnectedUsers] = useState(1);

  useEffect(() => {
    // Check URL for room parameter
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomId(roomParam);
      setView('room');
    }
  }, []);

  const handleCreateRoom = () => {
    const newRoomId = uuidv4().slice(0, 8);
    setRoomId(newRoomId);
    setView('room');
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    setView('room');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Headphones className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Silent Disco</h1>
          <p className="text-gray-300">
            {view === 'room'
              ? isHost
                ? 'DJ Mode - Start the party!'
                : 'Ready to dance!'
              : 'Create or join a room to start'}
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          {view === 'create' && (
            <RoomCreation
              onCreateRoom={handleCreateRoom}
              onJoinInstead={() => setView('join')}
            />
          )}

          {view === 'join' && (
            <RoomJoin
              onJoinRoom={handleJoinRoom}
              onCreateInstead={() => setView('create')}
            />
          )}

          {view === 'room' && (
            <div className="space-y-6">
              <RoomInfo roomId={roomId} connectedUsers={connectedUsers} />

              {isHost ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">DJ Controls</h2>
                  <MusicPlayer
                    isHost={isHost}
                    onPlay={startBroadcast}
                    onPause={stopBroadcast}
                    onSync={() => {}}
                  />
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-4">Listener Controls</h2>
                  <AudioStream channel={roomId} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
