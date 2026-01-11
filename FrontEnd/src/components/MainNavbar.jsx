import React from "react";
import { RiHome2Line } from "react-icons/ri";
import { CgProfile, CgSearch } from "react-icons/cg";
import { GiFilmStrip } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
const MainNavbar = () => {
  const linkClass = ({ isActive }) =>
    isActive ? "text-2xl text-green-600" : "text-2xl text-gray-500";

  return (
    <div className="w-[40%] bg-white fixed bottom-3 left-1/2 -translate-x-1/2 h-16 shadow-lg z-40 rounded-2xl flex items-center">
      <ul className="flex justify-around items-center w-full">
        <NavLink to="/feed" className={linkClass}>
          <RiHome2Line />
        </NavLink>
        
        <NavLink to="/search" className={linkClass}>
          <CgSearch />
        </NavLink>
        <NavLink to="/add-post" className={linkClass}>
          <IoIosAddCircleOutline />
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <CgProfile />
        </NavLink>
      </ul>
    </div>
  );
};

export default MainNavbar;
