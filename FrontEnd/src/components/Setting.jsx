import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import api from '../api';
const Setting = () => {
  const navigation = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigation("/login");
    window.location.reload();
  }
  const deleteAccount = async () => {
    try {
      await api.delete("/user/delete");
      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      navigation("/login");
      window.location.reload();
    } catch (error) {
      toast.error("Error deleting account");
      console.error("Delete account error:", error.response?.data?.message || error.message);
    }
  };
  return (
    <>
      <NavLink to="/profile/edit" className="block w-full text-center py-2 hover:bg-gray-200 text-blue-500">Edit Profile</NavLink>
      <p onClick={logout} className="block w-full text-center py-2 hover:bg-gray-200 text-red-500">Log Out</p>
      <p onClick={deleteAccount} className="block w-full text-center py-2 hover:bg-gray-200 text-red-500">Delete Account</p>
    </>
)
}

export default Setting