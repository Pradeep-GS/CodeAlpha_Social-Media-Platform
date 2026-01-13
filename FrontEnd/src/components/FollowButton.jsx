// components/FollowButton.jsx
import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

const FollowButton = ({ targetUserId, initialIsFollowing, onFollowUpdate }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (isLoading) return;
    
    console.log('Attempting to follow user with ID:', targetUserId);
    console.log('Current follow state:', isFollowing);
    
    setIsLoading(true);
    try {
      const response = await api.put(`/user/${targetUserId}/follow`);
      console.log('Follow response:', response.data);
      setIsFollowing(true);
      toast.success(response.data.message);
      if (onFollowUpdate) {
        onFollowUpdate(response.data.followingCount, response.data.followersCount);
      }
    } catch (error) {
      console.error('Follow error:', error);
      console.error('Error response:', error.response?.data);
      
      // If already following, update the state to match
      if (error.response?.data?.message === "Already following this user") {
        setIsFollowing(true);
        toast.info("You are already following this user");
      } else {
        toast.error(error.response?.data?.message || 'Failed to follow user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (isLoading) return;
    
    console.log('Attempting to unfollow user with ID:', targetUserId);
    console.log('Current follow state:', isFollowing);
    
    setIsLoading(true);
    try {
      const response = await api.put(`/user/${targetUserId}/unfollow`);
      console.log('Unfollow response:', response.data);
      setIsFollowing(false);
      toast.success(response.data.message);
      if (onFollowUpdate) {
        onFollowUpdate(response.data.followingCount, response.data.followersCount);
      }
    } catch (error) {
      console.error('Unfollow error:', error);
      console.error('Error response:', error.response?.data);
      
      // If not following, update the state to match
      if (error.response?.data?.message === "Not following this user") {
        setIsFollowing(false);
        toast.info("You are not following this user");
      } else {
        toast.error(error.response?.data?.message || 'Failed to unfollow user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFollowing) {
    return (
      <button
        onClick={handleUnfollow}
        disabled={isLoading}
        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Following'}
      </button>
    );
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
    >
      {isLoading ? 'Loading...' : 'Follow'}
    </button>
  );
};

export default FollowButton;