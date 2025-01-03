import React from "react";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, userSelector } from "react-redux";
import { getCartCount } from "../../features/cart/cartCountSlice";

const UserMenu = ({ anchorEl, open, handleClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleLoginClick = () => {
    navigate("/login");
    handleClose();
  };
  const handleOrders = () => {
    navigate("/customerorders");
    handleClose();
  };
  const handleWishlist = () => {
    navigate("/wishlistproducts");
    handleClose();
  };

  const handleLogoutClick = async () => {
    debugger;
    try {
      if (userId) {
        const response = await axios.post(
          `${API_ENDPOINT}/Customer/clearCart?userId=${userId}`
        );

        if (response.data.success) {
          dispatch(getCartCount(userId));
        } else {
        }
      }
    } catch (error) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    toast.success("Logout Success");
    navigate("/");

    handleClose();
  };
  const handleRegisterClick = () => navigate("/signup");

  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <Box sx={{ width: "300px" }}>
        {!isLoggedIn && (
          <MenuItem
            onClick={handleClose}
            sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
          >
            <Typography
              onClick={handleRegisterClick}
              variant="body1"
              sx={{ flexGrow: 1 }}
            >
              Create Account
            </Typography>
          </MenuItem>
        )}

        {isLoggedIn ? (
          <MenuItem
            onClick={handleLogoutClick}
            sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              Log Out
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={handleLoginClick}
            sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              Log In
            </Typography>
          </MenuItem>
        )}
        {isLoggedIn && (
          <MenuItem
            onClick={handleOrders}
            sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              My Orders
            </Typography>
          </MenuItem>
        )}
        {isLoggedIn && (
          <MenuItem
            onClick={handleWishlist}
            sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              Wishlist
            </Typography>
          </MenuItem>
        )}
      </Box>
    </Menu>
  );
};

export default UserMenu;
