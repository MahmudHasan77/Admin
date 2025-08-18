import React, { useState } from "react";
import Title from "./Ui/Title";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import Loading from "./Loading";
import { server_url } from "./../config/ServerUrl";
import { login } from "./../redux/Ecommerce_Admin_trunk";
import { Admin_info } from "../redux/Ecommerce_Admin_slice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utilities/Firebase";

const Signin = () => {
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const handle_forgot_password = async (e) => {
    try {
      e.preventDefault();
      if (userInfo.email === "") {
        toast.error("Enter your Email");
      } else {
        // setUserInfo({ email: '', password: '' })
        const response = await axios.post(
          server_url + "/api/user/forgot_password",
          { email: userInfo.email }
        );
        const data = response?.data;
        if (data?.success) {
          toast.success(data?.message);
          localStorage.setItem("user_email", userInfo.email);
          navigate("/forgot_password_OTP");
        } else {
          toast.error(data?.message);
          console.log(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { email, password } = userInfo;

  const [isFocusE, setFocusE] = useState(false);
  const [isChangeE, setChangeE] = useState("");

  const handleChangeE = (e) => {
    setChangeE(e.target.value);
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const [isFocusP, setFocusP] = useState(false);
  const [isChangeP, setChangeP] = useState(false);

  const handleChangeP = (e) => {
    e.target.value ? setChangeP(true) : setChangeP(false);
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        server_url + "/api/user/login",
        userInfo
      );
      const data = response?.data;
      if (!data?.success) {
        toast.error(data.message);
        setError(data?.message);
      }
      if (data.success) {
        if (data?.user?.isAdmin) {
          dispatch(Admin_info(data?.user));
          navigate("/");
          dispatch(login(data?.token));
        } else {
          toast.error("Your not valid Admin");
        }

      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result?.user;
      const userInfo = {
        name: user.displayName,
        email: user.email,
        password: null,
      };

      const response = await axios.post(
        server_url + "/api/user/register_with_google",
        userInfo
      );
      const data = response?.data;
      console.log(data);
      if (data.success) {
        if (data?.user?.isAdmin) {
          dispatch(Admin_info(data?.user));
          navigate("/");
          dispatch(login(data?.token));
        } else {
          toast.error("Your not valid Admin");
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex justify-center w-full h-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-xs bg-zinc-50 text-sm  gap- my-10 border border-gray-300 shadow rounded-sm"
          >
            <Title className={"mx-auto my-5 signIn"}>Sign In </Title>

            <div className="flex flex-col px-5 py-1">
              <label
                htmlFor="email"
                className={
                  isFocusE || !isChangeE == ""
                    ? " -translate-y-[-3px] transition-transform duration-300"
                    : " translate-y-7 duration-300"
                }
              >
                Enter your email:
              </label>
              <input
                id="email"
                value={email}
                name="email"
                required
                onMouseEnter={() => setFocusE(true)}
                onMouseOut={() => setFocusE(isChangeE ? true : false)}
                onClick={() => setFocusE(true)}
                onChange={handleChangeE}
                type="email"
                className=" bg-zinc-50 z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-gray-500   outline-none  "
              />
            </div>

            <div className="flex flex-col px-5 py-1">
              <label
                htmlFor="password"
                className={
                  isFocusP || isChangeP
                    ? " -translate-y-[-3px] transition-transform duration-300"
                    : " translate-y-7 duration-300"
                }
              >
                Enter your password:
              </label>
              <input
                id="password"
                value={password}
                name="password"
                required
                onMouseEnter={() => setFocusP(true)}
                onMouseOut={() => setFocusP(isChangeP ? true : false)}
                onClick={() => setFocusP(true)}
                onChange={handleChangeP}
                type="password"
                className=" bg-white z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-gray-500   outline-none focus:bg-white "
              />
            </div>
            <span
              onClick={handle_forgot_password}
              className=" text-red-500! px-5 text-end xsLight cursor-pointer"
            >
              Forgot Password ?{" "}
            </span>
            {error && (
              <div className="mx-auto text-xs text-red-500 flex flex-col gap-1 justify-center items-center ">
                <p className=" text-red-400"> {error}</p>
                <Link to={"/OTP_verify_email"}>VERIFY EMAIL</Link>
              </div>
            )}
            <button
              type="submit"
              className="bg-gray-700 w-50 mx-auto py-1 my-4 text-white hover:bg-gray-800 duration-100 cursor-pointer"
            >
              Submit
            </button>

            <p className=" px-5 text-gray-700">
              Don't you have an account ? <span> </span>{" "}
              <Link to={"/signup"} className="text-red-500 underlin3">
                Sign Up
              </Link>
            </p>
            <div className=" px-5 my-3 ">
              <p
                onClick={handleGoogleLogin}
                className=" flex items-center  gap-3 cursor-pointer px-2 py-1 font-extralight text-xs"
              >
                <FcGoogle className="" />
                Create Account With Google
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Signin;
