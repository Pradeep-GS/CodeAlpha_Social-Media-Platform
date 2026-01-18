import React, { use, useEffect, useState } from 'react'
import Post from '../components/Post'
import api from '../api'
const FeedPage = () => {
  const [data,setData] = useState([]);
  const fetchPosts = async () => {
    try { 
      const response = await api.get('/post/feed');
      setData(response.data.posts);
      console.log(response.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
     }
  }
  useEffect(() => { 
    fetchPosts();
  }, [])
  return (
    <div className='mt-15 pb-12'>
      {data.map((post)=>
        <Post key={post.id} data={post} />
      )}
    </div>
  )
}

export default FeedPage