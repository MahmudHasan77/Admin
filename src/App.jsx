import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Dashboard from "./components/pages/Dashboard";
import Home from "./components/Home";
import ProductsList from "./components/ProductsList";
import SignUp from "./components/SignUp";
import Signin from "./components/Signin";
import AddProduct from "./components/AddProduct";
import HomeSliderList from "./components/HomeSliderList";
import UploadHomeSlider from "./components/UploadHomeSlider";
import CategoryList from "./components/CategoryList";
import AddCategory from "./components/AddCategory";
import AddType from "./components/AddType";
import UsersList from "./components/UsersList";
import OrdersList from "./components/OrdersList";
import PasswordOTP from "./components/Verify_email_OTP";
import EditProfile from './components/EditProfile'

import { persistor, store } from "./redux/Admin_store";
import { Toaster } from 'react-hot-toast';
import Forgot_password_OTP from "./components/Forgot_password_OTP";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import Add_address from "./components/Add_address";
import EditProduct from "./components/EditProduct";
import ViewSingleProduct from "./components/ViewSingleProduct";
import AddRAM from "./components/AddRAM";
import AddBlogs from "./components/AddBlogs";
import BlogList from "./components/BlogList";
import Edit_blog from "./components/Edit_blog";
import UploadSecondSlider from "./components/UploadSecondSlider";
import SecondSliderList from "./components/SecondSliderList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      { index: true, element: <Home /> },
      { path: "productslist", element: <ProductsList /> },
      { path: "addProduct", element: <AddProduct /> },
      { path: "homeSliderList", element: <HomeSliderList /> },
      { path: "SecondSliderList", element: <SecondSliderList /> },
      { path: "uploadHomeSlider", element: <UploadHomeSlider /> },
      { path: "UploadSecondSlider", element: <UploadSecondSlider /> },
      { path: "CategoryList", element: <CategoryList /> },
      { path: "AddCategory", element: <AddCategory /> },
      { path: "AddType", element: <AddType /> },
      { path: "AddRam", element: <AddRAM /> },
      { path: "users", element: <UsersList /> },
      { path: "OrdersList", element: <OrdersList /> },
      { path: "profile", element: <Profile /> },
      { path: "EditProfile", element: <EditProfile /> },
      { path: "Add_address", element: <Add_address /> },
      { path: "Edit_blog", element: <Edit_blog /> },
      { path: "blogsList", element: <BlogList /> },
      { path: "addBlogs", element: <AddBlogs /> },
      { path: "viewSingleProduct/:id", element: <ViewSingleProduct /> },
      { path: "productslist/editProduct", element: <EditProduct /> },
    ],
  },
  { path: "/signup", element: <SignUp /> },
  { path: "/signin", element: <Signin /> },
  { path: "/forgot_password_OTP", element: <Forgot_password_OTP /> },
  { path: "/passwordOtp", element: <PasswordOTP /> },
  { path: "/ResetPassword", element: <ResetPassword /> },
]);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            removeDelay: 1000,
            style: {
              background: "#363636",
              color: "#fff",
            },

            // Default options for specific types
            success: {
              duration: 3000,
              iconTheme: {
                primary: "green",
                secondary: "black",
              },
            },
          }}
        />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
};

export default App;
