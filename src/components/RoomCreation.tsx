import React from 'react';
import { Plus, UserPlus } from 'lucide-react';

interface Props {
  onCreateRoom: () => void;
  onJoinInstead: () => void;
}

function RoomCreation({ onCreateRoom, onJoinInstead }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Create a Silent Disco Room</h2>
      
      <div className="space-y-4">
        <button
          onClick={onCreateRoom}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Room</span>
        </button>

        <div className="text-center">
          <button
            onClick={onJoinInstead}
            className="text-purple-300 hover:text-purple-200 transition-colors flex items-center space-x-2 mx-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Or join an existing room</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomCreation;