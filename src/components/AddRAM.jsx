import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { RiLoader4Line } from "react-icons/ri";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";

const AddRAM = () => {
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const [is_loading, set_loading] = useState(false);
  const [ram, setRam] = useState();
  const [ramList, setRamList] = useState([]);
  const [delete_loading, set_delete_loading] = useState("");

  useEffect(() => {
    const fetchingRAM = async () => {
      try {
        const response = await axios.get(server_url + `/api/ram/getRam`);
        const data = response?.data;
        if (data?.success) {
          setRamList(data.rams);
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

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      set_loading(true);
      const response = await axios.post(
        server_url + "/api/ram/add_ram",
        { ram },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response?.data;
      if (data.success) {
        toast.success(data?.message);
        try {
          const response = await axios.get(server_url + `/api/ram/getRam`);
          const data = response?.data;
          if (data?.success) {
            setRamList(data.rams);
          } else {
            toast.error(data?.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set_loading(false);
    }
  };

  const deleteRAM = async (id) => {
    try {
      set_delete_loading(id);
      const response = await axios.delete(
        server_url + `/api/ram/deleteRam/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response?.data;
      if (data?.success) {
        setRamList(ramList.filter((ram) => ram?._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
      set_delete_loading("");
    }
  };

  return (
    <div>
      <h1 className=" font-bold text-center animationTextColor">ADD RAM & STORAGE</h1>
      <form onSubmit={handle_submit}>
        <div className=" grid min-w-60 max-w-70 mx-auto my-5">
          <label
            htmlFor="RAM  Input Name"
            className=" font-semibold text-sm pl-1 py-1 "
          >
            RAM & Storage Input :
          </label>
          <input
            onChange={(e) => setRam(e.target.value.toUpperCase())}
            type="text"
            value={ram}
            id="RAM  Input Name"
            className=" border border-gray-400 bg-white max-h-40 resize-none outline-none text-sm px-2 py-1.5 rounded-sm customshadow1"
            placeholder="Type ram .."
          />
        </div>
        <div className="mx-auto w-60 my-5 border border-green-500 flex justify-center items-center">
          <Button
            type="submit"
            sx={{ color: "green" }}
            className=" font-bold! w-full!"
          >
            {is_loading && <RiLoader4Line className=" animate-spin text-lg" />}
            ADD RAM & STORAGE
          </Button>
        </div>
      </form>
      <div className=" grid">
        <div className=" mx-auto mr-2">
          {ramList?.map((ram) => {
            return (
              <div className=" flex max-w-sm min-w-sm items-center justify-between bg-white border border-gray-300 p-2">
                <h1 className=" font-bold">{ram?.name}</h1>
                <div>
                  <Tooltip title="Delete Product">
                    {delete_loading == ram._id ? (
                      <BiLoaderCircle className=" text-xl animate-spin text-red-500 bg-gray-200 rounded-full cursor-pointer" />
                    ) : (
                      <AiTwotoneDelete
                        className=" text-xl hover:text-red-500 bg-gray-200 rounded-full cursor-pointer"
                        onClick={() => deleteRAM(ram?._id)}
                      />
                    )}
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddRAM;
