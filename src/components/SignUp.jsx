import React, { useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { server_url } from './../config/ServerUrl';
import Title from './Ui/Title';
import Loading from './Loading';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utilities/Firebase";
import { useDispatch } from "react-redux";
import { Admin_info } from "../redux/Ecommerce_Admin_slice";
import { login } from "../redux/Ecommerce_Admin_trunk";

const SignUp = () => {
  const [isEye, setEye] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
const dispatch = useDispatch()
  //   handle error
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [isCheck, setCheck] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = userInfo;

  const [isFocus, setFocus] = useState(false);
  const [isChange, setChange] = useState(false);

  const handleChange = (e) => {
    e.target.value ? setChange(true) : setChange(false);
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

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
      const response = await axios.post(server_url + "/api/user/register", userInfo);
      const data = response?.data;
      if (
        data?.error_type=== "name"
      ) {
        toast.error(data?.message);
        setNameErr(true);
      } else {
        setNameErr(false);
      }

      if (
        data?.error_type=== "email"

      ) {
        setEmailErr(true);
        toast.error(data?.message);
      } else {
        setEmailErr(false);
      }
      if (
        data?.error_type=== "password"
      ) {
        setPasswordErr(true);
        toast.error(data?.message);
      } else {
        setPasswordErr(false);
      }

      if (data?.success) {
        localStorage.setItem('user_email',userInfo.email)
        navigate("/passwordOtp");
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (e) => {
    setCheck(e.target.checked);
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
    <div className=" relative flex justify-center">
      {isLoading && <Loading className={"absolute mx-auto"} />}
      <div
        className={
          isLoading
            ? "flex justify-center w-full h-full mb-30"
            : "flex justify-center w-full h-full  "
        }
      >
        <form
          onSubmit={handleSubmit}
          className={
            isLoading
              ? " opacity-50 translate-y-25 duration-500 flex flex-col w-xs md:w-sm bg-zinc-50 text-sm  gap- my-10 border border-gray-300 shadow rounded-sm"
              : " translate-y-0 duration-500 flex flex-col w-xs md:w-sm bg-zinc-50 text-sm  gap- my-10 border border-gray-300 shadow rounded-sm"
          }
        >
          <Title className={"mx-auto my-5 createAccount"}>
            Create Account{" "}
          </Title>

          <div className="flex flex-col px-12 py-1 relative">
            <MdOutlineDriveFileRenameOutline
              className={
                isFocus || !isChange == " "
                  ? " absolute left-2 bottom-3  text-xl text-blue-700 duration-300"
                  : "absolute left-2 bottom-2 text-lg text-blue-700  duration-300"
              }
            />
            <label
              htmlFor="name"
              className={
                isFocus || !isChange == " "
                  ? " -translate-y-[-3px] transition-transform duration-300"
                  : " translate-y-7 duration-300"
              }
            >
              Enter your name:
            </label>
            <input
              id="name"
              value={name}
              name="name"
              required
              onMouseEnter={() => setFocus(true)}
              onMouseOut={() => setFocus(isChange ? true : false)}
              onClick={() => setFocus(true)}
              onChange={handleChange}
              type="text"
              className={
                nameErr
                  ? " bg-zinc-50 z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-red-500   outline-none  "
                  : " bg-zinc-50 z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-gray-500   outline-none  "
              }
            />
          </div>

          <div className="flex flex-col px-12 py-1 relative">
            <MdEmail
              className={
                isFocusE || !isChangeE == " "
                  ? " absolute left-2 bottom-3 text-lg text-blue-700 duration-300"
                  : "absolute left-2 bottom-2  text-blue-700 duration-300"
              }
            />
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
              className={
                emailErr
                  ? " bg-zinc-50 z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-red-500   outline-none  "
                  : " bg-zinc-50 z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-gray-500   outline-none  "
              }
            />
          </div>

          <div className="flex flex-col px-12 py-1 relative">
            <MdPassword
              className={
                isFocusP || !isChangeP == " "
                  ? " absolute left-2 bottom-3 text-lg text-blue-700 duration-300"
                  : "absolute left-2 bottom-2 text-l text-blue-700 duration-300"
              }
            />
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
              type={isEye ? "text" : "password"}
              className={
                passwordErr
                  ? " bg-zinc-50 z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-red-500   outline-none focus:bg-white"
                  : " bg-zinc-50 z-50 opacity-50 h-8  px-1 text-sm py-0.5 border-b border-b-gray-500   outline-none focus:bg-white"
              }
            />
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

          <div className="flex px-5 pt-2 my-2">
            <input
              type="checkbox"
              value={true}
              onChange={handleCheck}
              className="outline-none border-none mb-3"
            />
            <p className=" text-xs text-center">
              I agree to the Ectomere Terms of Services and Privacy Policy
            </p>
          </div>

          <button
            type="submit"
            disabled={!isCheck}
            className="bg-gray-700 w-50 mx-auto py-1 my-4 text-white hover:bg-gray-800 duration-100 rounded-xs cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            Submit
          </button>

          <p className=" px-5 pb-5 text-gray-700">
            Already have an account ? <span> </span>
            <Link to={"/signin"} className="text-red-500 underline">
              Sign In
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
    </div>
  );
};

export default SignUp;
