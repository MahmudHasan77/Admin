import React, { useState ,useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, Outlet,useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { Collapse } from "react-collapse";
import { RiAccountCircleFill, RiArrowDownWideFill } from "react-icons/ri";
import { VscListSelection } from "react-icons/vsc";
import { IoIosAdd } from "react-icons/io";
import Button from "@mui/material/Button";
import { AiFillProduct } from "react-icons/ai";
import { PiUsersFill } from "react-icons/pi";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { IoBagCheckSharp } from "react-icons/io5";
import { BiMessageRoundedDots } from "react-icons/bi";
import { CiSettings } from "react-icons/ci";
import IconButton from "@mui/material/IconButton";
import { TfiMenu } from "react-icons/tfi";
import Signin from "../Signin";
import axios from "axios";
import { server_url } from "../../config/ServerUrl";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/Ecommerce_Admin_trunk";
import { useEffect } from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isOpenCollapse, setOpenCollapse] = useState(null);
  const navigate = useNavigate()
  const [isOpenProfileBox,setOpenProfileBox]=useState(false)
    const boxRef = useRef(null);
    const buttonRef = useRef(null);
    const [isProfileBoxOpen, setProfileBoxOpen] = useState(false);
  
  const handleCollapse = (e) => {
    if (isOpenCollapse === e) {
      setOpenCollapse(null);
    } else {
      setOpenCollapse(e);
    }
  };

  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const Admin_details = useSelector(
    (state) => state?.Ecommerce_Admin?.Admin_info
  );
  const handle_log_out = async () => {
    if (!token) {
      return;
    }
    const response = await axios.post(server_url + "/api/user/logOut", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response?.data;
    if (data?.success) {
      dispatch(logout());
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && boxRef.current.contains(event.target)) {
        return;
      }

      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        return;
      }

      setOpenProfileBox(false);
      
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="">
      {token ? (
        <>
          <div className=" flex min-h-screen">
            <div
              className={
                open
                  ? " max-w-[40%] min-w-[40%] md:max-w-[25%] sticky overflow-y-auto   duration-500 lg:max-w-[20%] lg:min-w-[20%]   md:min-w-[25%] border-r border-gray-300 shadow bg-white customShadow  min-h-screen "
                  : " max-w-[40%] min-w-[40%] md:max-w-[25%] sticky  overflow-y-auto  -ml-[40%] md:ml-0 duration-500 lg:max-w-[20%] lg:min-w-[20%] md:min-w-[25%] border-r border-gray-300 shadow bg-white  customShadow min-h-screen"
              }
            >
              <div className=" sticky top-0">
                <Link to={"/"}>
                  <div className=" py-2 flex items-center justify-around">
                    <div className=" h-13  max-w-15 max-h-15 flex items-center">
                      <img
                        className=" w-10 h-auto object-contain"
                        src="https://res.cloudinary.com/dpf3ipd7p/image/upload/v1755021253/ecommerce_logo-removebg-preview_lewgsl.png"
                      />
                    </div>
                    <p className=" font-extrabold text uppercase">practice</p>
                  </div>
                </Link>
                <div className=" my-5 mx-[5%] grid gap-3">
                  <div className="flex items-center justify-center  gap-2 sm:gap-3 md:gap-5 lg:gap-7 w-full! text-orange-700!">
                    <Link to={"/"}>
                      <Button>
                        <MdDashboard className="text-orange-700!" />
                        <Button className=" font-bold text-sm text-orange-700!">
                          DASHBOARD
                        </Button>
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <Button
                      sx={{ width: "100%", color: "black" }}
                      className=" flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      onClick={() => handleCollapse(1)}
                    >
                      <FaImages className=" text-orange-500" />
                      <p>Slides</p>
                      <RiArrowDownWideFill />
                    </Button>
                    <Collapse isOpened={isOpenCollapse === 1}>
                      <Link to={"/uploadHomeSlider"}>
                        <Button
                          sx={{ width: "100%" }}
                          className="flex! text-gray-600! items-center! justify-between! my-2! border-b! border-gray-300! text-xs! capitalize!"
                        >
                          <IoIosAdd className=" text-blue-700" />
                          <p className="text-xs">Upload Home Slider </p>
                        </Button>
                      </Link>
                      <Link to={"/homeSliderList"}>
                        <Button
                          sx={{ width: "100%", display: "flex" }}
                          className="flex! text-gray-600! items-center! justify-between! text-xs! capitalize! my-2! border-b! border-gray-300!"
                        >
                          <VscListSelection className=" text-blue-700" />
                          <p className="text-xs!">Home Slider List</p>
                        </Button>
                      </Link>
                      <Link to={"/UploadSecondSlider"}>
                        <Button
                          sx={{ width: "100%" }}
                          className="flex! text-gray-600! items-center! justify-between! my-2! border-b! border-gray-300! text-xs! capitalize!"
                        >
                          <IoIosAdd className=" text-blue-700" />
                          <p className="text-xs">Upload Second Slider </p>
                        </Button>
                      </Link>
                      <Link to={"/SecondSliderList"}>
                        <Button
                          sx={{ width: "100%", display: "flex" }}
                          className="flex! text-gray-600! items-center! justify-between! text-xs! capitalize! my-2! border-b! border-gray-300!"
                        >
                          <VscListSelection className=" text-blue-700" />
                          <p className="text-xs!">Second Slider List</p>
                        </Button>
                      </Link>
                    </Collapse>
                  </div>

                  <div>
                    <Button
                      sx={{ width: "100%", color: "black" }}
                      className="flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      onClick={() => handleCollapse(2)}
                    >
                      <AiFillProduct className=" text-orange-500" />
                      <p className=" relative">products</p>
                      <RiArrowDownWideFill />
                    </Button>

                    <Collapse isOpened={isOpenCollapse === 2}>
                      <Link to={"/addProduct"}>
                        <Button
                          sx={{ width: "100%" }}
                          className="flex! text-gray-600! items-center! justify-between! my-2! border-b! border-gray-300! text-xs! capitalize!"
                        >
                          <IoIosAdd className=" text-blue-700" />
                          <p className="text-xs">Upload Product </p>
                        </Button>
                      </Link>

                      <Link to={"/productslist"}>
                        <Button
                          sx={{ width: "100%", display: "flex" }}
                          className="flex! text-gray-600! items-center! justify-between! text-xs! capitalize! my-2! border-b! border-gray-300!"
                        >
                          <VscListSelection className=" text-blue-700" />
                          <p className="text-xs!">Products List</p>
                        </Button>
                      </Link>
                    </Collapse>
                  </div>

                  <div>
                    <Button
                      sx={{ width: "100%", color: "black" }}
                      className="flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      onClick={() => handleCollapse(3)}
                    >
                      <AiFillProduct className=" text-orange-500" />
                      <p className=" relative">categories...</p>
                      <RiArrowDownWideFill />
                    </Button>

                    <Collapse isOpened={isOpenCollapse === 3}>
                      <Link to={"AddCategory"}>
                        <Button
                          sx={{ width: "100%" }}
                          className="flex! text-gray-600! items-center! justify-between! my-2! border-b! border-gray-300! text-xs! capitalize!"
                        >
                          <IoIosAdd className=" text-blue-700" />
                          <p className="text-xs">Add Category</p>
                        </Button>
                      </Link>

                      <Link to={"AddType"}>
                        <Button
                          sx={{ width: "100%" }}
                          className="flex! text-gray-600! items-center! justify-between! my-2! border-b! border-gray-300! text-xs! capitalize!"
                        >
                          <IoIosAdd className=" text-blue-700" />
                          <p className="text-xs">Add Type</p>
                        </Button>
                      </Link>

                      <Link to={"CategoryList"}>
                        <Button
                          sx={{ width: "100%", display: "flex" }}
                          className="flex! text-gray-600! items-center! justify-between! text-xs! capitalize! my-2! border-b! border-gray-300!"
                        >
                          <VscListSelection className=" text-blue-700" />
                          <p className="text-xs!">Category & Type List</p>
                        </Button>
                      </Link>
                    </Collapse>
                  </div>

                  <div>
                    <Button
                      sx={{ width: "100%", color: "black" }}
                      className=" flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      onClick={() => handleCollapse(4)}
                    >
                      <FaImages className=" text-orange-500" />
                      <p className=" relative">ram & storage</p>
                      <RiArrowDownWideFill />
                    </Button>

                    <Collapse isOpened={isOpenCollapse === 4}>
                      <Link to={"AddRam"}>
                        <Button
                          sx={{ width: "100%" }}
                          className="flex! text-gray-600! items-center! justify-between! my-2! border-b! border-gray-300! text-xs! capitalize!"
                        >
                          <IoIosAdd className=" text-blue-700" />
                          <p className="text-xs"> RAM & Storage</p>
                        </Button>
                      </Link>
                    </Collapse>
                  </div>

                  <div>
                    <Button
                      sx={{ width: "100%", color: "black" }}
                      className=" flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      onClick={() => handleCollapse(5)}
                    >
                      <FaImages className=" text-orange-500" />
                      <p className=" relative">blogs</p>
                      <RiArrowDownWideFill />
                    </Button>
                    <Collapse isOpened={isOpenCollapse === 5}>
                      <Link to={"/addBlogs"}>
                        <Button
                          sx={{ width: "100%", display: "flex" }}
                          className="flex! text-gray-600! items-center! justify-between! text-xs! capitalize! my-2! border-b! border-gray-300!"
                        >
                          <VscListSelection className=" text-blue-700" />
                          <p className="text-xs!">add blogs</p>
                        </Button>
                      </Link>

                      <Link to={"blogsList"}>
                        <Button
                          sx={{ width: "100%", display: "flex" }}
                          className="flex! text-gray-600! items-center! justify-between! text-xs! capitalize! my-2! border-b! border-gray-300!"
                        >
                          <VscListSelection className=" text-blue-700" />
                          <p className="text-xs!">blogs List</p>
                        </Button>
                      </Link>
                    </Collapse>
                  </div>

                  <div className="">
                    <Link to={"/users"} onClick={handleCollapse}>
                      <Button
                        sx={{ width: "100%", color: "black" }}
                        className=" flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      >
                        <PiUsersFill className=" text-orange-500" />
                        <p className=" flex-1">Users</p>
                      </Button>
                    </Link>
                  </div>
                  <div className="">
                    <Link to={"/OrdersList"}>
                      <Button
                        sx={{ width: "100%", color: "black" }}
                        className=" flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      >
                        <IoBagCheckSharp className=" text-orange-500" />
                        <p className=" flex-1">Orders</p>
                      </Button>
                    </Link>
                  </div>
                  <div className="">
                    <Link to={"/profile"}>
                      <Button
                        sx={{ width: "100%", color: "black" }}
                        className=" flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      >
                        <RiAccountCircleFill className=" text-orange-500 text-[16px]" />
                        <p className=" flex-1">Profile</p>
                      </Button>
                    </Link>
                  </div>
                  <div className="">
                    <span onClick={handle_log_out}>
                      <Button
                        sx={{ width: "100%", color: "black" }}
                        className=" flex items-center justify-between! text-sm! bg-zinc-100 border!  border-gray-300!"
                      >
                        <RiLogoutBoxRFill className=" text-orange-500" />
                        <p className=" flex-1">Log Out</p>
                      </Button>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* header */}
            <div className=" flex-1 ">
              <div className=" w-full h-15 sticky z-50 top-0  border-b border-gray-300 px-2 bg-white shadow flex items-center justify-between ">
                <div>
                  <IconButton
                    sx={{ color: "orange" }}
                    onClick={() => setOpen(!open)}
                  >
                    <TfiMenu className=" text-lg cursor-pointer" />
                  </IconButton>
                </div>
                <div className="flex items-center gap-5">
                  <IconButton className=" mt-2!">
                    <Link className="relative group">
                      <IoMdNotificationsOutline className=" text-lg text-gray-600 hover:text-gray-950 duration-300  " />
                      <span className=" -top-2 -right-1  absolute text-white bg-orange-400  group-hover:bg-orange-650 text-[7px]   rounded-full h-3.5 w-3.5 flex items-center justify-center">
                        0
                      </span>
                    </Link>
                  </IconButton>
                  <div>
                    <IconButton>
                      <BiMessageRoundedDots />
                    </IconButton>
                  </div>
                  <div>
                    <IconButton>
                      <CiSettings />
                    </IconButton>
                  </div>
                  <div className=" relative border border-gray-500 rounded-full">
                    <div
                      onClick={() => setOpenProfileBox(!isOpenProfileBox)}
                      ref={buttonRef}
                      className="min-h-7 min-w-7 max-h-7 max-w-7 cursor-pointer flex items-center justify-center rounded-full   overflow-hidden"
                    >
                      {Admin_details?.profile_image ? (
                        <img
                          className=" object-cover w-full"
                          src={Admin_details?.profile_image}
                        />
                      ) : (
                        <span className=" font-bold text-orange-500 ">
                          {Admin_details?.name[0]}
                        </span>
                      )}
                    </div>
                    {isOpenProfileBox && (
                      <div
                        ref={boxRef}
                        className="absolute z-50 top-9 right-0 border  h-25 w-30 bg-white shadow"
                      >
                        <div className="h-3 w-3 bg-white border border-gray-400 absolute right-3 -top-1 rotate-45 z-0"></div>
                        <div className="relative h-full z-10   bg-white">
                          <div className=" p-1 flex justify-between items-center border-b border-gray-300">
                            <div className=" flex justify-center items-center max-h-7 max-w-7 min-h-7 min-w-7 rounded-full border border-orange-500 overflow-hidden">
                              {Admin_details?.profile_image ? (
                                <img
                                  className=" object-cover w-full"
                                  src={Admin_details?.profile_image}
                                />
                              ) : (
                                <span className=" font-bold text-orange-500">
                                  {Admin_details?.name[0]}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="xsLight text-[8px]!">
                                {Admin_details?.name}
                              </p>
                              <p className="xsLight text-[8px]!">
                                {Admin_details?.email}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Link
                              onClick={() => setOpenProfileBox(false)}
                              className="flex items-center gap-3 m-1"
                              to={"/profile"}
                              tabIndex={isProfileBoxOpen ? 0 : -1}
                            >
                              <RiAccountCircleFill className=" text-[18px] text-orange-500" />
                              <span className=" text-[11px] text-gray-900 capitalize">
                                My Profile
                              </span>
                            </Link>
                          </div>
                          <div>
                            {token ? (
                              <span
                                onClick={() => (
                                  navigate("/"),
                                  setProfileBoxOpen(!isProfileBoxOpen),
                                  localStorage.removeItem("token"),
                                  dispatch(logout())
                                )}
                                className="flex items-center gap-3 m-1 cursor-pointer"
                              >
                                <RiLogoutBoxRFill className=" text-[18px] text-orange-500" />
                                <span className=" text-[11px] text-gray-900 capitalize">
                                  log out
                                </span>
                              </span>
                            ) : (
                              <span
                                onClick={() => (
                                  navigate("/signIn"),
                                  setProfileBoxOpen(!isProfileBoxOpen)
                                )}
                                className="flex items-center gap-3 m-1 cursor-pointer"
                              >
                                <RiLogoutBoxRFill className=" text-[18px] text-orange-500" />
                                <span className=" text-[11px] text-gray-900 capitalize">
                                  log In
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className=" pl-3 py-5 bg-zinc-50">
                <Outlet />
              </div>{" "}
            </div>
          </div>
        </>
      ) : (
        <Signin />
      )}
    </div>
  );
};

export default Dashboard;
