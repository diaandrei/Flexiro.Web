import React from "react";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserMenu = ({ anchorEl, open, handleClose }) => {
  const navigate = useNavigate();

  // Check if the user is logged in based on token existence
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Handle Login
  const handleLoginClick = () => {
    navigate("/login"); // Navigate to login page
    handleClose(); // Close the menu
  };

  const handleOrders = () => {
    navigate("/customerorders"); // Navigate to login page
    handleClose(); // Close the menu
  };

  const handleWishlist = () => {
    navigate("/wishlistproducts"); // Navigate to login page
    handleClose(); // Close the menu
  };

  // Handle Logout
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    toast.success("You have successfully logged out.");
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
              Sign Up
            </Typography>
          </MenuItem>
        )}

        {isLoggedIn ? (
          // Show Logout option if the user is logged in
          <MenuItem
            onClick={handleLogoutClick}
            sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              Log Out
            </Typography>
          </MenuItem>
        ) : (
          // Show Login option if the user is not logged in
          <MenuItem
            onClick={handleLoginClick}
            sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              Log In
            </Typography>
          </MenuItem>
        )}

        <MenuItem
          onClick={handleOrders}
          sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
        >
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            My Orders
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleWishlist}
          sx={{ justifyContent: "flex-start", padding: "10px 16px" }}
        >
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            Wishlist
          </Typography>
        </MenuItem>
      </Box>
    </Menu>
  );
};

export default UserMenu;
