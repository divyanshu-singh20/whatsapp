import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMessages, sendMessage, markAsSeen } from '../api/messages';
import { ArrowLeft, Send, Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const { user } = useAuth();

  useEffect(() => {
    socketRef.current = io('https://whatsapp-oymf.onrender.com');
    socketRef.current.emit('join', user.id);
    socketRef.current.emit('joinChat', chatId);

    socketRef.current.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('userTyping', (userId) => {
      if (userId !== user.id) setTyping(true);
    });

    socketRef.current.on('userStopTyping', (userId) => {
      if (userId !== user.id) setTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatId, user.id]);

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(chatId);
      setMessages(data);
      await markAsSeen(chatId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await sendMessage(chatId, newMessage);
      socketRef.current.emit('sendMessage', { chatId, message });
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      socketRef.current.emit('stopTyping', { chatId, userId: user.id });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    socketRef.current.emit('typing', { chatId, userId: user.id });
    setTimeout(() => {
      socketRef.current.emit('stopTyping', { chatId, userId: user.id });
    }, 1000);
  };

  const onEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center p-4 bg-white border-b border-gray-300">
          <Link to="/" className="mr-4">
            <ArrowLeft size={24} />
          </Link>
          <img
            src="/default-avatar.svg"
            alt="User"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="font-semibold">Chat User</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map(message => (
            <div
              key={message._id}
              className={`flex mb-4 ${
                message.senderId._id === user.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.senderId._id === user.id
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString()}
                  {message.seen && message.senderId._id === user.id && ' ✓✓'}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start mb-4">
              <div className="bg-white px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-300">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mr-2 p-2 text-gray-500 hover:text-gray-700"
            >
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <Send size={20} />
            </button>
          </form>
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-4">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;