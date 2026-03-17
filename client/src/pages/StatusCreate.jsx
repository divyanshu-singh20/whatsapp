import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createStatus } from '../api/status';
import { ArrowLeft, Camera, Type } from 'lucide-react';

const StatusCreate = () => {
  const [statusType, setStatusType] = useState('text');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      let media = text;
      if (statusType === 'image' && image) {
        // In a real app, you'd upload to cloud storage
        media = preview; // For demo, using base64
      }
      await createStatus({ media, type: statusType });
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-300">
          <Link to="/" className="mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-semibold">Add Status</h1>
        </div>

        {/* Status Type Selection */}
        <div className="p-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setStatusType('text')}
              className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                statusType === 'text' ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
            >
              <Type size={20} className="mr-2" />
              Text
            </button>
            <button
              onClick={() => setStatusType('image')}
              className={`flex-1 flex items-center justify-center p-3 rounded-lg border ${
                statusType === 'image' ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
            >
              <Camera size={20} className="mr-2" />
              Image
            </button>
          </div>

          {/* Text Status */}
          {statusType === 'text' && (
            <div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
              />
              <div className="mt-4 text-center">
                <div
                  className="inline-block p-4 rounded-lg text-white text-2xl font-bold"
                  style={{ background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)' }}
                >
                  {text || 'Your Text'}
                </div>
              </div>
            </div>
          )}

          {/* Image Status */}
          {statusType === 'image' && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              {preview && (
                <div className="mt-4 text-center">
                  <img src={preview} alt="Preview" className="max-w-full h-64 object-cover rounded-lg mx-auto" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="p-4 border-t border-gray-300">
          <button
            onClick={handleSubmit}
            disabled={!text && !image}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
          >
            Share Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusCreate;