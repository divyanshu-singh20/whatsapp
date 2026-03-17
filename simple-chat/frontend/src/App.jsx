import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5001');

function App() {
  const [currentUser, setCurrentUser] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users] = useState(['user1', 'user2', 'user3']); // Mock users
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      socket.emit('join', currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (currentUser && selectedUser) {
      try {
        const response = await axios.get(`http://localhost:5001/api/messages/${currentUser}/${selectedUser}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  };

  useEffect(() => {
    loadMessages();
  }, [currentUser, selectedUser]);

  const sendMessage = () => {
    if (message.trim() && currentUser && selectedUser) {
      const messageData = {
        senderId: currentUser,
        receiverId: selectedUser,
        text: message.trim(),
      };

      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Simple Chat</h1>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your user ID:
            </label>
            <input
              type="text"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., user1"
            />
          </div>
          <button
            onClick={() => setCurrentUser(currentUser.trim())}
            disabled={!currentUser.trim()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-300">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-gray-500">Logged in as: {currentUser}</p>
        </div>
        <div className="overflow-y-auto">
          {users.filter(user => user !== currentUser).map(user => (
            <div
              key={user}
              onClick={() => setSelectedUser(user)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedUser === user ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  {user.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user}</p>
                  <p className="text-sm text-gray-500">Click to chat</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-300">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  {selectedUser.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-lg font-semibold">{selectedUser}</h3>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderId === currentUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-900'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t border-gray-300">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                💬
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to Simple Chat</h2>
              <p className="text-gray-500">Select a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;