import React from "react";
import Container from "./Container";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegImages } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useState } from "react";
import Button from "@mui/material/Button";
import { RiLoader4Line } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { server_url } from "../config/ServerUrl";
import { useSelector } from "react-redux";

const UploadHomeSlider = () => {
  const [image, setImage] = useState(null);
  const [is_loading, set_loading] = useState(false);
  const [sliderData, setSliderData] = useState({
    Title: "",
    TextAlign: "",
    TextColor: "",
    image: null,
  });
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSliderData({ ...sliderData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sliderData.image) {
      toast.error("Slider image is required");
      return;
    }
    try {
      set_loading(true);

      const formData = new FormData();
      formData.append("Title", sliderData.Title);
      formData.append("TextColor", sliderData.TextColor);
      formData.append("TextAlign", sliderData.TextAlign);
      formData.append("image", sliderData.image);

      const response = await axios.post(
        server_url + "/api/slider/add_slider",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response?.data;
      if (data?.success) {
        setSliderData({
          Title: "",
          image: null,
        });
        setImage(null);
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
    <Container>
      <h1 className=" font-bold animationTextColor text-center  border-gray-300">
        UPLOAD HOME SLiDER
      </h1>
      <form onSubmit={handleSubmit}>
        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="slideTitle"
            className=" font-semibold text-sm pl-1 py-1 "
          >
            Title :
          </label>
          <input
            onChange={(e) =>
              setSliderData({ ...sliderData, Title: e.target.value })
            }
            type="text"
            value={sliderData.Title}
            id="slideTitle"
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Slide Title .."
          />
        </div>
        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label
            htmlFor="TextColor"
            className=" font-semibold text-sm pl-1 py-1 "
          >
            Text Color :
          </label>
          <input
            onChange={(e) =>
              setSliderData({ ...sliderData, TextColor: e.target.value })
            }
            type="color"
            value={sliderData.TextColor}
            id="TextColor"
            className=" border border-gray-400 bg-white "
            placeholder="TextColor .."
          />
        </div>

        <div className=" grid min-w-60 max-w-70 mx-5 my-5">
          <label className=" font-semibold text-sm pl-1 py-1 ">
            Text Align :
          </label>

          <select
            className=" border outline-none p-1 rounded-sm border-gray-400 text-sm"
            onChange={(e) =>
              setSliderData({ ...sliderData, TextAlign: e.target.value })
            }
          >
            <option>Select Text Align</option>
            <option value={"right"}>Right</option>
            <option value={"left"}>Left</option>
          </select>
        </div>

        <div className="  w-full flex border flex-wrap border-gray-300 bg-zinc-100">
          {image && (
            <div className=" max-w-40 max-h-30 border border-dashed rounded-sm mx-5 my-5 relative">
              <LazyLoadImage
                className=" w-full object-contain! h-30"
                src={image}
                alt={"My beautiful image"}
                effect="blur"
                placeholderSrc="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDQ0HCA0NBwcHBw0HBwcHDQ8IDQcNFREWFhURExMYHSggGBolGxMVITEhMSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDw0NDysZFRkrNystLTcrKzcrNystLSsrKystKy0rKysrKysrKysrKysrLSsrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QAGxABAQEBAQEBAQAAAAAAAAAAAAECEhEDE8H/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQIDBP/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A+uzlcyvOV5y7154nOWkyrOWmcoqZlcyqZVMopTK5k5lciKUi5DkXnKKUi5DmVTIokXIUi5BRFwvDiCoYgFMAASaoqCKmrqKqM9M9NajQMdRlqN9MdRUZ+ErwKjizlecnI0mRkplcyectJEVMyqZXMqmUVMiplUyuQEyLzDkXIilIch+HIKJFyFFQUvDh+GAMABAZAE1RUE1FXU0GdiK0qNKjLTLUbaZ6Bl4Z+BUc+crmRIuRGTkXmCRciKcipDkOQUplcgkVIiiZVIJFAXh+A4KJFSEcAwABgAAAVAFRSAqVMqoioq6igz0z00qNCMwoKMcxpInLSIyrMXIWVwU5FSCKiKJFSCKgFIZwVFIwFDMoaBgBQAAUEZUBUqpAkqqlREVFXUUGekaa6Z1RHgMwY5aZRlpkYXFxOYuIqooooU4cEOIpwAwI/DApGAAAAAAAAABEZARUyoIqaqpqiKirqaCDBg58tcsctcq5tYuM4vKK0ikxUFVDTFRFOGRgDIAYIxQAAAAAFTIBSFFAip0qCaiqpUEVFXU0EgGo5M1rlz4rbNVhtGmWWWmQaRURFxFVDiYqAqGmKiKAAAAAGCMUAAARkBUjIBSp0qCL/Cp1NFKpqk0Egwg87Fa5rmxW+K25ujNaZrDNa5oNs1cZSrlRWspolVKCoafQKoF6PUD9HpD0D9HpegFej1Po9FV6Rej0DIEAIACqadKoqamqqaBAAV42K3xXHjToxWnN15rXNc2K2zVG8q81jK0zQayq9ZyqlBcpp9NAwQAzSAUPUgVXoSYGPUgD9BD1AyIChJkgVTVFRUgBFfOfPToxpxY06Mabc3bjTbNcmNNs6B1ZrSVz501zVG8q5WGauUGsp+s5T9Bfpo9HoL9CPR6Cx6n0eoK9HqfR6Ch6n0egok+j0VXoT6PUDIvR6igqXo9FMi9CK+S+enT89OD56dHz0rLuxpvjTixtvjSo7M6a505MbbZ0qOnOlyufOlzSjeVXrCaV0DX0es+h0DX0esuj6Bp6PWfQ6Qaej1n0Ogaej1n0Ogaej1n0OkVp6PWfQ6Qaei1n0OhVWj1F0XSKv02fQFfFfPToxpwfPbo+exHfjTfGnDjbfG1R3Y21zpx421ztR2Z0uacudtJtUdE0rpzzSuijfodMeh0Ub9Dpj2O0o26HTHsdlG3Q6Y9jsG3R9MOz7SjbodMex2K26HTHsdoNuh0x7HYrW6TdM7tPYNugx7Ar4bG3TjbzsbdHz2xSPRxtvjbg+e22NrSO/G22duHG2udrSO7O1zbjztpNrUjrm1duSbX2Ujp7PtzdjspHT2fbm7PtKR0djtz9jspHR2O3P2OykdHY7Ydl2Ujo7Hbn7HZSOnsdubsdlV0djtz9l2De7K7c92m7VHT2HN2AfD426Mbefjboxtyrb0cbbY+jz8fRtj6FI9HH0a5+jgx9GmdlI78/RpPo4c/Rc+i0jun0VPo4p9FT6FI7P0P9HH2fZSOz9D/Rx9n2lI6/0Hbl7HZSOrsduXsdlI6ux25ex+i0jq/QduT9B+hSOv8AQv0cn6D9FpHV+hfq5L9Cv1VHVfqm/VyX6pv1axnXX+ocf6BUfJ4dGAHB1b4bYARW2GuQAaZaQAFRcAAzhgAZADAAGCAGQAFQAqEQCiaVAbxlFTQGsZ1IAaZf/9k="
              />
              <RxCrossCircled
                onClick={() => {
                  setImage(null), setSliderData({ ...sliderData, image: null });
                }}
                className=" absolute top-0 right-0  cursor-pointer hover:text-red-500"
              />
            </div>
          )}
          <div className=" w-30 h-30 border border-dashed rounded-sm mx-5 my-5 relative">
            <FaRegImages className=" absolute top-0 right-0 h-full w-full opacity-40 p-3" />
            <input
              accept="image/*"
              type="file"
              className=" w-full h-full opacity-0"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="mx-auto my-5 border border-green-500 flex justify-center items-center">
          <Button
            disabled={is_loading}
            type="submit"
            sx={{ color: "green" }}
            className=" font-bold! w-full! disabled:cursor-not-allowed! disabled:opacity-50!"
          >
            {is_loading && <RiLoader4Line className=" animate-spin text-lg" />}
            UPLOAD HOME SLIDER
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default UploadHomeSlider;
