import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiCamera, FiSave, FiArrowLeft } from 'react-icons/fi';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [userData, setUserData] = useState({
    name: 'Pradeep G.S',
    username: '_editor_pradeep',
    email: 'pradeep@example.com',
    bio: 'Frontend Developer • Photographer • Traveler\n📍 Chennai, India',
    website: 'https://pradeepgs.me',
    gender: 'Male',
    phone: '+91 9876543210'
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      console.log('Updated data:', userData);
      navigate('/profile');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
                  <img
                    src={previewUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-700">
                  <FiCamera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-gray-600 text-sm mt-4">Click camera icon to change photo</p>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">@</span>
                  <input
                    type="text"
                    value={userData.username}
                    onChange={(e) => setUserData({...userData, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Website */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="url"
                  value={userData.website}
                  onChange={(e) => setUserData({...userData, website: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="https://"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={userData.bio}
                  onChange={(e) => setUserData({...userData, bio: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  rows="4"
                  placeholder="Tell your story..."
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {userData.bio.length}/150 characters
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold mr-4 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
              >
                <FiSave className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;