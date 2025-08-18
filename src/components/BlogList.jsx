import Tooltip from "@mui/material/Tooltip";
import { CiEdit } from "react-icons/ci";
import { AiTwotoneDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import { BiLoaderCircle } from "react-icons/bi";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import truncate from 'truncate-html'
import DOMPurify from 'dompurify';

const BlogList = () => {
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const [delete_loading, set_delete_loading] = useState("");
  const [blogs, setBlogs] = useState([]);



  useEffect(() => {
    const fetching = async () => {
      const response = await axios.get(server_url + "/api/blog/get_blog");
      const data = response?.data;
      if (data?.success) {
        setBlogs(data?.blogs);
      } else {
        toast.error(data?.message);
      }  
    };  
    fetching();
  }, []);  

  const delete_blog = async (id) => {
    try {
      set_delete_loading(id);
      const response = await axios.delete(
        server_url + `/api/blog/delete_blog/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response?.data;
      if (data?.success) {
        toast.success(data?.message);
        const response = await axios.get(server_url + "/api/blog/get_blog");
        const get_data = response?.data;
        setBlogs(get_data?.blogs);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      set_delete_loading("");
    }
  };
  return (
    <div className={" min-w-sm mr-3"}>
      <div className=" flex justify-around items-center my-3 border border-gray-300">
        <h1 className="animationTextColor font-bold  text-center flex-1 bg-white p-3">
          BLOGS LIST {blogs.length && <span className=" text-xs">({ blogs.length})</span>}
        </h1>
        <Link to={"/addBlogs"} className=" font-semibold ">
          <div className="font-bold  text-center p-3  bg-white hover:text-orange-500">
            Add Blog
          </div>
        </Link>
      </div>
      <div className=" font-semibold grid grid-cols-7 border border-green-300 p-4 bg-white greenShadow">
        <h1 className=" col-span-2">Image</h1>
        <h1 className=" col-span-2">Title</h1>
        <h1 className=" col-span-2">Description</h1>

        <h1 className="">Action</h1>
      </div>
      {blogs?.map((blog) => {
        return (
          <div key={blog?._id} className=" border h-30 border-green-500 bg-white my-3">
            <div className="  grid grid-cols-7 items-center greenShadow">
              <div className="w-29 h-29 col-span-2 p-2 overflow-hidden flex items-center justify-center">
                <img
                  className=" w-full h-auto object-contain "
                  src={blog?.image}
                />
              </div>
              <h1 className="col-span-2 font-semibold text-xs md:text-sm">
                {blog?.title?.slice(0, 100) + "..."}
              </h1>
              <div
                className="col-span-2  text-[1px]"
                dangerouslySetInnerHTML={{
                  __html: truncate(DOMPurify.sanitize(blog?.description),50)
                }}
              ></div>
              <div className="flex items-center justify-around text-lg border-r p-1 border-green-200 ">
                <Link to={"/Edit_blog"} state={blog}>
                  <Tooltip title="Edit Product">
                    <CiEdit className=" rounded-full cursor-pointer text-green-600 hover:border border-green-300 duration-300 bg-green-100" />
                  </Tooltip>
                </Link>
                <Tooltip title="Delete Product">
                  <span>
                    {delete_loading == blog._id ? (
                      <BiLoaderCircle className=" text-xl animate-spin text-red-500 bg-gray-200 rounded-full cursor-pointer" />
                    ) : (
                      <AiTwotoneDelete
                        className=" text-xl hover:text-red-500 bg-gray-200 rounded-full cursor-pointer"
                        onClick={() => delete_blog(blog?._id)}
                      />
                    )}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogList;
