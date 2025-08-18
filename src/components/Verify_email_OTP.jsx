import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MdVerifiedUser } from "react-icons/md";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { server_url } from "../config/ServerUrl";

const OTP_verify_email = ({ length = 6 }) => {
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [email, set_email] = useState();
  useEffect(() => {
    const user_email = localStorage.getItem("user_email");
    set_email(user_email);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) {
      const values = value.slice(0, length).split("");
      values.forEach((digit, i) => {
        if (inputsRef.current[index + i]) {
          inputsRef.current[index + i].value = digit;
        }
      });
      const nextIndex = Math.min(index + values.length, length - 1);
      inputsRef.current[nextIndex].focus();
    } else {
      e.target.value = value;
      if (value && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (e.target.value === "" && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      // API Call
      const response = await axios.post(
        server_url + "/api/user/verify_resend_otp",
        {
          email,
        }
      );
      const data = response?.data;
      if (!data?.success) {
        toast.error(data?.message);
      }
      if (data?.success) {
        toast.success(data?.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const otp = inputsRef.current.map((input) => input.value).join("");
    if (otp.length < length) {
      setError(`Please enter all ${length} digits`);
      return;
    }
    setLoading(true);
    try {
      // API Call
      const response = await axios.post(server_url + "/api/user/verify", {
        otp,
        email,
      });
      const data = response?.data;
      if (!data?.success) {
        toast.error(data?.message);
      }

      if (data?.success) {
        setSuccess("OTP verified successfully!");
        navigate("/signin");
        localStorage.removeItem("user_email");
      }
      inputsRef.current.forEach((input) => (input.value = ""));
      inputsRef.current[0].focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border w-sm h-auto m-auto mt-20 bg-gray-100 border-gray-300 p-5"
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <MdVerifiedUser className="text-3xl text-orange-500" />
        <h1 className="font-semibold">Verify Email</h1>
        <p className="text-sm">
          OTP sent to <span className="text-orange-500">{email}</span>
        </p>
        <p
          className=" font-semibold text-sm m-1 cursor-pointer text-orange-700"
          onClick={handleResendOTP}
        >
          Resend OTP
        </p>
      </div>
      <div className="flex gap-2 justify-center mb-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={length}
            className="w-12 h-12 border border-gray-300 rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-center text-sm mb-2">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-center text-sm mb-2">{success}</p>
      )}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className="font-semibold border px-8 py-1 cursor-pointer border-gray-500 bg-orange-600 text-white my-2 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "VERIFY"}
        </button>
      </div>
    </form>
  );
};

export default OTP_verify_email;
