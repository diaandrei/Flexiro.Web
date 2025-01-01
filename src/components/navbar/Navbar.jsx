import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Avatar,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CartIcon from "../cart-icon/CartIcon";
import logoImage from "./flexiro.svg";
import UserMenu from "./UserMenu";
import { useSearch } from "../../context/searchContext";
import { useUser } from "../../context/userContext";
import NotificationIcon from "../notification-icon/NotificationIcon";

function Navbar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const userId = localStorage.getItem("userId");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { userRole } = useUser() || {};
  const navigate = useNavigate();
  const theme = useTheme();
  const [cartMenuOpen, setCartMenuOpen] = useState(null);
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogoClick = () => navigate("/");
  const handleRegisterClick = () => navigate("/registerseller");

  const handleCartClick = async () => {
    navigate("/checkout");
  };

  const handleSwitchDashboard = () => {
    if (userRole === "Admin") {
      navigate("/Admin/dashboard");
    } else if (userRole === "Seller") {
      navigate("/Seller/dashboard");
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "white", color: "black", boxShadow: 1 }}
    >
      <Toolbar
        sx={{
          height: { xs: "auto", md: "100px" },
          py: { xs: 1, md: 0 },
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: { xs: 2, md: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <img
            src={logoImage}
            alt="Logo"
            style={{ height: "60px", cursor: "pointer" }}
            onClick={handleLogoClick}
          />
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              edge="end"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{ position: "relative", display: "flex", alignItems: "center" }}
        >
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: { xs: "100%", sm: "200px", md: "250px" },
              "& .MuiOutlinedInput-root": { borderRadius: "20px", pr: "40px" },
            }}
          />
          <IconButton
            sx={{ position: "absolute", right: "8px", color: "action.active" }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
            justifyContent: "flex-end",
          }}
        >
          {!isMobile && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 4, my: 2 }}
            ></Box>
          )}
          <IconButton onClick={handleCartClick} color="grey">
            <CartIcon />
          </IconButton>
          {isLoggedIn && userRole === "Customer" && <NotificationIcon />}

          {userRole === "Admin" || userRole === "Seller" ? (
            <Button
              onClick={handleSwitchDashboard}
              variant="outlined"
              sx={{
                color: "#505050",
                borderColor: "#808080",
                fontWeight: "bold",
                padding: "6px 18px",
                fontSize: "14px",
                borderRadius: "25px",
                textTransform: "none",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#808080",
                  color: "white",
                  borderColor: "#808080",
                },
              }}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              onClick={handleRegisterClick}
              variant="outlined"
              sx={{
                color: "#505050",
                borderColor: "#808080",
                fontWeight: "bold",
                padding: "6px 18px",
                fontSize: { xs: "12px", sm: "14px" },
                borderRadius: "25px",
                textTransform: "none",
                backgroundColor: "#808080",
                "&:hover": {
                  backgroundColor: "#808080",
                  color: "white",
                  borderColor: "#808080",
                },
              }}
            >
              Register Seller
            </Button>
          )}

          <IconButton onClick={handleClick} size="small" color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircle />
            </Avatar>
          </IconButton>

          <UserMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            handleClose={handleClose}
          />
        </Box>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List sx={{ width: 250 }}>
            {!userRole && (
              <ListItem button onClick={handleRegisterClick}>
                <ListItemText primary="Register Seller" />
              </ListItem>
            )}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
