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
import { useEffect } from "react";
import Editor from "react-simple-wysiwyg";

const AddProduct = () => {
  const [isLoading, setLoading] = useState(false);
  const category_list = useSelector(
    (state) => state?.Ecommerce_Admin?.categories
  );
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const [product_data, set_product_data] = useState({
    name: "",
    images: [],
    price: "",
    description: "",
    old_price: "",
    category_name: "",
    category_id: "",
    type_name: "",
    type_id: "",
    brand: "",
    count_in_stock: "",
    rating: "",
    offer: false,
    NewArrivals: false,
    ram: '',
    storage: '',
    isAvailable: true,
  });

  const {
    name,
    price,
    old_price,
    brand,
    count_in_stock,
    offer,
    NewArrivals,
  } = product_data;
  const [image_url, set_image_url] = useState([]);
  const [type_list, set_type_list] = useState();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    set_product_data({ ...product_data, images: files });
    const urls = files.map((file) => URL.createObjectURL(file));
    set_image_url((prev) => [...prev, ...urls]);
  };
  const handle_remove_image = (url) => {
    const index = image_url.indexOf(url);
    if (index > -1) {
      const new_urls = [...image_url];
      const new_files = [...product_data.images];

      new_urls.splice(index, 1);

      new_files.splice(index, 1);
      set_image_url(new_urls);
      set_product_data({ ...product_data, images: new_files });
    }
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

  const [rams, setRams] = useState([]);
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

  const handle_change = (e) => {
    set_product_data({ ...product_data, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(product_data).forEach((key) => {
      if (key === "images" && Array.isArray(product_data.images)) {
        product_data.images.forEach((img) => {
          formData.append(`product_image`, img);
        });
      } else if (Array.isArray(product_data[key])) {
        product_data[key].forEach((item) => {
          formData.append(key, item);
        });
      } else {
        formData.append(key, product_data[key]);
      }
    });
    try {
      setLoading(true);
      const response = await axios.post(
        server_url + "/api/product/upload_product",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response?.data;
      if (data?.success) {
        set_product_data({
          name: "",
          images: [],
          price: "",
          description: "",
          old_price: "",
          discount: "",
          category_name: "",
          category_id: "",
          type_name: "",
          type_id: "",
          brand: "",
          count_in_stock: "",
          rating: "",
          offer: false,
          ram: '',
          isAvailable: true,
          NewArrivals: false,
        });
        set_image_url("");
        toast.success(data?.message);
      } else {
        toast.error(data?.message);
      }
    } catch (err) {
      console.error("Submit error", err);
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle_submit} className={"mr-2 p-3"}>
      <h1 className=" font-bold text-center border-b m-1 p-1 border-gray-300 animationTextColor">
        UPLOAD PRODUCT
      </h1>
      <div className=" grid w-full sm:w-[70%] md:w-[80%] mx-auto my-5">
        <label
          htmlFor="product name"
          className=" font-semibold text-sm pl-1 py-1"
        >
          Name :
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
          value={product_data.description}
          onChange={handle_change}
        />
      </div>

      <div className="w-full flex flex-wrap justify-center">
        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="ProductCategory"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Category :
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
              Type :
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
          <label className=" font-semibold text-sm pl-1 py-1">RAM :</label>
          <select
            onChange={handle_change}
            name={"ram"}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
          >
            <option>Select RAM</option>
            {rams?.map((ram) => {
              return (
                <option key={ram?._id} value={ram?.name}>
                  {ram?.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label className=" font-semibold text-sm pl-1 py-1">Storage :</label>
          <select
            onChange={handle_change}
            name={"storage"}
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
          >
            <option>Select Storage</option>
            {rams?.map((ram) => {
              return (
                <option key={ram?._id} value={ram?.name}>
                  {ram?.name}
                </option>
              );
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
            Old Price :
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
            Brand :
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
          <label
            htmlFor="count_in_stock"
            className=" font-semibold text-sm pl-1 py-1"
          >
            Rating :
          </label>
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
            offer :
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
          <label className=" font-semibold text-sm pl-1 py-1">
            New Arrivals :
          </label>
          <select
            onChange={handle_change}
            name={"NewArrivals"}
            value={NewArrivals}
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
            {image_url && (
              <>
                {image_url?.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className=" w-20 h-20 border border-dashed rounded-sm mx-5 my-5 relative"
                    >
                      <LazyLoadImage
                        src={img}
                        alt={"product image"}
                        effect="blur"
                        placeholderSrc="data:image/jpeg;base64,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"
                      />
                      <RxCrossCircled
                        onClick={() => handle_remove_image(img)}
                        className=" absolute top-0 right-0  cursor-pointer hover:text-red-500"
                      />
                    </div>
                  );
                })}
              </>
            )}
            <div className=" w-20 h-20 border border-dashed rounded-sm mx-5 my-5 relative">
              <FaRegImages className=" absolute top-0 right-0 h-full w-full opacity-40 p-3" />
              <input
                type="file"
                multiple
                className=" w-full h-full opacity-0"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="mx-auto my-5 border border-green-500">
            <Button
              type="submit"
              sx={{ color: "green", width: 300 }}
              className=" font-bold!"
            >
              {isLoading && (
                <TbLoader2 className=" mx-3 text-lg animate-spin" />
              )}
              UPLOAD PRODUCT
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
