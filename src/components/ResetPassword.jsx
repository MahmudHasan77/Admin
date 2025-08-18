import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Title from "./Ui/Title";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { server_url } from "../config/ServerUrl";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [isEye, setEye] = useState(false);
  const [isEyeConfirm, setEyeConfirm] = useState(false);
  const [userInfo, setUserInfo] = useState({
    new_password: "",
    confirm_password: "",
  });
  const { new_password, confirm_password } = userInfo;

  const [isFocusP, setFocusP] = useState(false);
  const [isChangeP, setChangeP] = useState(false);
  const [isFocusP2, setFocusP2] = useState(false);
  const [isChangeP2, setChangeP2] = useState(false);

  const handleChangeP = (e) => {
    e.target.value ? setChangeP(true) : setChangeP(false);
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const handleChangeP2 = (e) => {
    e.target.value ? setChangeP2(true) : setChangeP2(false);
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };
  const [misMatch_error, set_error] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (new_password !== confirm_password) {
        set_error("Both passwords must be the same.");
      } else {
        const response = await axios.post(
          server_url + "/api/user/reset_password",
          {
            userInfo,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response?.data;
        if (data.success) {
          toast.success(data.message);
          navigate("/");
        } else {
          toast.error(data?.message);
          console.log(data?.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center w-full h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-xs bg-zinc-50 text-sm  gap- my-10 border border-gray-300 shadow rounded-sm"
      >
        <Title className={"mx-auto my-5 signIn"}>Reset Password </Title>

        <div className="flex flex-col px-5 py-1 relative">
          <label
            htmlFor="new_password"
            className={
              isFocusP || isChangeP
                ? " -translate-y-[-3px] transition-transform duration-300"
                : " translate-y-7 duration-300"
            }
          >
            New password:
          </label>
          <input
            id="new_password"
            value={new_password}
            name="new_password"
            required
            onMouseEnter={() => setFocusP(true)}
            onMouseOut={() => setFocusP(isChangeP ? true : false)}
            onClick={() => setFocusP(true)}
            onChange={handleChangeP}
            type={isEye ? "text" : "password"}
            className=" bg-white z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-gray-500   outline-none focus:bg-white "
          />{" "}
          {isEye ? (
            <IoEyeOff
              className=" absolute right-12 top-8 z-50"
              onClick={() => setEye(false)}
            />
          ) : (
            <IoEye
              className=" absolute right-12 top-8 z-50"
              onClick={() => setEye(true)}
            />
          )}
        </div>
        <div className="flex flex-col px-5 py-1 relative">
          <label
            htmlFor="confirm_password"
            className={
              isFocusP2 || isChangeP2
                ? " -translate-y-[-3px] transition-transform duration-300"
                : " translate-y-7 duration-300"
            }
          >
            Confirm password:
          </label>
          <input
            id="confirm_password"
            value={confirm_password}
            name="confirm_password"
            required
            onMouseEnter={() => setFocusP2(true)}
            onMouseOut={() => setFocusP2(isChangeP2 ? true : false)}
            onClick={() => setFocusP2(true)}
            onChange={handleChangeP2}
            type={isEyeConfirm ? "text" : "password"}
            className=" bg-white z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-gray-500   outline-none focus:bg-white "
          />
          {isEyeConfirm ? (
            <IoEyeOff
              className=" absolute right-12 top-8 z-50"
              onClick={() => setEyeConfirm(false)}
            />
          ) : (
            <IoEye
              className=" absolute right-12 top-8 z-50"
              onClick={() => setEyeConfirm(true)}
            />
          )}
        </div>
        <p className=" text-center text-red-500">{misMatch_error}</p>
        <button
          type="submit"
          className="bg-orange-500 w-50 mx-auto py-1 my-4 text-white hover:bg-gray-800 duration-100 cursor-pointer"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
