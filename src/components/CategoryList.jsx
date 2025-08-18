import React from "react";
import Container from "./Container";
import Tooltip from "@mui/material/Tooltip";
import { FaRegEyeSlash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { AiTwotoneDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import { categories } from "../redux/Ecommerce_Admin_slice";
import { useDispatch } from "react-redux";
import { BiLoaderCircle } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FaRegImages } from "react-icons/fa";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import {
  RiArrowDownWideLine,
  RiArrowUpWideLine,
  RiLoader4Line,
} from "react-icons/ri";
import { category_store } from "./../redux/Ecommerce_Admin_trunk";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const dispatch = useDispatch();
  const category_list = useSelector(
    (state) => state?.Ecommerce_Admin?.categories
  );
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    dispatch(category_store());
  }, [dispatch]);

  const [is_open_box, set_open_box] = useState(false);
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const [delete_loading, set_delete_loading] = useState("");
  const [box_info, set_box_info] = useState(null);

  const delete_category = async (id) => {
    try {
      set_delete_loading(id);
      const response = await axios.delete(
        server_url + `/api/category/delete_category/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response?.data;
      if (data?.success) {
        toast.success(data?.message);
        const response = await axios.get(
          server_url + "/api/category/get_categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response?.data?.success) {
          dispatch(categories(response?.data?.categories));
        } else {
          toast.error(response?.data.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      set_delete_loading("");
    }
  };

  const [image_url, set_image_url] = useState(null);
  const [form_data, set_form_data] = useState({ name: "", image: null });
  const [is_loading, set_loading] = useState(false);
  const handle_input_change = (e) => {
    set_form_data({ ...form_data, name: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    set_form_data({ ...form_data, image: file });
    if (file) {
      set_image_url(URL.createObjectURL(file));
    }
  };

  const handle_submit = async (e) => {
    try {
      set_loading(true);

      const formData = new FormData();
      formData.append("name", form_data.name);
      formData.append("category_image", form_data.image);

      const response = await axios.put(
        server_url + `/api/category/update_category/${e}`,
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
        set_open_box(false);
        set_image_url(
          "https://res.cloudinary.com/dpf3ipd7p/image/upload/v1752746922/blank-white-background-soft-gradient-600nw-2471312313_ub2odv.webp"
        );
        dispatch(category_store());

        toast.success(data?.message);
        console.log(data?.message);
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

  const handle_edit_category = (e) => {
    set_open_box(true),
      set_box_info(e),
      set_form_data({ name: e.name }),
      set_image_url(e?.image);
  };

  const [is_open_children, set_open_children] = useState();

  return (
    <div className={"bg-gray-100 min-w-sm mr-2"}>
      <div className=" flex justify-around items-center border border-gray-300 py-5 mb-5 bg-white">
        <h1 className=" font-bold text-center animationTextColor">
          CATEGORY LIST
        </h1>
        <Link to={"/AddCategory"} className=" font-semibold">
          <div className="font-bold animationTextColor text-center   hover:text-orange-500">
            Add Category
          </div>
        </Link>
      </div>
      <div className=" font-semibold grid grid-cols-5 border border-green-200 px-2 py-4 bg-white greenShadow">
        <h1 className=" col-span-2">Image</h1>
        <h1>Title</h1>
        <h1 className=" col-span-2">Action</h1>
      </div>
      {category_list?.map((category) => {
        return (
          <div
            className={` border border-green-200 bg-white mb-2 ${
              is_open_children == category?._id && "bg-zinc-100"
            }`}
          >
            <div className="  grid grid-cols-5 items-center greenShadow">
              <div className="w-25 h-25 col-span-2 p-2 overflow-hidden">
                <img
                  className=" w-full h-auto object-contain"
                  src={category?.image}
                />
              </div>
              <h1 className="col-span-1 font-semibold">{category?.name}</h1>
              <div className="flex items-center justify-around text-lg  p-1  col-span-2 ">
                <Tooltip title="Edit Product">
                  <CiEdit
                    onClick={() => handle_edit_category(category)}
                    className=" rounded-full cursor-pointer text-green-600 hover:border border-green-300 duration-300 bg-green-100"
                  />
                </Tooltip>
                <Tooltip title="Delete Product">
                  {delete_loading == category._id ? (
                    <BiLoaderCircle className=" text-xl animate-spin text-red-500 bg-gray-200 rounded-full cursor-pointer" />
                  ) : (
                    <AiTwotoneDelete
                      className=" text-xl hover:text-red-500 bg-gray-200 rounded-full cursor-pointer"
                      onClick={() => delete_category(category?._id)}
                    />
                  )}
                </Tooltip>
              </div>
            </div>

            {category?.children?.length > 0 && (
              <button
                className=" relative text-center  w-full bg-blue-50/50 text-xs p-1 text-blue-500 md:text-sm capitalize"
                onClick={() =>
                  set_open_children(
                    is_open_children == category?._id ? "" : category?._id
                  )
                }
              >
                view type
                {is_open_children ? (
                  <RiArrowUpWideLine className=" absolute top-2 right-[20%]" />
                ) : (
                  <RiArrowDownWideLine className=" absolute top-2 right-[20%]" />
                )}
              </button>
            )}

            {is_open_children == category?._id && (
              <div className="  bg-zinc-100 m-2 border border-gray-300">
                {category?.children?.map((type) => {
                  return (
                    <div className="border-b border-gray-300">
                      <div className="  grid grid-cols-5 items-center">
                        <div className="w-10 h-10 col-span-2 p-2 overflow-hidden">
                          <img
                            className=" w-full h-auto object-contain"
                            src={type?.image}
                          />
                        </div>
                        <h1 className="col-span-1 font-semibold text-xs">
                          {type?.name}
                        </h1>
                        <div className="flex items-center justify-around text-lg col-span-2 ">
                          <Tooltip title="Edit Product">
                            <CiEdit
                              onClick={() => handle_edit_category(type)}
                              className=" rounded-full cursor-pointer text-green-600 hover:border border-green-300 duration-300 bg-green-100"
                            />
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            {delete_loading == type._id ? (
                              <BiLoaderCircle className=" text-xl animate-spin text-red-500 bg-gray-200 rounded-full cursor-pointer" />
                            ) : (
                              <AiTwotoneDelete
                                className=" text-xl hover:text-red-500 bg-gray-200 rounded-full cursor-pointer"
                                onClick={() => delete_category(type?._id)}
                              />
                            )}
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <Modal
                open={is_open_box}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(), handle_submit(box_info?._id);
                    }}
                  >
                    <div className=" grid min-w-60 max-w-70 mx-5 my-5">
                      <label
                        htmlFor="Category Name"
                        className=" font-semibold text-sm pl-1 py-1 "
                      >
                        Category Name :
                      </label>
                      <input
                        onChange={handle_input_change}
                        type="text"
                        value={form_data.name}
                        id="Category Name"
                        className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
                        placeholder="Category Name .."
                      />
                    </div>
                    <div className="  w-full flex">
                      <div className=" w-10 h-10 border border-dashed rounded-sm mx-5 relative">
                        <LazyLoadImage
                          src={image_url}
                          alt={"category image"}
                          effect="blur"
                          className=" w-10 h-10 object-contain"
                          placeholderSrc="https://res.cloudinary.com/dpf3ipd7p/image/upload/v1752746922/blank-white-background-soft-gradient-600nw-2471312313_ub2odv.webp"
                        />
                      </div>
                      <div className=" w-10 h-10 border border-dashed rounded-sm mx-5 relative">
                        <FaRegImages className=" absolute top-0 right-0 h-full w-full opacity-40 p-3" />
                        <input
                          type="file"
                          accept="image/*"
                          className=" w-full h-full opacity-0"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                    <div className="mx-auto my-5 flex items-center justify-around">
                      <Button
                        type="submit"
                        sx={{ color: "green" }}
                        className=" font-bold! border!"
                      >
                        {is_loading && (
                          <RiLoader4Line className=" animate-spin text-lg" />
                        )}
                        UPDATE CATEGORY
                      </Button>
                      <Button
                        sx={{ color: "green" }}
                        className=" font-bold!! border!"
                        onClick={() => set_open_box(false)}
                      >
                        CANCEL
                      </Button>
                    </div>
                  </form>
                </Box>
              </Modal>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
