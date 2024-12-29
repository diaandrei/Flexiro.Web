import React from "react";
import { Navigate } from "react-router-dom";
import Shops from "../pages/shops";
import toast from 'react-hot-toast';
import SignUp from "../pages/users/sign-up/SignUpForm";
import ShopDetail from "../pages/shop-detail/ShopDetail";
import ProductDetail from "../pages/product-detail/ProductDetail";
import Login from "../pages/users/sign-in/SignInForm";
import AdminLayout from "../components/admin/AdminLayout";
import CustomerLayout from "../components/customer/CustomerLayout";
import AdminSignIn from "../components/admin/AdminSignIn";
import WishlistPage from '../pages/user-wishlist/WishlistPage';
import useAuth from "../useAuth";

const CustomerPrivateRoute = ({ children }) => {
  const isAuthenticated = useAuth(); // Check if the user is authenticated
  const role = localStorage.getItem("role"); // Get the user's role from localStorage

  // If the user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
const PrivateRoute = ({ children, roleRequired }) => {
  const isAuthenticated = useAuth(); 
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  if (role !== roleRequired) {
    return <Navigate to="/" replace />; 
  }

    return children; 
    
};
const SellerPrivateRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  const role = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  if (role !== "Seller") {
    return <Navigate to="/" replace />; 
  }

  return children;
};
const routes = [
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Shops />, title: "Shops" },
      { path: "/login", element: <Login />, title: "Login" },
      { path: "/signup", element: <SignUp />, title: "Sign Up" },
      {
        path: "/registerseller",
        title: "Register Seller",
      },
      { path: "/shop/:id", element: <ShopDetail />, title: "Shop Detail" },
      {
        path: "/product/:productId",
        element: <ProductDetail />,
        title: "Product Detail",
      },
      {
        path: "/checkout",
        element: (
          <CustomerPrivateRoute>
          </CustomerPrivateRoute>
        ),
        title: "Cart Checkout",
      },
      {
        path: "/payment",
        element: (
          <CustomerPrivateRoute>
          </CustomerPrivateRoute>
        ),
        title: "Payment",
      },
      {
        path: "/confirmation",
        element: (
          <CustomerPrivateRoute>
          </CustomerPrivateRoute>
        ),
        title: "Confirmation",
      },
      {
        path: "/shipping/details",
        element: (
          <CustomerPrivateRoute>
            {" "}
          </CustomerPrivateRoute>
        ),
        title: "Shipping Details",
      },
      {
        path: "/orders",
        element: (
          <CustomerPrivateRoute>
            {" "}
            <ProductDetail />
          </CustomerPrivateRoute>
        ),
        title: "Order History",
      },
      {
        path: "/order-summary",
        element: (
          <CustomerPrivateRoute>
            {" "}
          </CustomerPrivateRoute>
        ),
        title: "Customer Section",
      },
      {
        path: "/customerorders",
        element: (
          <CustomerPrivateRoute>
            {" "}
          </CustomerPrivateRoute>
        ),
        title: "Order History",
      },
      ,
      {
        path: "/wishlistproducts",
        element: (
          <CustomerPrivateRoute>
            {" "}
            <WishlistPage />
          </CustomerPrivateRoute>
        ),
        title: "Wishlist Prodcuts",
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute roleRequired="Admin">
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/Admin/dashboard" replace /> },
    ],
  },
  {
    path: "/seller",
    element: (
      <SellerPrivateRoute roleRequired="Seller">
      </SellerPrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <SellerPrivateRoute>
          </SellerPrivateRoute>
        ),
        title: "Seller Dashboard",
      },
      {
        path: "products",
        element: (
          <SellerPrivateRoute>
          </SellerPrivateRoute>
        ),
        title: "Seller Product Page",
      },
      {
        path: "settings",
        element: (
          <SellerPrivateRoute>
          </SellerPrivateRoute>
        ),
        title: "Seller Product Page",
      },
      {
        path: "addproduct",
        element: (
          <SellerPrivateRoute>
          </SellerPrivateRoute>
        ),
        title: "Add New Product",
      },
      {
        path: "orders",
        element: (
          <SellerPrivateRoute>
          </SellerPrivateRoute>
        ),
        title: "Shop Orders",
      },
      ,
      {
        path: "wishlistproducts",
        element: (
          <SellerPrivateRoute>
          </SellerPrivateRoute>
        ),
        title: "Wishlist Products",
      },
    ],
  },

  {
    path: "*",
    title: "Not Found",
  },
];

export default routes;
