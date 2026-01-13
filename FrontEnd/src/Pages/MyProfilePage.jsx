import React, { useState, useEffect } from 'react';
import { IoSettingsOutline } from "react-icons/io5";
import Setting from '../components/Setting';
import api from '../api';
import { toast } from 'react-toastify';
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import FollowersList from '../components/FollowersList';
import FollowingList from '../components/FollowingList';

const MyProfilePage = () => {
  const [datas, setDatas] = useState({});
  const [posts, setPosts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const navigate = useNavigate();

  const getUserPost = async () => {
    try {
      const response = await api.get('/post/my-post');
      setPosts(response.data.posts);
    } catch (error) {
      toast.error("Error fetching user posts");
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await api.get('/user/getuser');
      setDatas(response.data.user || {});
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const deletepost = async (postId) => {
    try {
      await api.delete(`/post/${postId}`);
      toast.success("Post Deleted Successfully");
      getUserPost();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    getUserDetails();
    getUserPost();
  }, []);

  const SelfPost = ({ post }) => {
    return (
      <div className='w-full mx-auto my-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className='w-10 h-10 rounded-full border-2 border-pink-500 p-0.5'>
              <div className='w-full h-full rounded-full overflow-hidden'>
                <img 
                  src={post.user?.profilePic || '/default-avatar.png'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="ml-3">
              <p className='font-bold text-[15px]'>{post.user?.username}</p>
            </div>
            <div className='mr-auto ml-3'>
              <MdDeleteOutline 
                className='text-[15px] cursor-pointer hover:text-red-500' 
                onClick={() => deletepost(post._id)}
              />
            </div>
          </div>
        </div>
        <div 
          className='w-full aspect-square bg-gray-100 cursor-pointer'
          onClick={() => navigate(`/post/${post._id}`)}
        >
          <img 
            src={post.post}
            alt="Post"
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='mt-16 grid grid-cols-2 gap-1'>
        <div className='w-[98%] h-[99%] p-10 mx-auto shadow-(--drop--shadow2)'>
          <div className='sticky top-16'>
            <div className='flex justify-end mb-4'>
              <IoSettingsOutline 
                className='text-3xl cursor-pointer hover:text-gray-600' 
                onClick={() => setShowSettings(prev => !prev)}
              />
              {showSettings && (
                <div className='absolute right-10 mt-10 z-10'>
                  <Setting />
                </div>
              )}
            </div>
            
            <div className='w-50 h-50 rounded-full overflow-hidden mx-auto mt-5'>
              <img 
                src={datas.profilePic || '/default-avatar.png'} 
                alt="Profile" 
                className='w-full h-full object-cover'
              />
            </div>
            
            <div className='mt-5 text-center'>
              <h2 className='text-2xl font-bold'>{datas.name}</h2>
              <p className='text-gray-600 mt-1'>@{datas.username}</p>
              <p className='mt-4 text-gray-700'>{datas.bio}</p>
            </div>
            
            <div className='flex justify-center gap-16 mt-10'>
              <div 
                className='text-center cursor-pointer hover:opacity-80 transition-opacity'
                onClick={() => setShowFollowers(true)}
              >
                <p className='font-bold text-lg'>Followers</p>
                <p className='text-blue-600 font-bold text-xl'>{datas.followersCount || 0}</p>
              </div>
              <div 
                className='text-center cursor-pointer hover:opacity-80 transition-opacity'
                onClick={() => setShowFollowing(true)}
              >
                <p className='font-bold text-lg'>Following</p>
                <p className='text-blue-600 font-bold text-xl'>{datas.followingCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className='w-full px-10'>
          <div className="grid grid-cols-2 gap-1">
            {posts.length === 0 ? (
              <div className="col-span-2 text-center mt-10">
                <p className="text-gray-500 text-lg">No posts yet</p>
              </div>
            ) : (
              posts.map((post) => (
                <SelfPost key={post._id} post={post} />
              ))
            )}
          </div>  
        </div>
      </div>

      {showFollowers && datas._id && (
        <FollowersList 
          userId={datas._id}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {showFollowing && datas._id && (
        <FollowingList 
          userId={datas._id}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </>
  );
};

export default MyProfilePage;