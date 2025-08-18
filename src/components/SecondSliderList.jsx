import Tooltip from "@mui/material/Tooltip";
import { AiTwotoneDelete } from "react-icons/ai";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import toast from "react-hot-toast";
import { TbLoader } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { BiLoaderCircle } from "react-icons/bi";
import { category_store } from "../redux/Ecommerce_Admin_trunk";

const HomeSliderList = () => {
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const [is_loading, set_loading] = useState(false);
  const [sliders, setSliders] = useState([]);
  const [delete_loading, set_delete_loading] = useState("");
  const dispatch = useDispatch();

  const category_list = useSelector(
    (state) => state?.Ecommerce_Admin?.categories
  );
  useEffect(() => {
    dispatch(category_store());
  }, [dispatch]);
  useEffect(() => {
    const fetchingSlider = async () => {
      try {
        set_loading(true);

        const response = await axios.get(
          server_url + "/api/slider/get_second_slider"
        );

        const data = response?.data;
        if (data?.success) {
          setSliders(data?.sliders);
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
    fetchingSlider();
  }, []);

  const delete_slider = async (id) => {
    try {
      set_delete_loading(id);
      const response = await axios.delete(
        server_url + `/api/slider/delete_second_slider/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response?.data;
      toast.success(data?.success && data?.message);
      if (data?.success) {
        const response = await axios.get(
          server_url + "/api/slider/get_second_slider"
        );

        const data = response?.data;
        if (data?.success) {
          setSliders(data?.sliders);
        } else {
          toast.error(data?.message);
        }
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      set_delete_loading("");
    }
  };
  return (
    <div className="mr-2">
      <h1 className=" font-bold text-center animationTextColor pb-3 border-gray-300">
        HOME SLIDER
      </h1>
      {is_loading ? (
        <div className=" flex justify-center m-10">
          <TbLoader className=" text-2xl animate-spin" />
        </div>
      ) : (
        <>
          <div className=" font-semibold text-sm grid grid-cols-7 border p-5 border-gray-300 bg-white min-w-2xl">
            <h1 className=" col-span-2">Image</h1>
            <h1 className=" col-span-2">Title</h1>
            <h1>Text Color</h1>
            <h1>Category</h1>
            <h1>Action</h1>
          </div>
          {sliders?.map((slider) => {
            return (
              <div key={slider?._id}>
                <div
                  key={slider._id}
                  className="my-5 h-32 gap-1 items-center  grid grid-cols-7 border border-gray-300 bg-zinc-100"
                >
                  <div className="col-span-2">
                    <img
                      className=" w-40 max-h-30 object-contain"
                      src={slider?.image}
                    />
                  </div>
                  <h1 className=" text-sm col-span-2">{slider?.title}</h1>
                  <input type="color" value={slider?.color} disabled />
                  <h1 className=" text-sm">
                    {category_list?.length &&
                      category_list?.find(
                        (category) => category?._id == slider?.category
                      ).name}
                  </h1>
                  <h1 className="flex items-center  max-w-50 justify-around text-lg ">
                    <Tooltip title="Delete Product">
                      <span>
                        {delete_loading == slider._id ? (
                          <BiLoaderCircle className=" text-xl animate-spin text-red-500 bg-gray-200 rounded-full cursor-pointer" />
                        ) : (
                          <AiTwotoneDelete
                            className=" text-xl hover:text-red-500 bg-gray-200 rounded-full cursor-pointer"
                            onClick={() => delete_slider(slider?._id)}
                          />
                        )}
                      </span>
                    </Tooltip>
                  </h1>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default HomeSliderList;
