import React from "react";
import { MoonLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";
const Loading = ({className}) => {
  return (
    <div className={twMerge("flex justify-center items-center my-5",className)}>
      <MoonLoader color={"#36d7b7"} loading size={50} speedMultiplier={1} />
    </div>
  );
};

export default Loading;
