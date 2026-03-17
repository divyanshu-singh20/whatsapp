import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Bell, BellOff } from 'lucide-react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement dark mode toggle logic
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // Implement notification toggle logic
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-300">
          <Link to="/" className="mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>

        {/* Settings Options */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center">
              {darkMode ? <Moon size={24} className="mr-3" /> : <Sun size={24} className="mr-3" />}
              <span className="text-lg">Dark Mode</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full ${darkMode ? 'bg-green-500' : 'bg-gray-300'} relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div className="flex items-center">
              {notifications ? <Bell size={24} className="mr-3" /> : <BellOff size={24} className="mr-3" />}
              <span className="text-lg">Notifications</span>
            </div>
            <button
              onClick={toggleNotifications}
              className={`w-12 h-6 rounded-full ${notifications ? 'bg-green-500' : 'bg-gray-300'} relative`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              ></div>
            </button>
          </div>

          <Link
            to="/profile"
            className="flex items-center justify-between py-4 border-b border-gray-200"
          >
            <span className="text-lg">Profile</span>
            <ArrowLeft size={20} className="rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;