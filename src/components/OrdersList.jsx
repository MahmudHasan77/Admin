import React, { useState, useEffect } from "react";
import { RiArrowDownWideLine, RiArrowUpWideLine } from "react-icons/ri";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { server_url } from "./../config/ServerUrl";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Pagination from "@mui/material/Pagination";
import { useCallback } from "react";
import { RiLoader2Line } from "react-icons/ri";
const OrdersList = () => {
  const token = useSelector((state) => state.Ecommerce_Admin.token);
  const [page, setPage] = useState(1);
  const [isOpen, setOpen] = useState("");
  const [orders, setOrders] = useState([]);
  const [changeLoading, setChangeLoading] = useState(null);
  const [searchValue, setSearchValue] = useState('')
  const [pagination, setPagination] = useState({})
const [isLoading ,setLoading]=useState(false)

  const handleOpen = (id) => {
    setOpen((prev) => (prev === id ? "" : id));
  };
  const priceFormatter = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${server_url}/api/order/get_all_orders?page=${page}&search=${searchValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response?.data?.orders || []);
      setPagination(response?.data?.pagination || {});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false)
    }
  }, [page, searchValue, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setPage(1); 
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setChangeLoading(id);
      const response = await axios.post(
        `${server_url}/api/order/change_status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      setChangeLoading(null);
    }
  };

  return (
    <div className="min-w-md mr-2 min-h-screen relative">
      <h1 className="animationTextColor font-bold border border-green-200 text-center py-5 mb-2 bg-white greenShadow">
        ORDERS LIST <span>({orders&& orders?.length})</span>
      </h1>
      <div>
        <TextField
          label="Search By Order ID or Order Status ..."
          sx={{ width: "100%", backgroundColor: "white" }}
          onChange={handleSearchChange}
        />
      </div>
      <div className="w-full bg-gray-100">
        {orders.map((order) => (
          <div key={order._id} className="my-3 border border-gray-300 bg-white">
            <div className="flex flex-col items-center w-full gap-3">
              <div className="flex w-full flex-wrap justify-around gap-2 py-3">
                <div className="flex items-center gap-1">
                  <p className="xsLight">Order: </p>
                  <select
                    className={`${
                      changeLoading == order?._id && " animate-pulse"
                    }
                    ${
                      order?.order_status === "Pending"
                        ? "bg-orange-400"
                        : order?.order_status === "Processing"
                        ? "bg-orange-500"
                        : order?.order_status === "Shipped"
                        ? "bg-green-400"
                        : order?.order_status === "Delivered"
                        ? " bg-green-600"
                        : "bg-red-600"
                    } outline-none w-20 text-xs rounded-full appearance-none px-3 text-white text-center`}
                    value={order?.order_status || ""}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    disabled={changeLoading === order._id}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <p className="xsLight">Order ID: </p>
                  <p className="xsLight">{order._id}</p>
                </div>

                <div className="flex items-center">
                  <p className="xsLight">Date: </p>
                  <p className="xsLight">{order?.createdAt?.split("T")[0]}</p>
                </div>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              className="relative text-center w-full bg-blue-50/50 text-xs p-1 text-blue-500 md:text-sm capitalize"
              onClick={() => handleOpen(order._id)}
            >
              view order summary
              {isOpen === order._id ? (
                <RiArrowUpWideLine className="absolute top-2 right-[20%]" />
              ) : (
                <RiArrowDownWideLine className="absolute top-2 right-[20%]" />
              )}
            </button>

            {/* Order Details */}
            <div
              className={`transition-all duration-500 bg-white overflow-hidden ${
                isOpen === order._id
                  ? "opacity-100 max-h-[1000px] p-3"
                  : "opacity-0 max-h-0 p-0"
              }`}
            >
              <div className="text-xs md:text-sm leading-7">
                <div className="flex justify-between border-b border-gray-200">
                  <p>User Name :</p>
                  <p className="text-orange-700">{order?.user?.name}</p>
                </div>
                <div className="flex justify-between border-b border-gray-200">
                  <p>User Email :</p>
                  <p>{order?.user?.email}</p>
                </div>
                <div className="flex justify-between border-b border-gray-200">
                  <p>Order ID:</p>
                  <p>{order?._id}</p>
                </div>
                <div className="flex justify-between border-b border-gray-200">
                  <p>Payment ID:</p>
                  <p>{order?.payment_id || "Cash on Delivery"}</p>
                </div>
                <div className="flex justify-between gap-3 border-b border-gray-200">
                  <p>Address:</p>
                  <div className="text-end">
                    <span>{order?.delivery_address?.country}</span>,
                    <span>{order?.delivery_address?.city}</span>,
                    <span>{order?.delivery_address?.state}</span>,
                    <span>{order?.delivery_address?.PINcode}</span>,
                    <span>{order?.delivery_address?.address_line}</span>,
                    <span>+{order?.delivery_address?.mobile}</span>
                  </div>
                </div>
                <div className="flex justify-between border-b border-gray-200">
                  <p>Total Price:</p>
                  <p className="text-orange-500">
                    {priceFormatter(Number(order?.total_amount))}
                  </p>
                </div>
                <div className="flex justify-center border-b border-gray-200 font-bold">
                  Products
                </div>
                <div>
                  <div className="grid grid-cols-4 border-b border-gray-200">
                    <p>Image</p>
                    <p className="col-span-2">Name</p>
                    <p>Price</p>
                  </div>
                  {order?.product?.map((prod, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-4 border-b border-gray-200"
                    >
                      <img
                        src={prod?.images[0]}
                        alt={prod?.name}
                        className="h-10 w-10 object-contain"
                      />
                      <p className="col-span-2">{prod?.name}</p>
                      <p>{priceFormatter(prod?.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className=" flex items-center justify-center my-7">
          <Pagination
            count={pagination?.totalPage}
            page={page}
            onChange={handlePageChange}
          />
        </div>
      </div>
      {isLoading && (
        <span className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <RiLoader2Line className=" animate-spin text-5xl text-green-500" />
        </span>
      )}
    </div>
  );
};

export default OrdersList;
