import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { updateUser } from '../api/users';
import { 
  ArrowLeft, 
  Camera, 
  LogOut, 
  User, 
  MessageSquare, 
  Bell, 
  HardDrive, 
  HelpCircle, 
  UserPlus, 
  ChevronRight,
  Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    status: '',
    profilePic: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        status: user.status || '',
        profilePic: user.profilePic || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Privacy', action: () => alert('Privacy settings') },
        { label: 'Security', action: () => alert('Security settings') },
        { label: 'Two-step verification', action: () => alert('Two-step verification') },
      ]
    },
    {
      title: 'Chats',
      icon: MessageSquare,
      items: [
        { label: 'Theme', action: () => alert('Theme settings') },
        { label: 'Wallpaper', action: () => alert('Wallpaper settings') },
        { label: 'Chat history', action: () => alert('Chat history') },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Message notifications', action: () => alert('Message notifications') },
        { label: 'Group notifications', action: () => alert('Group notifications') },
        { label: 'Call notifications', action: () => alert('Call notifications') },
      ]
    },
    {
      title: 'Storage and data',
      icon: HardDrive,
      items: [
        { label: 'Network usage', action: () => alert('Network usage') },
        { label: 'Storage usage', action: () => alert('Storage usage') },
        { label: 'Manage storage', action: () => alert('Manage storage') },
      ]
    },
    {
      title: 'Help',
      icon: HelpCircle,
      items: [
        { label: 'Help center', action: () => alert('Help center') },
        { label: 'Contact us', action: () => alert('Contact us') },
        { label: 'Terms and privacy policy', action: () => alert('Terms and privacy policy') },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <Link to="/" className="mr-4 text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
        </div>

        {/* Profile Info */}
        <div className="p-6 bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={formData.profilePic || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <button 
                onClick={() => alert('Change profile picture')}
                className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition-colors"
              >
                <Camera size={16} />
              </button>
            </div>
            
            <div className="w-full space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-medium text-gray-800">{user?.name}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-green-500 hover:text-green-600"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">About</p>
                <p className="text-lg font-medium text-gray-800">{user?.status || 'Hey there! I am using WhatsApp'}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <p className="text-lg font-medium text-gray-800">{user?.phone || '+91 9876543210'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="p-6 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your status"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Settings Sections */}
        <div className="mt-6">
          {settingsSections.map((section, index) => (
            <div key={index} className="mb-2">
              <div className="px-6 py-2 bg-gray-100">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{section.title}</h2>
              </div>
              <div className="bg-white">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-800 font-medium">{item.label}</span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Invite Friend */}
          <div className="bg-white border-t border-gray-200">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <UserPlus size={20} className="text-gray-600 mr-3" />
                <span className="text-gray-800 font-medium">Invite a friend</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Logout */}
          <div className="bg-white border-t border-gray-200 mt-6">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-4 text-red-500 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="p-6 text-center text-gray-500 text-sm">
          WhatsApp Clone v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Profile;