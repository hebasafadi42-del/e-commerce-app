import React from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./assets/Pages/HomePage/HomePage";
import ProductCatalogPage from "./assets/Pages/AllCategoriesPage/ProductCatalogPage";
import LogIn from "./assets/Auth/LogIn";
import Verify from "./assets/Auth/Verify";
import Register from "./assets/Auth/Register";
import PrdcDetails from "./assets/Pages/PrdctDetails/PrdcDetails";
import Profile from "./assets/Auth/Profile";
import TermsAndCondition from "./assets/Pages/SettingPage/TermsAndCondition";
import ContactUs from "./assets/Pages/SettingPage/ContactUs";
import PrivacyPolicy from "./assets/Pages/SettingPage/PrivacyPolicy";
import ProductCart from "./assets/components/ProductCart/ProductCart";
import Orders from "./assets/Pages/Orders/Orders";
import CheckOut from "./assets/Pages/Checkout/CheckOut";
import ResourcePage from "./assets/Pages/Admin/ResourcePage";
import AdminLogin from "./assets/Pages/Admin/AdminLogin";
import AdminLayout from "./assets/Pages/Admin/AdminLayout";
import AdminGuard from "./assets/Pages/Admin/AdminGuard";
import { RESOURCES } from "./assets/AdminConfig/adminConfig";
import RequireAuth from "./assets/Auth/RequireAuth";
import NotFound from "./assets/Pages/NotFound/NotFound";
import AdminDashboard from "./assets/Pages/Admin/AdminDashboard";
import ProductFormPage from "./assets/Pages/Admin/ProductFormPage";
import AddProduct from "./assets/Pages/AddProduct/AddProduct";
import Favourites from "./assets/Pages/Favourites/Favourites";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route
          path="/product-categories"
          element={<ProductCatalogPage />}
        ></Route>
        <Route path="/log-in" element={<LogIn />}></Route>
        <Route path="/verify" element={<Verify />}></Route>
        <Route path="/log-up" element={<Register />}></Route>
        <Route path="/product/:id" element={<PrdcDetails />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route
          path="/terms-and-conditions"
          element={<TermsAndCondition />}
        ></Route>
        <Route path="/contact-us" element={<ContactUs />}></Route>
        <Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
        <Route path="/cart" element={<ProductCart />}></Route>
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<CheckOut />} />
         <Route path="/add-product" element={<AddProduct/>} />
         <Route path="/favourites" element={<Favourites/>} />


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />

          {Object.entries(RESOURCES).map(([key, cfg]) => (
            <Route
              key={key}
              path={cfg.route}
              element={<ResourcePage key={key} resource={key} />}
            />
          ))}
        </Route>
        <Route path="/admin/resources" element={<Navigate to="/admin" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;