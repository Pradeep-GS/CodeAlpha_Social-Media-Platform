import React from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
const Setting = () => {
  const navigation = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigation("/login");
    window.location.reload();
  }
  return (
    <>
      <NavLink to="/profile/edit" className="block w-full text-center py-2 hover:bg-gray-200 text-blue-500">Edit Profile</NavLink>
      <p onClick={logout} className="block w-full text-center py-2 hover:bg-gray-200 text-red-500">Log Out</p>
      <p className="block w-full text-center py-2 hover:bg-gray-200 text-red-500">Delete Account</p>
    </>
)
}

export default Setting