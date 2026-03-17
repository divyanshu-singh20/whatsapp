import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api/users';
import { createChat } from '../api/chats';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Search = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUsers = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const data = await getUsers(query);
      setUsers(data.filter(u => u._id !== user.id));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, fetchUsers]);

  const handleStartChat = async (userId) => {
    try {
      const chat = await createChat(user.id, userId);
      // Navigate to chat
      window.location.href = `/chat/${chat._id}`;
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-300">
          <Link to="/" className="mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">Search Users</h1>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            users.map(user => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleStartChat(user._id)}
              >
                <div className="flex items-center">
                  <img
                    src={user.profilePic || '/default-avatar.png'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {user.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  )}
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                    Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;