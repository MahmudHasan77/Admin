import React, { useCallback } from "react";
import Container from "./Container";
import { PiHandsClapping } from "react-icons/pi";
import Button from "@mui/material/Button";
import { IoGiftOutline } from "react-icons/io5";
import { IoStatsChartSharp } from "react-icons/io5";
import { BsBank2 } from "react-icons/bs";
import { IoPieChartSharp } from "react-icons/io5";
import { RiArrowDownDoubleFill, RiArrowUpDoubleFill } from "react-icons/ri";
import { FaProductHunt } from "react-icons/fa";
import { RiArrowDownWideLine } from "react-icons/ri";
import { RiArrowUpWideLine } from "react-icons/ri";
import { useState } from "react";
import Chart from "./Chart";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import toast from "react-hot-toast";
import PriceFormatter from "./../utilities/PriceFormatter";
import { TbLoader } from "react-icons/tb";
import Rating from "@mui/material/Rating";
import { useSelector } from "react-redux";
import { RiLoader3Line } from "react-icons/ri";
const Hone = () => {
  const token = useSelector((state) => state.Ecommerce_Admin.token);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [isOpen, setOpen] = useState("");
  const [orders, setOrders] = useState([]);
  const [changeLoading, setChangeLoading] = useState(null);
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [totalProductCountLoading, setTotalProductCountLoading] =
    useState(false);
  const [totalOrderCount, setTotalOrderCount] = useState(0);
  const [totalOrderCountLoading, setTotalOrderCountLoading] = useState(0);
  const [totalSalesLoading, setTotalSalesLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setTotalSalesLoading(true);
        const response = await axios.get(
          `${server_url}/api/order/getDeliveredSales`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalSales(response?.data?.totalSales || 0);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
      } finally {
        setTotalSalesLoading(false);
      }
    };
    fetchSale();
  }, [token]);

  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        setTotalProductCountLoading(true);
        const response = await axios.get(
          `${server_url}/api/product/get_all_product_count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalProductCount(response?.data?.productsCount || 0);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
      } finally {
        setTotalProductCountLoading(false);
      }
    };
    fetchProductCount();
  }, [token]);

  useEffect(() => {
    const fetchOrderCount = async () => {
      try {
        setTotalOrderCountLoading(true);
        const response = await axios.get(
          `${server_url}/api/order/get_all_order_count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalOrderCount(response?.data?.totalOrdersCount || 0);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch orders");
      } finally {
        setTotalOrderCountLoading(false);
      }
    };
    fetchOrderCount();
  }, [token]);

  const fetchTenOrder = useCallback(async () => {
    try {
      const response = await axios.get(
        `${server_url}/api/order/get_ten_orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(response?.data?.orders || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch orders");
    }
  }, [token]);

  useEffect(() => {
    fetchTenOrder();
  }, [fetchTenOrder]);

  
  const handleStatusChange = async (id, newStatus) => {
    try {
      setChangeLoading(id);
      const response = await axios.post(
        `${server_url}/api/order/change_status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response?.data;
      if (data?.success) {
     fetchTenOrder()
      }

      toast.success("Order status updated");
    } catch (error) {
      console.log(error);
    } finally {
      setChangeLoading(null);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          server_url + `/api/product/get_latest_ten_product`
        );
        const data = response?.data;
        if (data?.success) {
          setProducts(data?.products);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpen = (id) => {
    setOpen((prev) => (prev === id ? "" : id));
  };

  const priceFormatter = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className={"bg-gray-50  mr-2"}>
      <div className="container w-ful bg-white">
        <div className=" w-ful border DashboardHeader border-gray-300 customshadow2  rounded flex items-center justify-around">
          <div className=" font-semibold p-1 child">
            <p className=" font-bold mx-3 text-orange-800">
              Analytics Dashboard
            </p>
            <p className="text-xs relative m-3">
              Welcome back, Lucy! We've missed you.{" "}
              <PiHandsClapping className=" text-orange-500 absolute bottom-0 -right-3 text-lg" />
            </p>

            <Link to={"/addProduct"}>
              <Button className=" text-xs! border! m-2!">Add Product</Button>
            </Link>
          </div>
          <img
            className="w-30 h-auto md:w-40 lg:w-50 object-contain child"
            src="https://res.cloudinary.com/dpf3ipd7p/image/upload/v1751393833/b083-Short-welcome-message-for-customers-small_btfb6v.webp"
          />
        </div>
      </div>
      {/* overview card  */}
      <div className="my-2 md:my-3 flex flex-wrap justify-center lg:justify-between">
        <div className="border border-orange-300 bg-orange-50/50 hover:bg-orange-50 max-w-50 max-h-23 min-w-50 min-h-23 p-3 m-3 rounded-sm customshadow1">
          <div className=" flex items-center    justify-around ">
            <IoGiftOutline className=" text-2xl text-orange-500" />
            <div className=" flex flex-col justify-center items-center">
              <p className=" font-semibold text-sm">Total Orders </p>
              <p className=" font-extrabold">
                {totalOrderCountLoading ? (
                  <RiLoader3Line className=" animate-spin text-green-500" />
                ) : (
                  totalOrderCount
                )}
              </p>
            </div>
            <IoStatsChartSharp className=" text-4xl text-orange-500" />
          </div>
          <div className=" flex items-center justify-around border-t mt-1 pt-1 border-orange-200">
            <RiArrowUpDoubleFill className=" text-green-500" />{" "}
            <span className=" text-orange-500 text-xs">+33% </span>
            <p className=" text-xs text-gray-500">increased last mont </p>
          </div>
        </div>

        <div className="border border-green-300 bg-green-50/50 hover:bg-green-50 max-w-50 max-h-23 min-w-50 min-h-23 p-3 m-3 rounded-sm customshadow1">
          <div className=" flex items-center    justify-around ">
            <IoPieChartSharp className=" text-[27px] text-green-500" />
            <div className=" flex items-center justify-center flex-col">
              <p className=" font-semibold text-sm">Total Sales </p>
              <p className=" font-extrabold">
                {totalSalesLoading ? (
                  <RiLoader3Line className=" animate-spin text-green-500" />
                ) : (
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalSales)}{" "}
                  </p>
                )}
              </p>
            </div>
            <IoStatsChartSharp className=" text-4xl text-green-500" />
          </div>
          <div className=" flex items-center justify-around border-t mt-1 pt-1 border-green-200">
            <RiArrowDownDoubleFill className=" text-red-500" />{" "}
            <span className=" text-red-500 text-xs">-33% </span>
            <p className=" text-xs text-gray-500">Decreased last mont </p>
          </div>
        </div>

        <div className="border border-blue-300 bg-blue-50/50 hover:bg-blue-50 max-w-50 max-h-23 min-w-50 min-h-23 p-3 m-3 rounded-sm customshadow1">
          <div className=" flex items-center    justify-around ">
            <BsBank2 className=" text-2xl text-blue-500" />
            <div className=" ">
              <p className=" font-semibold text-sm">Revenue </p>
              <p className=" font-extrabold">5,70</p>
            </div>
            <IoStatsChartSharp className=" text-4xl text-blue-500" />
          </div>
          <div className=" flex items-center justify-around border-t mt-1 pt-1 border-blue-200">
            <RiArrowUpDoubleFill className=" text-green-500" />{" "}
            <span className=" text-orange-500 text-xs">+33% </span>
            <p className=" text-xs text-gray-500">increased last mont </p>
          </div>
        </div>

        <div className="border border-orange-300 bg-orange-50/50 hover:bg-orange-50 max-w-50 max-h-23 min-w-50 min-h-23 p-3 m-3 rounded-sm customshadow1">
          <div className=" flex items-center    justify-around ">
            <FaProductHunt className=" text-2xl text-orange-500" />
            <div className=" ">
              <p className=" font-semibold text-sm">Total Products </p>
              <p className=" font-extrabold">
                {totalProductCountLoading ? (
                  <RiLoader3Line className=" animate-spin text-green-500" />
                ) : (
                  totalProductCount
                )}
              </p>{" "}
            </div>
            <IoStatsChartSharp className=" text-4xl text-orange-500" />
          </div>
          <div className=" flex items-center justify-around border-t mt-1 pt-1 border-orange-200">
            <RiArrowUpDoubleFill className=" text-green-500" />{" "}
            <span className=" text-orange-500 text-xs">+33% </span>
            <p className=" text-xs text-gray-500">increased last mont </p>
          </div>
        </div>
      </div>
      {/* overview card  */}

      {/* chart */}
      <Chart />
      {/* chart */}

      {/* product list */}
      <div className=" border bg-green-50 border-green-300">
        <h1 className=" font-bold text-center my-5">Latest 10 Product</h1>{" "}
        <div className=" grid grid-cols-4 font-semibold text-sm border py-3 border-gray-300 bg-white">
          <h1 className="  text-center">Image </h1>
          <h1 className="  text-center"> Name </h1>
          <h1 className="  text-center">Price </h1>
          <h1 className="  text-center">Rating </h1>
        </div>
        {isLoading ? (
          <div className=" flex justify-center m-10">
            <TbLoader className=" text-2xl animate-spin" />
          </div>
        ) : (
          <>
            {products?.map((product) => {
              return (
                <div
                  key={product._id}
                  className=" grid grid-cols-4 h-15 my-2 rounded-sm hover:bg-green-50 font-semibold text-sm border py-3 border-green-200 bg-white"
                >
                  <div className="max-w-12 max-h-12 rounded-sm overflow-hidden">
                    <img
                      className=" w-full object-contain"
                      src={product?.images[0]}
                    />
                  </div>{" "}
                  <h1 className="  text-center text-xs mt-0.5">
                    {product?.name?.length>30?product?.name.slice(0,30)+'...':product?.name}
                  </h1>
                  <h1 className="  text-center text-orange-500">
                    <PriceFormatter
                      price={product?.price}
                      className={"text-xs "}
                    />
                  </h1>
                  <h1 className="  text-center">
                    <Rating
                      name="size-small"
                      sx={{ fontSize: 12 }}
                      value={product?.rating}
                      size="small"
                      readOnly
                    />
                  </h1>
                </div>
              );
            })}
          </>
        )}
        <Link to={"/productslist"}>
          <Button
            sx={{ display: "flex", width: "100%", height: "7px !" }}
            className="capitalize! text-xs! bg-blue-50!"
          >
            <p>View Details & All Products</p> <RiArrowDownWideLine />
          </Button>
        </Link>
      </div>
      {/* product list */}

      {/* recent orders  */}
      <div className="w-full bg-gray-100 border my-5 border-green-300">
        <h1 className=" font-bold mt-5 text-center">Recent 10 Orders</h1>
        {orders?.length > 0 &&
          orders?.map((order) => (
            <div
              key={order._id}
              className="my-3 border border-gray-300 bg-white py-2"
            >
              <div className="flex flex-col items-center w-full gap-3">
                <div className="flex w-full flex-wrap justify-around gap-2 py-2">
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

        <Link to={"/OrdersList"}>
          <Button
            sx={{ display: "flex", width: "100%", height: "7px !" }}
            className="capitalize! text-xs! bg-blue-50!"
          >
            <p>View All Orders</p> <RiArrowDownWideLine />
          </Button>
        </Link>
      </div>
      {/* recent orders  */}
    </div>
  );
};

export default Hone;
