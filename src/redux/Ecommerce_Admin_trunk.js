// ecommerceThunks.js

import { Admin_login, Admin_logout, categories } from "./Ecommerce_Admin_slice";
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { server_url } from "../config/ServerUrl";

export const login = (token) => (dispatch) => {
  localStorage.setItem("token", token);
  dispatch(Admin_login(token));
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch(Admin_logout());
};

export const category_store = () => async (dispatch, getState) => {
  try {
    const token = getState()?.Ecommerce_Admin?.token;

    const response = await axios.get(
      server_url + "/api/category/get_categories",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response?.data?.success) {
      dispatch(categories(response?.data?.categories))
    } else {
      toast.error(response?.data.message)
}
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Failed to load categories");
  }
};
