import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
  Admin_info: null,
  admin_address: null,
  categories: [],
};

export const Ecommerce_Admin_slice = createSlice({
  name: "Ecommerce_Admin",
  initialState,
  reducers: {
    Admin_info: (state, action) => {
      state.Admin_info = action.payload;
    },
    Admin_login: (state, action) => {
      state.token = action.payload;
    },
    Admin_logout: (state) => {
      state.token = null;
      state.Admin_info = null;
    },
    admin_address: (state, action) => {
      state.admin_address = action.payload;
    },
    categories: (state, action) => {
      state.categories = action.payload;
    },
  },
}); 

export const {
  Admin_login,
  Admin_logout,
  Admin_info,
  admin_address,
  categories,
  token,
} = Ecommerce_Admin_slice.actions;

export default Ecommerce_Admin_slice.reducer;
