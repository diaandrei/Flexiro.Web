import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/user/userSlice";
import toast from "react-hot-toast";
import NotificationIcon from "../notification-icon/NotificationIcon";
import { logOutUser } from "../../features/user/userSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  border: "1px solid black",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "90ch",
    },
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      // Parse the saved user data and dispatch the setUser action
      const userData = JSON.parse(savedUser);
      dispatch(setUser(userData));
    }
  }, [dispatch]);

  const user = useSelector((state) => state.user);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/seller/settings");
  };
  const handleLogout = () => {
    // Dispatch action to reset user data
    dispatch(logOutUser());
    toast.success("You have successfully logged out.");
    // Redirect to the sign-in page
    navigate("/");
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ backgroundColor: "white" }}
    >
      <Toolbar sx={{ alignSelf: "flex-end" }}>
        <NotificationIcon />
        <Avatar sx={{ mr: 1, ml: 4 }}>AA</Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 0 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user.email}
          </Typography>
        </Box>
        <ArrowDropDownIcon onClick={handleMenu} sx={{ cursor: "pointer" }} />
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Log Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
