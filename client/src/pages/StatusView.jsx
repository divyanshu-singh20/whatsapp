import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStatuses } from '../api/status';
import { ArrowLeft, MoreVertical } from 'lucide-react';

const StatusView = () => {
  const { statusId } = useParams();
  const [statuses, setStatuses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (statuses.length > 0 && statusId) {
      const index = statuses.findIndex(s => s._id === statusId);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [statuses, statusId]);

  const fetchStatuses = async () => {
    try {
      const data = await getStatuses();
      setStatuses(data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const nextStatus = () => {
    setCurrentIndex((prev) => (prev + 1) % statuses.length);
  };

  const prevStatus = () => {
    setCurrentIndex((prev) => (prev - 1 + statuses.length) % statuses.length);
  };

  const currentStatus = statuses[currentIndex];

  if (!currentStatus) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between text-white">
          <Link to="/" className="p-2">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center">
            <img
              src={currentStatus.userId.profilePic || '/default-avatar.png'}
              alt={currentStatus.userId.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="font-medium">{currentStatus.userId.name}</p>
              <p className="text-sm opacity-75">
                {new Date(currentStatus.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button className="p-2">
            <MoreVertical size={24} />
          </button>
        </div>
      </div>

      {/* Status Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        {currentStatus.type === 'text' ? (
          <div className="text-center">
            <div
              className="text-6xl font-bold text-white p-8 rounded-lg"
              style={{ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)' }}
            >
              {currentStatus.media}
            </div>
          </div>
        ) : (
          <img
            src={currentStatus.media}
            alt="Status"
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Navigation */}
      <button
        onClick={prevStatus}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white p-4"
      >
        ‹
      </button>
      <button
        onClick={nextStatus}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white p-4"
      >
        ›
      </button>

      {/* Progress Bar */}
      <div className="absolute top-20 left-4 right-4 flex space-x-1">
        {statuses.map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-1 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StatusView;