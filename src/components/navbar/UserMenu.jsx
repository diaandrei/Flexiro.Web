import React from "react";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getCartCount } from "../../features/cart/cartCountSlice";
import { clearCartitems } from "../../features/cart/cartApi";

const UserMenu = ({ anchorEl, open, handleClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
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
    try {
      if (userId) {
        try {
          await clearCartitems();
          dispatch(getCartCount(userId));
        } catch (err) {}
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    // Remove all user-related items from local storage.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    toast.success("Logged out successfully");
    navigate("/");
    handleClose();
  };

  const handleRegisterClick = () => {
    navigate("/signup");
    handleClose();
  };

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
