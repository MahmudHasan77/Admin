import React, { useEffect } from "react";
import { useState } from "react";
import { FaRegImages } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { TbLoader2 } from "react-icons/tb";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import  Editor  from "react-simple-wysiwyg";

const EditProduct = () => {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const category_list = useSelector(
    (state) => state?.Ecommerce_Admin?.categories
  );
  const location = useLocation();
  const product = location?.state?.product;
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const [product_data, set_product_data] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    old_price: product?.old_price || "",
    discount: product?.discount || "",
    brand: product?.brand || "",
    count_in_stock: product?.count_in_stock || "",
    rating: product?.rating || 0,
    offer: product?.offer || false,
    ram: product?.ram || "",
    isAvailable: product?.isAvailable || true,
    category_id: product?.category_id || "",
    category_name: product?.category_name || "",
    type_id: product?.type_id || "",
    type_name: product?.type_name || "",
  });
  const [existing_images, set_existing_images] = useState(
    product?.images || []
  );
  const [new_images, set_new_images] = useState([]);
  const [image_previews, set_image_previews] = useState(product?.images || []);

  const {
    name,
    price,
    description,
    old_price,
    discount,
    brand,
    count_in_stock,
    offer,
    ram,
  } = product_data;

  const [type_list, set_type_list] = useState();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    set_new_images((prev) => [...prev, ...files]);
    const new_urls = files.map((file) => URL.createObjectURL(file));
    set_image_previews((prev) => [...prev, ...new_urls]);
  };

  const [rams, setRams] = useState();

  useEffect(() => {
    const fetchingRAM = async () => {
      try {
        const response = await axios.get(server_url + `/api/ram/getRam`);
        const data = response?.data;
        if (data?.success) {
          setRams(data.rams);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    };
    fetchingRAM();
  }, []);

  const handleRemoveImage = (url) => {
    if (existing_images.includes(url)) {
      set_existing_images(existing_images.filter((img) => img !== url));
    }
    const updated_new_images = new_images.filter(
      (file) => URL.createObjectURL(file) !== url
    );
    set_new_images(updated_new_images);
    set_image_previews(image_previews.filter((img) => img !== url));
  };

  const handleCategoryChange = (e) => {
    const selected_category = category_list?.find(
      (cat) => cat?._id == e.target.value
    );
    set_product_data({
      ...product_data,
      category_id: selected_category?._id,
      category_name: selected_category?.name,
    });
    set_type_list(selected_category);
  };
  const handle_type_change = async (e) => {
    const selected_type = await type_list?.children?.find(
      (cat) => String(cat?._id) == String(e.target.value)
    );
    set_product_data({
      ...product_data,
      type_id: selected_type?._id,
      type_name: selected_type?.name,
    });
  };

  const handle_change = (e) => {
    set_product_data({ ...product_data, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    new_images.forEach((file) => {
      formData.append("product_image", file);
    });

    existing_images.forEach((url) => {
      formData.append("existing_image", url);
    });

    Object.entries(product_data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value?.forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, value);
      }
    });

    try {
      setLoading(true);
      const res = await axios.put(
        `${server_url}/api/product/update_product/${product._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data?.success) {
        toast.success(res.data.message);
        navigate("/productslist");
      } else {
        toast.error(res?.data?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle_submit} className={"bg-zinc-100 p-3"}>
      <h1 className=" font-bold text-center border-b m-1 p-1 border-gray-300">
        UPLOAD PRODUCT
      </h1>
      <div className=" grid w-full sm:w-[70%] md:w-[80%] mx-auto my-5">
        <label
          htmlFor="product name"
          className=" font-semibold text-sm pl-1 py-1"
        >
          Product Name :
        </label>
        <input
          type="text"
          id="product name"
          name={"name"}
          value={name}
          onChange={handle_change}
          className=" border border-gray-400 bg-white outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
          placeholder="Product name"
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
          className=" resize! w-[100%]!"
          name="description"
          value={description}
          onChange={handle_change}
        />
      </div>

      <div className="w-full flex flex-wrap justify-center">
        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="ProductCategory"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Product Category :
          </label>
          <select
            onChange={handleCategoryChange}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
          >
            <option>Select category</option>
            {category_list?.map((cat) => {
              return (
                <option key={cat?._id} value={cat?._id}>
                  {cat?.name}
                </option>
              );
            })}
          </select>
        </div>

        {type_list?.children?.length > 0 && (
          <div className=" grid min-w-60 max-w-70 mx-5 my-5">
            <label
              htmlFor="Product Type"
              className=" font-semibold text-sm pl-1 py-1"
            >
              Product Type :
            </label>
            <select
              onChange={handle_type_change}
              className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            >
              <option>Select type</option>
              {type_list?.children?.map((type) => {
                return (
                  <option key={type._id} value={type?._id}>
                    {type?.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="product price"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Product RAM :
          </label>
          <select
            onChange={handle_change}
            id="product price"
            name={"ram"}
            value={ram}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Product Price"
          >
            {rams?.map((ram) => {
              return <option value={ram?.name}>{ram?.name}</option>;
            })}
          </select>
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="product price"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Product Price :
          </label>
          <input
            type="text"
            onChange={handle_change}
            id="product price"
            name={"price"}
            value={price}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Product Price"
          />
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="product Old Price"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Product Old Price :
          </label>
          <input
            type="text"
            onChange={handle_change}
            name={"old_price"}
            value={old_price}
            id="product Old Price"
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Product Old Price"
          />
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="Product Brand"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Product Brand :
          </label>
          <input
            type="text"
            onChange={handle_change}
            id="Product Brand"
            name={"brand"}
            value={brand}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Product Brand"
          />
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="product discount"
            className=" font-semibold text-sm pl-1 py-1"
          >
            product discount :
          </label>
          <input
            onChange={handle_change}
            type="text"
            name={"discount"}
            value={discount}
            id="product discount"
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="product discount"
          />
        </div>
        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="count_in_stock"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Count in stock :
          </label>
          <input
            onChange={handle_change}
            type="text"
            name={"count_in_stock"}
            value={count_in_stock}
            id="count_in_stock"
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Count in stock"
          />
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <Stack spacing={1}>
            <Rating
              name="rating"
              value={product_data.rating}
              onChange={(event, newValue) =>
                set_product_data({ ...product_data, rating: newValue })
              }
              precision={0.5}
            />
          </Stack>
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="Product offer "
            className=" font-semibold text-sm pl-1 py-1"
          >
            Product offer :
          </label>
          <select
            onChange={handle_change}
            name={"offer"}
            value={offer}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
          >
            <option value={false}>false</option>
            <option value={true}>True</option>
          </select>
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="is Available "
            className=" font-semibold text-sm pl-1 py-1"
          >
            is Available :
          </label>
          <select
            onChange={handle_change}
            name={"isAvailable"}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
          >
            <option value={true}>True</option>
            <option value={false}>false</option>
          </select>
        </div>
      </div>
      <div className="">
        <h1 className=" font-semibold text-sm mx-5 my-5"> Upload Image </h1>
        <div className=" flex flex-wrap">
          <div className="  w-full flex flex-wrap">
            <div className="flex flex-wrap">
              {image_previews.map((img, index) => (
                <div
                  key={index}
                  className="w-20 h-20 m-2 relative border rounded-sm"
                >
                  <LazyLoadImage
                    src={img}
                    alt="Preview"
                    effect="blur"
                    className="object-cover w-full h-full"
                  />
                  <RxCrossCircled
                    onClick={() => handleRemoveImage(img)}
                    className="absolute top-0 right-0 cursor-pointer text-red-500"
                  />
                </div>
              ))}

              <div className="w-20 h-20 m-2 border border-dashed rounded-sm relative">
                <FaRegImages className="absolute top-0 right-0 h-full w-full opacity-40 p-3" />
                <input
                  type="file"
                  multiple
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <div className="mx-auto my-5 flex justify-around  w-full">
            <Button
              type="submit"
              sx={{ color: "green" }}
              className=" font-bold! border! border-green-500 bg-orange-400! mt-5! text-white! w-40"
            >
              {isLoading && (
                <TbLoader2 className=" mx-3 text-lg animate-spin" />
              )}
              UPDATE PRODUCT
            </Button>
            <Button
              sx={{ color: "green" }}
              className=" font-bold! border! border-green-500 bg-orange-400! mt-5! text-white! w-40"
            >
              <Link to={"/productslist"}>cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProduct;
