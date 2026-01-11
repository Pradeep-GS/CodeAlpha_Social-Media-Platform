import React, { use, useState } from 'react'
import Post from '../components/Post'
import { IoSettingsOutline } from "react-icons/io5";
import Setting from '../components/Setting';
import api from '../api'
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { data } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";

const MyProfilePage = () => {
    const [datas, setDatas] = useState([]);
    const [posts, setPosts] = useState([]);

    const getUserPost = async () => {
        try {
            const response = await api.get('/post/my-post');
            console.log(response.data);
            setPosts(response.data.posts);
        } catch (error) {
            toast.error("Error fetching user posts");
        }
    }
    const getUserDetails = async () => {
        try {
            const response = await api.get('/user/getuser');
            setDatas(response.data.user);
            console.log(response.data.post);
        } catch (error) {
            toast.error("Error fetching user details");
        }
    }
    useEffect(() => {
        getUserDetails();
        getUserPost();
    } , []);

    const deletepost = async(postId) => {
        try {
            const response = await api.delete(`/post/${postId}`);
            toast.success("Post Deleted Successfully");
            window.location.reload();
        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    
    }
      

    const [showSettings, setShowSettings] = useState(false);
    const SelfPost = ({post}) => {
        return (
            <div className='w-full mx-auto my-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                        <div className='w-10 h-10 rounded-full border-2 border-pink-500 p-0.5'>
                            <div className='w-full h-full rounded-full overflow-hidden'>
                                <img 
                                    src={post.user.profilePic}
                                    alt="test"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className='font-bold text-[15px]'>{post.user.username}</p>
                        </div>
                        <div className='mr-auto ml-3'>
                            <MdDeleteOutline className=' text-[15px] cursor-pointer' onClick={() => deletepost(post._id)}/>
                        </div>
                    </div>
                </div>
                <div className='w-full aspect-square bg-gray-100'>
                    <img 
                        src={post.post}
                        alt="Post"
                        className='w-full h-full object-cover'
                    />
                </div>
            </div>
        )}

  return (
    <div className='mt-16 grid grid-cols-2 gap-1'>
        <div className='w-[98%] h-[99%] p-10 mx-auto shadow-(--drop--shadow2)'>
            <div className='sticky top-16'>
                <div>
                    <IoSettingsOutline className='text-3xl ml-auto cursor-pointer' onClick={()=>{setShowSettings(prev=>!prev)}}/>
                    {showSettings && <div className='w-40 h-60 border bg-gray-300 absolute left-10 mt-auto shadow-lg rounded-lg flex flex-col items-center justify-around'><Setting/></div>    }
                </div>
                <div className='w-50 h-50 rounded-full overflow-hidden mx-auto mt-5'>
                    <img src={datas.profilePic} alt="" className='w-full h-full object-cover'/>
                </div>
                <div>
                    <h2 className='text-2xl font-bold text-center mt-5'>{datas.name}</h2>
                    <p className='text-center text-gray-800'>@ {datas.username}</p>
                </div>
                <div className='text-center my-10'>
                    <p>{datas.bio}</p>
                </div>
                <div className='flex items-center justify-center gap-15'>
                    <div className='text-center mt-5 '>
                        <p className='font-bold'>Followers</p>
                        <p className='text-blue-600 font-bold'>{datas.followersCount}</p>
                    </div>
                    <div className='text-center mt-5 '>
                        <p className='font-bold'>Following</p>
                        <p className='text-blue-600 font-bold'>{datas.followingCount}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className=' w-full px-10'>
            <div className="grid grid-cols-2 gap-1">
            {posts.length === 0 ? (
                <p className="text-center col-span-2 mt-10">
                No posts yet
                </p>
            ) : (
                posts.map((post) => (
                <SelfPost key={post._id} post={post} className="w-full" />
                ))
            )}
            </div>  
        </div>
    </div>
  )
}

export default MyProfilePage