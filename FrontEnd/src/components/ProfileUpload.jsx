import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiUser, FiCamera, FiX } from 'react-icons/fi';
import api from '../api';
const ProfileUpload = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePic(null);
    setPreviewUrl('');
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', profilePic);
      formData.append('bio', bio);

      const response = await api.put('/user/upload-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/feed');
    } catch (err) {
      console.error('Profile upload error:', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
};

  const handleSkip = () => {
    navigate('/feed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-r from-blue-50 to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-purple-100 to-pink-100 rounded-full mb-4">
            <FiUser className="text-3xl text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Add a profile picture to get started</p>
        </div>

        {/* Profile Picture Upload */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="relative">
              {/* Profile Picture Preview */}
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden">
                {previewUrl ? (
                  <>
                    <img 
                      src={previewUrl} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={handleRemovePhoto}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full bg-linear-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                    <FiCamera className="text-gray-400 text-4xl" />
                  </div>
                )}
              </div>
              
              {/* Upload Button */}
              <label className="absolute bottom-2 right-2 bg-purple-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition-colors">
                <FiUpload size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {/* Upload Hint */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Click the upload button to add a profile picture
          </p>
        </div>

        {/* Bio Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio (Optional)
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Tell us about yourself..."
            rows="4"
            maxLength="150"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {bio.length}/150 characters
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleSubmit}
            disabled={!profilePic || loading}
            className="w-full bg-linear-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              'Complete Setup'
            )}
          </button>
          
          <button
            onClick={handleSkip}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Skip for now
          </button>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-8 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpload;