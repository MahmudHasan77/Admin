import { FaUserEdit } from "react-icons/fa";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { FaAddressCard } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AiTwotoneDelete } from "react-icons/ai";
import { Admin_info } from "../redux/Ecommerce_Admin_slice";

const Profile = () => {
  const profile_input_ref = useRef();
  const [addresses, setAddresses] = useState();
  const token = useSelector((state) => state.Ecommerce_Admin.token);
  const [selectedAddressId, setSelectedAddressId] = useState();
  const Admin_details = useSelector(
    (state) => state?.Ecommerce_Admin?.Admin_info
  );
  const dispatch = useDispatch();
  const handle_radio_change = async (e) => {
    setSelectedAddressId(e);

    try {
      const response = await axios.post(
        server_url + `/api/address/select_address/${e}`,
        e,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response?.data;
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };
  const [delete_loading, set_delete_loading] = useState("");

  useEffect(() => {
    const fetching_address = async () => {
      try {
        const response = await axios.get(
          server_url + "/api/address/get_all_address",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedAddresses = response?.data?.addresses;
        setAddresses(fetchedAddresses);

        const activeAddress = fetchedAddresses?.find(
          (addr) => addr.status === true
        );
        if (activeAddress) {
          setSelectedAddressId(activeAddress._id);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    };
    if (token) {
      fetching_address();
    }
  }, [token]);

  const [loading, setLoading] = useState(false);
  const [open_details, set_open_details] = useState(false);

  const handle_profile_image_click = () => {
    if (loading) return;
    profile_input_ref.current.click();
  };

  const handle_profile_image_change = async (e) => {
    const image = e.target.files[0];
    try {
      setLoading(true);
      const form_data = new FormData();
      form_data.append("profile_image", image);

      const response = await axios.post(
        server_url + "/api/user/user_profile_image",
        form_data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;
      if (data?.success) {
        try {
          const response = await axios.get(
            server_url + "/api/user/personal_details",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = response?.data;
          if (data?.success) {
            dispatch(Admin_info(data?.data));
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handle_remove_click = async (id) => {
    try {
      set_delete_loading(id);
      const delete_address = await axios.delete(
        server_url + `/api/address/delete_address/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = delete_address?.data;
      if (data?.message) {
        const response = await axios.get(
          server_url + "/api/address/get_all_address",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedAddresses = response?.data?.addresses;
        setAddresses(fetchedAddresses);

        const activeAddress = fetchedAddresses?.find(
          (addr) => addr.status === true
        );
        if (activeAddress) {
          setSelectedAddressId(activeAddress._id);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      set_delete_loading("");
    }
  };
  return (
    <>
      <div className=" bg-gray200">
        <h1 className=" font-bold text-center p-5 border-gray-300 bg-white animationTextColor">
          Admin Details
        </h1>
        <div className=" border border-gray-300 p-2 bg-white mr-2">
          <div
            onClick={handle_profile_image_click}
            className=" h-20 w-20 rounded-full overflow-hidden border m-auto bg-black/50 relative cursor-pointer"
          >
            <img
              className=" h-20l w-20 object-cover hover:opacity-50"
              src={Admin_details?.profile_image}
            />
            <input
              type="file"
              className=" hidden"
              ref={profile_input_ref}
              onChange={handle_profile_image_change}
            />
            {loading && (
              <div className="absolute inset-0 opacity-50 flex items-center justify-center bg-white bg-opacity-80">
                <div className="text-gray-700 text-sm">
                  <BiLoaderCircle className=" text-3xl animate-spin" />
                </div>
              </div>
            )}
          </div>
          <h1 className=" text-center font-semibold text-xs py-0.5 text-gray-500">
            {Admin_details?.name}
          </h1>
          <div className="flex justify-around items-center m-5 border h-8 border-gray-300">
            <div
              className={`${
                open_details
                  ? " "
                  : "border-b border-orange-500 text-orange-500"
              } flex justify-center items-center gap-2 cursor-pointer h-full`}
              onClick={() => set_open_details(false)}
            >
              <FaUserAlt />
              <p className=" font-semibold text-sm">Profile</p>
            </div>
            <div
              className={`${
                open_details
                  ? " border-b border-orange-500 text-orange-500"
                  : ""
              } flex justify-center items-center gap-2 cursor-pointer h-full`}
              onClick={() => set_open_details(true)}
            >
              <FaAddressCard />
              <p className=" font-semibold text-sm">Address</p>
            </div>
          </div>
        </div>
      </div>
      {open_details ? (
        <div>
          <div className=" border flex-1 bg-zinc-50 border-gray-300 mr-2 my-3">
            {addresses?.map((address, index) => {
              return (
                <div
                  key={index}
                  className=" flex  items-center justify-center gap-1 border bg-white customshadow1 p-2 border-gray-300 mt-5"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className=" w-5">
                      <FormControlLabel
                        value={address?._id}
                        control={
                          <Radio
                            checked={selectedAddressId === address._id}
                            onChange={() => handle_radio_change(address?._id)}
                          />
                        }
                      />
                    </div>
                    <div>
                      {delete_loading == address._id ? (
                        <BiLoaderCircle className=" text-xl animate-spin text-red-500 bg-gray-200 rounded-full cursor-pointer" />
                      ) : (
                        <AiTwotoneDelete
                          className=" text-xl hover:text-red-500 bg-gray-200 rounded-full cursor-pointer"
                          onClick={() => handle_remove_click(address._id)}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" flex flex-wrap items-center justify-center">
                    <h1 className=" capitalize font-semibold text-[10px] text-orange-500 ml-5">
                      address line :{" "}
                    </h1>
                    <p className=" text-[10px]">{address?.address_line},</p>
                    <h1 className=" capitalize font-semibold text-[10px] text-orange-500 ml-5">
                      country :{" "}
                    </h1>
                    <p className=" text-[10px]">{address?.country},</p>
                    <h1 className=" capitalize font-semibold text-[10px] text-orange-500 ml-5">
                      city :{" "}
                    </h1>
                    <p className=" text-[10px]">{address?.city},</p>
                    <h1 className=" capitalize font-semibold text-[10px] text-orange-500 ml-5">
                      PINcode :{" "}
                    </h1>
                    <p className=" text-[10px]">{address?.PINcode},</p>
                    <h1 className=" capitalize font-semibold text-[10px] text-orange-500 ml-5">
                      state:{" "}
                    </h1>
                    <p className=" text-[10px]">{address?.state},</p>
                    <h1 className=" capitalize font-semibold text-[10px] text-orange-500 ml-5">
                      status :
                    </h1>
                    <p className=" text-[10px]">{address?.status},</p>
                    <h1 className=" capitalize font-semibold text-[10px] text-orange-500 ml-5">
                      mobile :{" "}
                    </h1>
                    <p className=" text-[10px]">{address?.mobile},</p>
                  </div>
                </div>
              );
            })}
            <Link to={"/Add_address"}>
              <button className=" text-center w-full border my-5 border-dashed p-1 bg-green-50 border-gray-400 cursor-pointer">
                Add Address
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className=" border flex-1 bg-zinc-50 border-gray-300 mr-2 my-3">
            <div className="flex items-center gap-3 mx-7 my-2 p-1 border-b border-gray-200 font-semibold text-sm">
              <h1 className=" font-bold">NAME :</h1>
              <p>{Admin_details?.name}</p>
            </div>
            <div className="flex items-center gap-3 mx-7 my-2 p-1 border-b border-gray-200 font-semibold text-sm">
              <h1 className=" font-bold">EMAIL :</h1>
              <p>{Admin_details?.email}</p>
            </div>
            <div className="flex items-center gap-3 mx-7 my-2 p-1 border-b border-gray-200 font-semibold text-sm">
              <h1 className=" font-bold">MOBILE :</h1>
              <p>{Admin_details?.mobile}</p>
            </div>

            <Link to={"/editProfile"}>
              <div className=" flex hover:text-orange-500 duration-300 items-center font-semibold text-sm justify-around bg-gray-300 my-5 mx-10 p-1 cursor-pointer">
                <p>Edit Profile</p>
                <FaUserEdit className="text-lg" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
