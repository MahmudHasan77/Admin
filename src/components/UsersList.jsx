import{ useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import { useSelector } from "react-redux";
import axios from "axios";
import { server_url } from "./../config/ServerUrl";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";

const UsersInfo = () => {
  const token = useSelector((state) => state?.Ecommerce_Admin?.token);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [isDeleteLoading, setDeleteLoading] = useState(false)
  const [page,setPage]=useState(1)
  const [search, setSearch] = useState('')
  const [pagination,setPagination]=useState({})
console.log(page);
  const fetchingUsers = useCallback(async () => {
    try {
      const response = await axios.get(server_url + `/api/user/users?page=${page}&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response?.data;
      setUsers(data?.users);
      setPagination(data?.pagination);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  }, [page, search, token]);

  useEffect(() => {
    fetchingUsers();
  }, [fetchingUsers]);

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      // Add user id
      setSelectedUser((prev) => [...prev, value]);
    } else {
      // Remove user id
      setSelectedUser((prev) => prev.filter((id) => id !== value));
    }
  };
  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      const response = await axios.post(
        server_url + "/api/user/deleteMultipleUser",
        { usersIds: selectedUser },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response?.data;
      if (data?.success) {
        setSelectedUser([])
        fetchingUsers()
        toast.success(data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    } finally {
            setDeleteLoading(false);

    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <div className={"mr-2"}>
      <h1 className=" font-bold  text-center greenShadow py-5 border border-green-300 mb-2 animationTextColor">
        USERS LIST <span className=" text-xs">({users&&users?.length})</span>
      </h1>
      <div className="min-w-3xl min-h-screen">
        <div className="grid">
          <div className=" border border-green-300 bg-green-50 greenShadow">
            <div className="flex items-center justify-around border-b py-2 border-green-200">
              <Stack spacing={2} sx={{ width: 250, color: "while" }}>
                <TextField label="Search ..." sx={{}} onChange={handleSearch} />
              </Stack>

            </div>
            <div className=" uppercase  font-semibold text-xs grid grid-cols-8 items-center   px-1 py-2 ">
              {isDeleteLoading ? (
                <button className=" py-0.5 text-red-600 animate-pulse">
                  Loading...
                </button>
              ) : (
                <>
                  {selectedUser?.length > 0 ? (
                    <button
                      className="  w-[90%] bg-red-500  text-white rounded-sm cursor-pointer py-0.5"
                      onClick={handleDeleteUser}
                    >
                      Delete
                    </button>
                  ) : (
                    <button className=" py-0.5">Select</button>
                  )}
                </>
              )}
              <p className="  border-r border-green-400 px-1">Image</p>
              <p className=" border-r border-green-400 px-1 ">Name</p>
              <p className=" border-r border-green-400 px-1 col-span-2">
                email
              </p>
              <p className=" border-r border-green-400 px-1">number</p>
              <p className="  px-1">Email Type</p>
              <p className="  px-1">created at</p>
            </div>
          </div>
          {users?.length > 0 &&
            users?.map((user) => {
              return (
                <div
                  key={user?._id}
                  className=" border h-12 border-green-300 bg-white my-3"
                >
                  <div className="  grid grid-cols-8 items-center greenShadow">
                    <h1>
                      <Checkbox
                        checked={selectedUser.includes(user?._id)}
                        value={user?._id}
                        onChange={handleCheckboxChange}
                      />
                    </h1>
                    <div className="flex items-center ">
                      {user?.profile_image ? (
                        <div className=" rounded-full border overflow-hidden border-orange-500">
                          <img
                            className="w-10 h-10 object-cover"
                            src={user?.profile_image}
                            alt="userImage "
                          />
                        </div>
                      ) : (
                        <div className=" border rounded-full h-10 w-10 flex items-center justify-center text-orange-500">
                          {user?.name[0]}
                        </div>
                      )}
                      <div></div>
                    </div>
                    <h1 className=" text-xs break-words">{user?.name}</h1>
                    <h1 className=" text-xs break-words col-span-2">
                      {user?.email}
                    </h1>
                    <h1 className=" text-xs text-center">{user?.mobile}</h1>
                    <button
                      className={`${
                        user?.verify_email
                          ? "  rounded-full  bg-green-500 text-white"
                          : " bg-red-500 text-white rounded-full"
                      } text-xs px-1`}
                    >
                      {user?.verify_email
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </button>
                    <h1 className=" text-xs text-center">
                      {user?.createdAt.split("T")[0]}
                    </h1>
                  </div>
                </div>
              );
            })}
        </div>
        <div className=" flex items-center justify-center my-3">
          <Pagination onChange={(e,v)=>setPage(v)} page={page}  count={pagination?.totalPage} variant="outlined" color="secondary" />
        </div>
      </div>
    </div>
  );
};

export default UsersInfo;
