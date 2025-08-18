import Button from "@mui/material/Button";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { server_url } from "../config/ServerUrl";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import {useNavigate} from 'react-router-dom'
import { admin_address, Admin_info } from "../redux/Ecommerce_Admin_slice";
import Loading from "./Loading";
import { RiLoader2Line } from "react-icons/ri";

const Add_address = () => {
  const Admin_details = useSelector(
    (state) => state?.Ecommerce_Admin?.Admin_info
  );
  const navigate  = useNavigate()
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const dispatch = useDispatch();
  const [form_data, set_form_data] = useState({
    address_line: "",
    country: "",
    city: "",
    state: "",
    PINcode: "",
    mobile: "",
    status: "",
  });
  const [isLoading, setLoading] = useState(false);
  const { address_line, country, city, state, PINcode, mobile, status } =
    form_data;
  const handleChange = (e) => {
    set_form_data({ ...form_data, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();

    if (
      address_line == "" ||
      country == "" ||
      city == "" ||
      state == "" ||
      PINcode == "" ||
      mobile == "" ||
      status == ""
    ) {
      toast.error("Fill out all forms.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        server_url + "/api/address/add",
        form_data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
     set_form_data({
       address_line: "",
       country: "",
       city: "",
       state: "",
       PINcode: "",
       mobile: "",
       status: "",
     });
        if (response?.data.success) {
          toast.success(response?.data?.message)
          dispatch(admin_address(response?.data?.address));
          navigate("/profile");
      } else {
        toast.error(response?.data?.data?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className=" border flex-1 bg-zinc-50 border-gray-300 m-5">
        <h1 className=" font-bold text-center m-5 border-b p-1 border-gray-400">
          Add Address
        </h1>

        <form className=" grid " onSubmit={handle_submit}>
          <div className=" m-3 grid">
            <label htmlFor="address_line" className=" font-extralight text-sm">
              address_line:
            </label>
            <input
              id="address_line"
              name="address_line"
              value={form_data.address_line}
              onChange={handleChange}
              type="text"
              placeholder="status"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>
          <div className=" m-3 grid">
            <label htmlFor="country" className=" font-extralight text-sm">
              country:
            </label>
            <input
              id="country"
              name="country"
              onChange={handleChange}
              value={form_data.country}
              type="text"
              placeholder="country"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1  text-sm"
            />
          </div>
          <div className=" m-3 grid">
            <label htmlFor="city" className=" font-extralight text-sm">
              city:
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={city}
              onChange={handleChange}
              placeholder="city"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>
          <div className=" m-3 grid">
            <label htmlFor="state" className=" font-extralight text-sm">
              state:
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={state}
              onChange={handleChange}
              placeholder="state"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>
          <div className=" m-3 grid">
            <label htmlFor="PINcode" className=" font-extralight text-sm">
              PINcode:
            </label>
            <input
              id="PINcode"
              value={PINcode}
              name="PINcode"
              type="text"
              onChange={handleChange}
              placeholder="PINcode"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            />
          </div>

          <div className=" m-3 grid">
            <label htmlFor="status" className=" font-extralight text-sm">
              status:
            </label>
            <select
              id="status"
              name="status"
              type="text"
              onChange={handleChange}
              value={status}
              placeholder="status"
              className=" border border-gray-300 rounded-sm bg-white w-[90%] md:w-md outline-none p-1 text-sm"
            >
              <option ></option>
              <option value={true}>true</option>
              <option value={false}>false</option>
            </select>
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
              disabled={isLoading}
              className=" bg-orange-500! px-3! w-20! text-sm! text-white! relative disabled:opacity-50"
              type="submit"
            >
              {isLoading && (
                <RiLoader2Line className=" text-3xl animate-spin" />
              )}
              SAVE
            </Button>
            <Button
              className=" bg-orange-500! px-3! w-20! text-sm! text-white! disabled:opacity-50"
              disabled={isLoading}
            >
              <Link to={"/profile"}>CANCEL</Link>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Add_address;
