import React from "react";
import Container from "./Container";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegImages } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { server_url } from "./../config/ServerUrl";
import { useSelector } from "react-redux";
import { RiLoader4Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { category_store } from "../redux/Ecommerce_Admin_trunk";

const AddCategory = () => {
  const categories = useSelector((state) => state?.Ecommerce_Admin?.categories);
  const [image_url, set_image_url] = useState(null);
  const [form_data, set_form_data] = useState({
    name: "",
    image: null,
    parent_id: "",
  });
  const [is_loading, set_loading] = useState(false);
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const dispatch = useDispatch();
  const handle_input_change = (e) => {
    set_form_data({ ...form_data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    set_form_data({ ...form_data, image: file });
    if (file) {
      set_image_url(URL.createObjectURL(file));
    }
  };
  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      set_loading(true);

      const formData = new FormData();
      formData.append("name", form_data.name);
      formData.append("parent_id", form_data.parent_id);
      formData.append("category_image", form_data.image);

      const response = await axios.post(
        server_url + "/api/category/create_category",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;
      if (data?.success) {
        set_form_data({
          name: "",
        });
        set_image_url(
          "https://res.cloudinary.com/dpf3ipd7p/image/upload/v1752746922/blank-white-background-soft-gradient-600nw-2471312313_ub2odv.webp"
        );
        dispatch(category_store())
        toast.success(data.message);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set_loading(false);
    }
  };

  return (
    <div className={"min-w-sm mr-2"}>
      <h1 className=" font-bold p-5  text-center border animationTextColor bg-white border-green-300">
        ADD TYPE
      </h1>

      <form onSubmit={handle_submit}>
        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <h1 className=" font-semibold mb-1">Category Name</h1>
          <select
            name="parent_id"
            onChange={handle_input_change}
            className=" outline-none border border-gray-400 p-1 bg-white rounded-sm"
          >
            <option>Select Category</option>
            {categories?.map((cat) => {
              return <option value={cat?._id}>{cat?.name}</option>;
            })}
          </select>
        </div>
        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <h1 className=" font-semibold mb-1">Type Name</h1>

          <input
            onChange={handle_input_change}
            type="text"
            value={form_data.name}
            id="Type Name"
            name="name"
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Type Name .."
          />
        </div>
        <div className="  w-full flex">
          <div className=" w-30 h-30 border border-dashed rounded-sm mx-5 my-5 relative">
            <LazyLoadImage
              src={image_url}
              alt={"category image"}
              effect="blur"
              className=" w-30 h-30 object-contain"
              placeholderSrc="https://res.cloudinary.com/dpf3ipd7p/image/upload/v1752746922/blank-white-background-soft-gradient-600nw-2471312313_ub2odv.webp"
            />
          </div>
          <div className=" w-30 h-30 border border-dashed rounded-sm mx-5 my-5 relative">
            <FaRegImages className=" absolute top-0 right-0 h-full w-full opacity-40 p-3" />
            <input
              type="file"
              accept="image/*"
              className=" w-full h-full opacity-0"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="mx-auto my-5 border border-green-500 flex justify-center items-center">
          <Button
            type="submit"
            sx={{ color: "green" }}
            className=" font-bold! w-full!"
          >
            {is_loading && <RiLoader4Line className=" animate-spin text-lg" />}
            ADD TYPE
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
