import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { server_url } from "../config/ServerUrl";
import { TbCategory } from "react-icons/tb";
import { IoPricetags } from "react-icons/io5";
import DescriptionIcon from "@mui/icons-material/Description";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import { GoDotFill } from "react-icons/go";
import HotelClassIcon from "@mui/icons-material/HotelClass";
import PriceFormatter from './../utilities/PriceFormatter';
import { WiTime11 } from "react-icons/wi";
import { CiDiscount1 } from "react-icons/ci";
import { MdRateReview } from "react-icons/md";
import  Rating  from '@mui/material/Rating';

const ViewSingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const Stock = true;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${server_url}/api/product/get_single_product/${id}`
        );
        const data = response?.data;

        if (data?.success) {
          setProduct(data?.product);
          setSelectedImage(data?.product?.images[0]);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  const calculateDiscount = (oldPrice, newPrice) => {
    return (
  Math.round(((oldPrice-newPrice)/oldPrice)*100)
    )
  }
  const TruncatedDescription = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    }
    return str;
  };
  if (isLoading) return <p className="text-center my-5">Loading...</p>;

  return (
    <div className="bg-zinc-100">
      <h1 className="font-bold text-center m-5">Single Product Page</h1>

      <div className=" grid md:flex my-5">
        <div className="flex  gap-4  border border-gray-300 m-1">
          {/* Thumbnail Images */}
          <div className="h-70 overflow-y-auto sliderChild  w-20">
            {product?.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className={`w-15 h-15 m-1 object-cover rounded-md cursor-pointer border border-green-400 ${
                  selectedImage === img ? "ring-1 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div className=" max-w-70">
            <Zoom zoomMargin={40} overlayBgColorEnd="rgba(0, 0, 0, 0.9)">
              <img
                src={selectedImage}
                alt="Selected Product"
                className="w-full h-70 object-contain rounded-md border border-gray-300 cursor-zoom-in"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  display: "block",
                }}
              />
            </Zoom>
          </div>
        </div>
        <div className=" flex-1 w-full p-2">
          <div className="flex flex-col gap-2  justify-between h-full">
            <div>
              <h1 className={"font-semibold m-1 "}>{product?.name}</h1>
            </div>

            <div className=" flex items-center gap-3 ">
              <div className=" flex items-center gap-2 ">
                <IoPricetags className=" text-orange-500 text-lg  " />
                <h1 className=" font-semibold text-sm">Old Price : </h1>
              </div>
              <PriceFormatter className=" text-sm" price={product?.old_price} />
            </div>
            <div className=" flex items-center gap-3 ">
              <div className=" flex items-center gap-2 ">
                <IoPricetags className=" text-orange-500 text-lg  " />
                <h1 className=" font-semibold text-sm">Price : </h1>
              </div>
              <PriceFormatter className=" text-sm" price={product?.price} />
            </div>

            <div className=" flex items-center gap-3 ">
              <div className=" flex items-center gap-2 ">
                <CiDiscount1 className=" text-orange-500 text-lg  " />
                <h1 className=" font-semibold text-sm">Discount : </h1>
              </div>
              <p className=" text-sm text-orange-600">
                {calculateDiscount(product?.old_price, product?.price)}%
              </p>
            </div>

            <div className=" flex items-center gap-3 ">
              <div className=" flex items-center gap-2 ">
                <HotelClassIcon className=" text-orange-500 text-lg -ml-1" />
                <h1 className=" font-semibold text-sm">Rating : </h1>
              </div>
              <ProductRating rating={product.rating} />
            </div>

            <div className=" flex items-center gap-3">
              <div className=" flex items-center gap-2 ">
                <BrandingWatermarkIcon className=" text-orange-500 text-[18px]!" />
                <h1 className=" font-semibold text-sm">Brand : </h1>
              </div>
              <p className="text-s">{product?.brand}</p>
            </div>

            <div className=" flex items-center gap-3 ">
              <div className=" flex items-center gap-2 ">
                <TbCategory className=" text-orange-500 text-lg  " />
                <h1 className=" font-semibold text-sm ">Category : </h1>
              </div>
              <p className="text-sm">{product?.category_name}</p>
            </div>

            {Stock ? (
              <div className=" flex items-center gap-3 -ml-1.5">
                <GoDotFill className="text-green-500 text-3xl" />
                <p className="text-sm">In Stock ({product.count_in_stock})</p>
              </div>
            ) : (
              <div className=" flex items-center gap-3 -ml-1.5">
                <GoDotFill className="text-red-600 text-3xl" />
                <p className="text-xs">Out of Stock</p>
              </div>
            )}

            <div className=" flex items-center gap-3 ">
              <div className=" flex items-center gap-2 ">
                <WiTime11 className=" text-orange-500 text-[20px] -ml-0.5" />
                <h1 className=" font-semibold text-sm">Published : </h1>
              </div>
              <p className="text-sm">{product?.createdAt.split("T")[0]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="  m-1">
        <div className=" bg-white border my-5 border-gray-300 py-2">
          <div className=" flex items-center gap-2 justify-center">
            <DescriptionIcon className=" text-orange-500 text-lg  " />
            <h1 className=" font-semibold  "> Product Description </h1>
          </div>
          <p className="text-sm p-3">{product?.description}</p>
        </div>

        <div className=" bg-white py-5">
          <div className=" flex items-center gap-2 justify-center ">
            <MdRateReview className=" text-orange-500 text-2xl  " />
            <h1 className=" font-semibold  "> Customer Reviews </h1>
          </div>
          <div className=" bg-white border my-5 border-gray-300 py-2flex overflow-y-aut p-5 gap-[2%]  rounded-sm">
            <div className=" max-h-10 max-w-10 rounded-full border border-gray-500 overflow-hidden">
              <img
                className=" object-cover w-full"
                src="https://res.cloudinary.com/dpf3ipd7p/image/upload/v1750861937/smile_clear_liv5hu.png"
              />
            </div>
            <div>
              <p className=" font-semibold text-sm">Mahmud Hasan</p>
              <p className=" font-extralight text-sm">10/5/2025</p>
              <Rating name="read-only" value={5} readOnly size="small" />
              <p className=" font-extralight text-sm">
                Precision: Accurate tracking for smooth cursor control. Plug &
                Play: Easy setup without the need for additional drivers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleProduct;
