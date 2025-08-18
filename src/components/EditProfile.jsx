import Button from "@mui/material/Button";
import axios from "axios";
import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { server_url } from "../config/ServerUrl";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Admin_info } from "../redux/Ecommerce_Admin_slice";

const Profile = () => {
  const Admin_details = useSelector((state) => state?.Ecommerce_Admin?.Admin_info);
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form_data, set_form_data] = useState({
    name: Admin_details?.name,
    email: Admin_details?.email,
    mobile:"",
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });
  const handleChange = (e) => {
    set_form_data({ ...form_data, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    
    if (form_data.NewPassword !== form_data.ConfirmPassword) {
      toast.error("New Password and Confirm Password should be same");
      return
    }
    try {
      
       const response = await axios.post(server_url + "/api/user/update", form_data, {
         headers: { Authorization: `Bearer ${token}` },
       });
       if (response?.data.success) {
         dispatch(Admin_info(response?.data?.data));
         navigate("/profile");
         toast.success(response?.data?.message)
       } else {
         toast.error(response?.data?.message)
       }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error);
     }

  };

  return (
    <>
      <div className=" border flex-1 bg-zinc-50 border-gray-300 m-5">
        <h1 className=" font-bold text-center m-5 border-b p-1 border-gray-400">
          Edit Admin Profile
        </h1>
        <form className=" grid" onSubmit={handle_submit}>
          <div className=" m-3 grid">
            <label htmlFor="name" className=" font-extralight text-sm">
              Full Name:
            </label>
            <input
              id="name"
              name="name"
              value={form_data.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>
          <div className=" m-3 grid">
            <label htmlFor="Email" className=" font-extralight text-sm">
              Email:
            </label>
            <input
              id="Email"
              name="email"
              onChange={handleChange}
              value={form_data.email}
              type="email"
              placeholder="Email"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1  text-sm"
            />
          </div>

          {!Admin_details?.signUpWithGoogle &&
          <div className=" m-3 grid">
            <label htmlFor="OldPassword" className=" font-extralight text-sm">
              Old Password:
            </label>
            <input
              id="OldPassword"
              name="OldPassword"
              type="text"
              onChange={handleChange}
              placeholder="Old Password"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>
          }
          <div className=" m-3 grid">
            <label htmlFor="NewPassword" className=" font-extralight text-sm">
              New Password:
            </label>
            <input
              id="NewPassword"
              name="NewPassword"
              type="text"
              onChange={handleChange}
              placeholder="New Password"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>
          <div className=" m-3 grid">
            <label
              htmlFor="ConfirmPassword"
              className=" font-extralight text-sm"
            >
              Confirm Password:
            </label>
            <input
              id="ConfirmPassword"
              name="ConfirmPassword"
              type="text"
              onChange={handleChange}
              placeholder="Confirm Password"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>
          <div className=" m-3 grid">
            <label htmlFor="Mobile" className=" font-extralight text-sm">
              Mobile:
            </label>
            <div>
              <PhoneInput
                defaultCountry="bd"
                value={form_data.mobile}
                onChange={(phone) =>
                  set_form_data({ ...form_data, mobile: phone })
                }
              />
            </div>
          </div>
          <div className=" flex mx-5 gap-5 m-4">
            <Button
              className=" bg-orange-500! px-3! w-20! text-sm! text-white!"
              type="submit"
            >
              SAVE
            </Button>
            <Link to={"/profile"}>
              <Button className=" bg-orange-500! px-3! w-20! text-sm! text-white!">
                CANCEL
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
