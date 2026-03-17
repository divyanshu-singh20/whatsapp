import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getChats } from '../api/chats';
import { getStatuses } from '../api/status';
import { getCalls } from '../api/calls';
import { Search, MessageCircle, Settings, User, Phone, Camera, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [chats, setChats] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [calls, setCalls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'chats') fetchChats();
    else if (activeTab === 'status') fetchStatuses();
    else if (activeTab === 'calls') fetchCalls();
  }, [activeTab]);

  const fetchChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const data = await getStatuses();
      setStatuses(data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchCalls = async () => {
    try {
      const data = await getCalls();
      setCalls(data);
    } catch (error) {
      console.error('Error fetching calls:', error);
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.members.find(member => member._id !== user.id);
    return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderChats = () => (
    <div className="flex-1 overflow-y-auto">
      {filteredChats.map(chat => {
        const otherUser = chat.members.find(member => member._id !== user.id);
        return (
          <Link
            key={chat._id}
            to={`/chat/${chat._id}`}
            className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-200"
          >
            <img
              src={otherUser?.profilePic || '/default-avatar.svg'}
              alt={otherUser?.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{otherUser?.name}</h3>
                <span className="text-xs text-gray-500">
                  {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString() : ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage?.text || 'No messages yet'}
                </p>
                <div className="flex items-center">
                  {otherUser?.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  const renderStatus = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">My Status</h3>
        <Link to="/status/create" className="flex items-center p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
            <Camera size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium">Add to my status</p>
            <p className="text-sm text-gray-500">Share what's on your mind</p>
          </div>
        </Link>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Updates</h3>
        {statuses.map(status => (
          <Link
            key={status._id}
            to={`/status/${status._id}`}
            className="flex items-center p-3 mb-2 bg-white rounded-lg shadow cursor-pointer hover:shadow-md"
          >
            <img
              src={status.userId.profilePic || '/default-avatar.svg'}
              alt={status.userId.name}
              className="w-12 h-12 rounded-full mr-3 border-2 border-green-500"
            />
            <div className="flex-1">
              <p className="font-medium">{status.userId.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(status.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const renderCalls = () => (
    <div className="flex-1 overflow-y-auto">
      {calls.map(call => {
        const otherUser = call.callerId._id === user.id ? call.receiverId : call.callerId;
        const isOutgoing = call.callerId._id === user.id;
        return (
          <div key={call._id} className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-200">
            <img
              src={otherUser?.profilePic || '/default-avatar.svg'}
              alt={otherUser?.name}
              className="w-12 h-12 rounded-full mr-3"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{otherUser?.name}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(call.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center">
                {call.type === 'missed' && !isOutgoing && (
                  <span className="text-red-500 mr-2">📞</span>
                )}
                <p className="text-sm text-gray-600">
                  {call.type === 'missed' ? 'Missed call' : call.type === 'received' ? 'Incoming call' : 'Outgoing call'}
                  {call.duration > 0 && ` (${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')})`}
                </p>
              </div>
            </div>
            <button className="p-2 text-green-500 hover:bg-green-100 rounded-full">
              <Phone size={20} />
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-green-600 text-white">
        <h1 className="text-xl font-semibold">WhatsApp</h1>
        <div className="flex space-x-4">
          <Link to="/search" className="hover:bg-green-700 p-2 rounded">
            <Search size={20} />
          </Link>
          <Link to="/settings" className="hover:bg-green-700 p-2 rounded">
            <Settings size={20} />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-300">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'chats' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
          }`}
        >
          <MessageCircle size={20} className="mx-auto mb-1" />
          Chats
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'status' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
          }`}
        >
          <Camera size={20} className="mx-auto mb-1" />
          Status
        </button>
        <button
          onClick={() => setActiveTab('calls')}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'calls' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
          }`}
        >
          <Phone size={20} className="mx-auto mb-1" />
          Calls
        </button>
      </div>

      {/* Search Bar (only for chats) */}
      {activeTab === 'chats' && (
        <div className="p-4 bg-white">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Content */}
      {activeTab === 'chats' && renderChats()}
      {activeTab === 'status' && renderStatus()}
      {activeTab === 'calls' && renderCalls()}

      {/* Floating Action Button */}
      <Link
        to={activeTab === 'chats' ? '/search' : activeTab === 'status' ? '/status/create' : '/calls/new'}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default Home;