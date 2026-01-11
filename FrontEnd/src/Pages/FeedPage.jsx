import React, { use, useEffect, useState } from 'react'
import Post from '../components/Post'
import api from '../api'
const FeedPage = () => {
  const [data,setData] = useState([]);
  const fetchPosts = async () => {
    try { 
      const response = await api.get('/post/');
      setData(response.data.posts);
      console.log(response.data);
    } catch (error) { }
  }
  useEffect(() => { 
    fetchPosts();
  }, [])
  return (
    <div className='mt-15'>
      {data.map((post)=>
        <Post key={post.id} data={post} />
      )}
    </div>
  )
}

export default FeedPage