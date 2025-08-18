import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Button from "@mui/material/Button";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FaRegImages } from "react-icons/fa";
import { server_url } from "./../config/ServerUrl";
import { RiLoader4Line } from "react-icons/ri";
import Editor from "react-simple-wysiwyg";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Edit_blog = () => {
    const [is_loading, set_loading] = useState(false);
    const token = useSelector((state) => state?.Ecommerce_Admin?.token);
    const location = useLocation()
    const navigate = useNavigate()
    const blog = location.state||{}
    const [image_url, set_image_url] = useState(blog.image);
  const [blogData, setBlogData] = useState({
    title: blog.title,
    description: blog.description,
    image: blog.image,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlogData({ ...blogData, image: file });
    if (file) {
      set_image_url(URL.createObjectURL(file));
    }
  };
    const handle_input_change = (e) => {
      
    setBlogData({ ...blogData, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    if (blogData.title.trim().length < 10) {
      toast.error("title should be minimum 10 character required");
      return;
    }
    if (blogData.description.trim().length < 50) {
      toast.error("the description should be minimum 50 character required");
      return;
    }
    if (!blogData.image) {
      toast.error("image is required");
      return;
    }
    try {
      set_loading(true);
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("description", blogData.description);
      formData.append("blog_image", blogData.image);

      const response = await axios.put(
        server_url + `/api/blog/update_blog/${blog._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;
      if (data?.success) {
        setBlogData({
          title: "",
          description: "",
        });
        set_image_url(
          "https://res.cloudinary.com/dpf3ipd7p/image/upload/v1752746922/blank-white-background-soft-gradient-600nw-2471312313_ub2odv.webp"
        );
          toast.success(data.message);
          navigate("/blogsList");
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
    <>
      <div className={"min-w-sm bg-gray-100"}>
        <h1 className=" font-bold p-2 my-3 text-center border-b bg-white border-green-300">
          ADD BLOG
        </h1>

        <form onSubmit={handle_submit}>
          <div className=" grid min-w-60 max-w-full mx-5 my-5">
            <label
              htmlFor="title"
              className=" font-semibold text-sm pl-1 py-1 "
            >
              Title:
            </label>
            <input
              onChange={handle_input_change}
              type="text"
              name="title"
              value={blogData.title}
              id="title"
              className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
              placeholder="title .."
            />
          </div>
          <div className=" grid  mx-5 my-5">
            <label
              htmlFor="description"
              className=" font-semibold text-sm pl-1 py-1 "
            >
              Description:
            </label>
            <Editor
              className=" resize!"
              name="description"
              value={blogData.description}
              onChange={handle_input_change}
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
              {is_loading && (
                <RiLoader4Line className=" animate-spin text-lg" />
              )}
              UPDATE BLOG
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Edit_blog;
