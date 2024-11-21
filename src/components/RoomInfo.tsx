import { Share2, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  roomId: string;
  connectedUsers: number;
}

function RoomInfo({ roomId, connectedUsers }: Props) {
  // Properly encode the room ID in the URL
  const shareUrl = `${window.location.origin}/?room=${encodeURIComponent(
    roomId
  )}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Silent Disco',
          text: `Join my Silent Disco room with code: ${roomId}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="bg-black/20 p-6 rounded-xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">Room Code: {roomId}</h3>
          <div className="flex items-center space-x-2 text-purple-200">
            <Users className="w-4 h-4" />
            <span>{connectedUsers} connected</span>
          </div>
        </div>
        <button
          onClick={handleShare}
          className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors"
          aria-label="Share room"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center bg-white p-4 rounded-lg">
        <QRCodeSVG
          value={shareUrl}
          size={200}
          level="H"
          includeMargin
          className="mb-4"
        />
        <p className="text-black text-sm text-center">Scan to join the room</p>
      </div>

      <div className="mt-6 text-sm text-center text-purple-200">
        <p>Share this code with your friends to join the silent disco!</p>
      </div>
    </div>
  );
}

export default RoomInfo;
