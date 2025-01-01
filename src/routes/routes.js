import React from "react";
import { Navigate } from "react-router-dom";
import Shops from "../pages/shops";
import toast from 'react-hot-toast';
import SignUp from "../pages/users/sign-up/SignUpForm";
import ShopDetail from "../pages/shop-detail/ShopDetail";
import ProductDetail from "../pages/product-detail/ProductDetail";
import Login from "../pages/users/sign-in/SignInForm";
import CartCheckout from "../pages/cart-checkout/CartCheckout";
import Payment from "../pages/payment/Payment";
import Confirmation from "../pages/payment/Confirmation";
import Dashboard from "../pages/admin/Dashboard";
import SellerDashboard from "../pages/seller/SellerDashboard";
import ShippingDetails from "../pages/shipping-details/ShippingDetails";
import NotFound from "../pages/not-found/NotFoundPage";
import AdminLayout from "../components/admin/AdminLayout";
import CustomerLayout from "../components/customer/CustomerLayout";
import RequireAuth from "../components/auth/RequireAuth";
import AdminSignIn from "../components/admin/AdminSignIn";
import SellerSignIn from "../components/seller/SellerSignIn";
import SellerLayout from "../components/seller/SellerLayout";
import SellerProductPage from "../pages/seller/SellerProducts";
import SellerSettings from "../pages/seller/settings";
import RegisterSeller from "../pages/seller/RegisterSellerForm";
import OrderSummary from "../pages/order/OrderSummary";
import SellerAddProduct from "../pages/seller/SellerAddProduct";
import SellerOrders from "../pages/seller/ShopOrder";
import SellerWishlist from '../pages/seller/sellerWishlist';
import CustomerOrders from '../pages/order/customerOrder';
import WishlistPage from '../pages/user-wishlist/WishlistPage';
import useAuth from "../useAuth";

const CustomerPrivateRoute = ({ children }) => {
  const isAuthenticated = useAuth(); 
  const role = localStorage.getItem("role");

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
        element: <RegisterSeller />,
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
            {" "}
            <CartCheckout />
          </CustomerPrivateRoute>
        ),
        title: "Cart Checkout",
      },
      {
        path: "/payment",
        element: (
          <CustomerPrivateRoute>
            {" "}
            <Payment />{" "}
          </CustomerPrivateRoute>
        ),
        title: "Payment",
      },
      {
        path: "/confirmation",
        element: (
          <CustomerPrivateRoute>
            {" "}
            <Confirmation />{" "}
          </CustomerPrivateRoute>
        ),
        title: "Confirmation",
      },
      {
        path: "/shipping/details",
        element: (
          <CustomerPrivateRoute>
            {" "}
            <ShippingDetails />
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
            <OrderSummary />
          </CustomerPrivateRoute>
        ),
        title: "Customer Section",
      },
      {
        path: "/customerorders",
        element: (
          <CustomerPrivateRoute>
            {" "}
            <CustomerOrders />
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
      { path: "dashboard", element: <Dashboard />, title: "Admin Dashboard" },
    ],
  },
  {
    path: "/seller",
    element: (
      <SellerPrivateRoute roleRequired="Seller">
        <SellerLayout />
      </SellerPrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <SellerPrivateRoute>
            <SellerDashboard />
          </SellerPrivateRoute>
        ),
        title: "Seller Dashboard",
      },
      {
        path: "products",
        element: (
          <SellerPrivateRoute>
            {" "}
            <SellerProductPage />
          </SellerPrivateRoute>
        ),
        title: "Seller Product Page",
      },
      {
        path: "settings",
        element: (
          <SellerPrivateRoute>
            {" "}
            <SellerSettings />
          </SellerPrivateRoute>
        ),
        title: "Seller Product Page",
      },
      {
        path: "addproduct",
        element: (
          <SellerPrivateRoute>
            <SellerAddProduct />
          </SellerPrivateRoute>
        ),
        title: "Add New Product",
      },
      {
        path: "orders",
        element: (
          <SellerPrivateRoute>
            <SellerOrders />
          </SellerPrivateRoute>
        ),
        title: "Shop Orders",
      },
      ,
      {
        path: "wishlistproducts",
        element: (
          <SellerPrivateRoute>
            <SellerWishlist />
          </SellerPrivateRoute>
        ),
        title: "Wishlist Products",
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
    title: "Not Found",
  },
];

export default routes;
