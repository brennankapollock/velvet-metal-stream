import React, { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';

interface Props {
  onJoinRoom: (roomId: string) => void;
  onCreateInstead: () => void;
}

function RoomJoin({ onJoinRoom, onCreateInstead }: Props) {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      onJoinRoom(roomId.trim());
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Join a Silent Disco Room</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium mb-2">
            Room ID
          </label>
          <input
            type="text"
            id="roomId"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            placeholder="Enter room ID"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowRight className="w-5 h-5" />
          <span>Join Room</span>
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onCreateInstead}
            className="text-purple-300 hover:text-purple-200 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Or create a new room</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default RoomJoin;