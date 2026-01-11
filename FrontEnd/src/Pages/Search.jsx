import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
import api from '../api'
const Search = () => {
    const  [text,setText] = useState("");
    const[datas,setDatas] = useState([]);
    const [mark, setMark] = useState(false);
    const fetchUser= async () => {
        try {
            const response = await api.get(`user/getuser/${text}`);
            console.log(response.data);
            setDatas(response.data.user);
            if(response.data.success){
                setMark(true);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    const viewprofile = () => {
        window.location.href=`/otherprofile/${datas.username}`;
    }
  return (
    <div className='mt-16'>
        <div className='w-full mx-auto flex justify-center pt-10 gap-5'>
            <div className='w-[50%] shadow-(--drop-shadow)'>
                <input type="text" className='border border-gray-300 rounded-md w-full p-2 outline-none'placeholder='Search' onChange={(e)=>{setText(e.target.value)}}/>
            </div>
            <div className='bg-blue-500 p-2 rounded-md flex items-center justify-center cursor-pointer' onClick={fetchUser}>
                <CiSearch className='text-white text-2xl'/>
            </div>
        </div>
        <div>
            {!mark ? <h2 className='text-center mt-10 text-gray-500'>No Results Found</h2>:
            (<div className='mt-10 mx-auto w-[50%] flex items-center gap-5 border-b border-gray-300'>
                <div className='w-10 h-10 rounded-full overflow-hidden'>
                    <img src={datas?.profilePic} alt="" className='w-full h-full object-cover cursor-pointer' onClick={viewprofile}/>
                </div>
                <div>
                    <h2 className='font-bold'>{datas?.name}</h2>
                    <p className='text-gray-500'>@ {datas?.username}</p>
                </div>
            </div> 
         )}
        </div>
    </div>
  )
}

export default Search