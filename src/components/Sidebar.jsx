import React from "react";
import Title from "./Ui/Title";
import { NavLink } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { IoListSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa6";
import { IoReorderFour } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="w-full ">
      <NavLink
        to={"/add"}
        className={
          "flex items-center justify-around  p-2 my-7 text-[11px] ml-1 md:text-lg hover:shadow  border  border-gray-300 bg-blue-50   "
        }
      >
        <IoMdAdd className="text-xl border rounded-full" />
        ADD
      </NavLink>
      <NavLink
        to={"/list"}
        className={
          "flex items-center justify-around p-2 my-7 text-[11px] ml-1 md:text-lg  hover:shadow  border  border-gray-300 bg-blue-50   "
        }
      >
        <IoListSharp className="text-xl " />
        LIST
      </NavLink>
      <NavLink
        to={"/orders"}
        className={
          "flex items-center justify-around  p-2 my-7 text-[11px] ml-1 md:text-lg hover:shadow  border  border-gray-300 bg-blue-50   "
        }
      >
        <IoReorderFour className="text-xl " />
        ORDERS
      </NavLink>
      <NavLink
        to={"/users"}
        className={
          "flex items-center justify-around  p-2 my-7 text-[11px] ml-1 md:text-lg hover:shadow  border  border-gray-300 bg-blue-50   "
        }
      >
        <FaUsers className="text-xl" />
        USERS
      </NavLink>
    </div>
  );
};

export default Sidebar;
