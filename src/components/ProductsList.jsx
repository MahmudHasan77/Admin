import React from "react";
import Rating from "@mui/material/Rating";
import IconButton from "@mui/material/IconButton";
import { FaRegEyeSlash } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineSearchOff } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { server_url } from "../config/ServerUrl";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PriceFormatter from "../utilities/PriceFormatter";
import { useSelector } from "react-redux";
import { BiLoaderCircle } from "react-icons/bi";
import Button from "@mui/material/Button";
import { BiLoader } from "react-icons/bi";
import { RiLoader3Fill } from "react-icons/ri";

const ProductsList = () => {
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);

  const categories = useSelector((state) => state?.Ecommerce_Admin?.categories);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(null);
  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, totalCount);
  const [searchCategory, setSearchCategory] = useState(null);
  const [searchType, setSearchType] = useState(null);
  const [selectedSearchCategory, setSelectedSearchCategory] = useState(null);
  const [checkboxList, setCheckboxList] = useState([]);
  const [multipleDeleteLoading, setMultipleDeleteLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (searchCategory) {
        if (!searchType) {
          try {
            const response = await axios.get(
              server_url +
                `/api/product/get_product_by_category_id/${searchCategory}?page=${page}`
            );
            const data = response?.data;
            if (data?.success) {
              setProducts(data?.total_product);
              setTotalCount(data?.total_product_count);
              setTotalPages(data?.page_info?.total_pages);
            } else {
              toast.error(data?.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
          } finally {
            setLoading(false);
          }
        } else {
          try {
            const response = await axios.get(
              server_url +
                `/api/product/get_product_by_type_id/${searchType}?page=${page}`
            );
            const data = response?.data;
            if (data?.success) {
              setProducts(data?.total_product);
              setTotalCount(data?.total_product_count);
              setTotalPages(data?.page_info?.total_pages);
            } else {
              toast.error(data?.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
          } finally {
            setLoading(false);
          }
        }
      } else {
        try {
          setLoading(true);
          const response = await axios.get(
            server_url + `/api/product/get_all_product?page=${page}`
          );
          const data = response?.data;
          if (data?.success) {
            setProducts(data?.total_product);
            setTotalCount(data?.total_product_count);
            setTotalPages(data?.page_info?.total_pages);
          } else {
            toast.error(data?.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [page, searchCategory, searchType]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDeleteProduct = async (id) => {
    try {
      setDeleteLoading(id);
      const response = await axios.delete(
        server_url + `/api/product/delete_product/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response?.data;
      if (data?.success) {
        toast.success(data?.message);
        const newProducts = products.filter((prod) => prod._id !== id);
        setProducts(newProducts);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setDeleteLoading(null);
    }
  };
  const handleEditClick = (product) => {
    navigate("editProduct", { state: { product } });
  };

  const handleSearchByCategory = async (id) => {
    setSearchCategory(id);
    const selected_category = categories.find((cat) => cat?._id == id);
    setSelectedSearchCategory(selected_category);
  };

  const handleSearchByType = async (id) => {
    setSearchType(id);
  };

  const handleCheckBox = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      setCheckboxList((prev) => [...prev, value]);
    } else {
      setCheckboxList((prev) => prev.filter((item) => item !== value));
    }
  };

const handleCheckListDelete = async () => {
  try {
    setMultipleDeleteLoading(true);

    const response = await axios.delete(
      server_url + "/api/product/delete_multiple_product",
      {
        data: { ids: checkboxList },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = response?.data;

    if (data?.success) {
      setProducts((prevProducts) =>
        prevProducts.filter((prod) => !checkboxList.includes(prod._id))
      );
setCheckboxList([])
      toast.success("Products deleted successfully");
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || "Delete failed");
  } finally {
    setMultipleDeleteLoading(false);
  }
};


  return (
    <>
      <h1 className="font-bold animationTextColor p-4 text-center">PRODUCTS LIST </h1>

      <div
        className={`${isLoading && " opacity-30"} min-w-3xl min-h-screen p-1`}
      >
        <div className=" border border-gray-300 flex items-center justify-between bg-green-100">
          <Stack spacing={2} sx={{ width: 200 }}>
            <Autocomplete
              id="category-autocomplete"
              options={categories || []}
              getOptionLabel={(option) => option?.name || ""}
              onChange={(event, newValue) => {
                handleSearchByCategory(newValue?._id);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Search by category..." />
              )}
            />
          </Stack>
          {selectedSearchCategory?.children?.length && (
            <Stack spacing={2} sx={{ width: 200 }}>
              <Autocomplete
                id="type-autocomplete"
                options={selectedSearchCategory?.children || []}
                getOptionLabel={(option) => option?.name || ""}
                onChange={(event, newValue) => {
                  handleSearchByType(newValue?._id);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Search by category..." />
                )}
              />
            </Stack>
          )}
          <Button className=" border! px-2 py-1 bg-blue-500 text-white font-semibold text-sm cursor-pointer">
            EXPORT
          </Button>
          <Link to={"/addProduct"}>
            <Button className=" border! px-2 py-1 bg-blue-500 text-white font-semibold text-sm cursor-pointer">
              ADD PRODUCT
            </Button>
          </Link>
        </div>
        <div className="">
          <div className=" uppercase h-13 font-semibold text-xs grid grid-cols-11 items-center  bg-green-100 greenShadow px-1 py-2 border border-green-300">
            <div className=" h-full flex items-center justify-center col-span-2 border-r border-green-400 px-1">
              Product
            </div>
            <div className=" h-full flex items-center justify-center border-r border-green-400 px-1 col-span-">
              category
            </div>
            <div className=" h-full flex items-center justify-center border-r border-green-400 px-1 col-span-">
              type
            </div>
            <div className=" h-full flex items-center justify-center border-r border-green-400 px-1">
              brand
            </div>
            <div className=" h-full flex items-center justify-center border-r border-green-400 px-1">
              price
            </div>
            <div className=" h-full flex items-center justify-center border-r border-green-400 px-1">
              sales
            </div>
            <div className=" h-full flex items-center justify-center border-r border-green-400 px-1 col-span-2">
              rating
            </div>
            <div className="  h-full flex items-center justify-center border-r border-green-400 px-1">
              action
            </div>
            <div className=" h-full flex items-center justify-center border-r border-green-400 px-1">
              {multipleDeleteLoading ? (
                <div className=" flex items-center gap-1">
                  <RiLoader3Fill className="animate-spin text-red-500" />
                  <p className=" text-[7px] text-red-500">Deleting...</p>
                </div>
              ) : (
                <>
                  {checkboxList.length > 0 ? (
                    <Button
                      onClick={handleCheckListDelete}
                      className=" text-[13px]! text-red-500! mt-0.5!"
                    >
                      delete
                    </Button>
                  ) : (
                    <Button className=" text-[13px]! mt-0.5! text-black!">
                      list
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {products?.length ? (
            <>
              {products?.map((product) => {
                return (
                  <div key={product?._id}>
                    <div className="xsLight capitalize grid grid-cols-11 items-center px-1 my-2 border border-green-200 greenShadow bg-green-50 hover:bg-green-50">
                      <div className="justify-center col-span-2 flex items-center border-r border-green-200">
                        <Link>
                          <div className=" h-10 w-10 border mx-1 overflow-hidden border-gray-300 rounded-sm">
                            <LazyLoadImage
                              src={product?.images[0]}
                              alt={"product image"}
                              effect="blur"
                              placeholderSrc="data:image/jpeg;base64,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"
                            />
                          </div>
                        </Link>
                        <div className="flex-1">
                          <p className=" text-orange-500">{product?.name}</p>
                        </div>
                      </div>
                      <div className="justify-center border-r p-1 flex items-center h-full  border-green-200">
                        {product?.category_name}
                      </div>
                      <div className="justify-center border-r p-1 flex items-center h-full  border-green-200">
                        {product?.type_name}
                      </div>
                      <div className="justify-center border-r p-1 flex items-center h-full  border-green-200">
                        {product?.brand}
                      </div>
                      <div className="justify-center border-r p-1 flex flex-col items-center h-full  border-green-200">
                        <p className=" line-through text-gray-500">
                          {<PriceFormatter price={product?.old_price} />}
                        </p>
                        <p className=" text-orange-500">
                          {" "}
                          {<PriceFormatter price={product?.price} />}
                        </p>
                      </div>
                      <div className="justify-center border-r p-1 flex items-center h-full  border-green-200">
                        {"50"}
                      </div>
                      <div className="justify-center border-r p-1 flex items-center h-full  border-green-200 col-span-2">
                        <Rating
                          name="size-small"
                          readOnly
                          value={product?.rating}
                          size="small"
                        />
                      </div>

                      <div className="flex items-center justify-around text-lg border-r p-1 border-green-200">
                        <Tooltip title="view Product">
                          <Link to={`/viewSingleProduct/${product?._id}`}>
                            <FaRegEyeSlash className="rounded-full cursor-pointer hover:border drop-shadow-blue-300 border-blue-300 text-blue-500 bg-blue-100" />
                          </Link>{" "}
                        </Tooltip>{" "}
                        <Tooltip title="Edit Product">
                          <CiEdit
                            onClick={() => handleEditClick(product)}
                            className="  rounded-full cursor-pointer text-green-600 hover:border border-green-300 duration-300 bg-green-100"
                          />
                        </Tooltip>{" "}
                        <Tooltip title="Delete Product">
                          {isDeleteLoading == product?._id ? (
                            <BiLoaderCircle className=" text-lg animate-spin text-red-500 bg-gray-200 rounded-full cursor-pointer" />
                          ) : (
                            <AiTwotoneDelete
                              onClick={() => handleDeleteProduct(product?._id)}
                              className=" text-lg text-red-500 bg-gray-200 rounded-full cursor-pointer"
                            />
                          )}
                        </Tooltip>
                      </div>
                      <div>
                        <IconButton>
                          <Checkbox
                            size="small"
                            value={product?._id}
                            onChange={handleCheckBox}
                          />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {!isLoading && (
                <div className="">
                  <div className=" flex items-center justify-center m-5">
                    <MdOutlineSearchOff className=" text-5xl text-red-500" />
                  </div>{" "}
                  <div className=" flex items-center justify-center m-5">
                    <p className=" font-semibold text-red-500">
                      Product not found
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className=" m-5 flex justify-center items-center">
          <p className="text-gray-700 text-xs">
            Showing products <span className=" text-orange-500">{start} </span>
            to<span className=" text-orange-500"> {end}</span> of
            <span className=" text-orange-500"> {totalCount}</span>
          </p>
          <Stack spacing={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              color="primary"
            />
          </Stack>
        </div>{" "}
      </div>
      {/* Products List  */}
      {isLoading && (
        <div className=" m-auto inset-[50%] absolute">
          <BiLoader className=" text-5xl animate-spin" />
        </div>
      )}
    </>
  );
};

export default ProductsList;
