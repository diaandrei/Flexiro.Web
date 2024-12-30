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

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogoClick = () => navigate("/");
  const handleRegisterClick = () => navigate("/registerseller");

  const handleCartClick = async () => {
    navigate("/checkout");
  };

  const handleSwitchDashboard = () => {
    debugger;
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
            placeholder="Search Shops..."
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
          <IconButton onClick={handleCartClick} color="grey">
            <CartIcon />
          </IconButton>
          {userRole === "Admin" || userRole === "Seller" ? (
            <Button
              onClick={handleSwitchDashboard}
              variant="contained"
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                padding: { xs: "8px 16px", sm: "10px 20px" },
                fontSize: { xs: "12px", sm: "14px" },
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#45A049" },
              }}
            >
              Switch to Dashboard
            </Button>
          ) : (
            <Button
              onClick={handleRegisterClick}
              variant="contained"
              sx={{
                backgroundColor: "#F38E58",
                color: "white",
                fontWeight: "bold",
                padding: { xs: "8px 16px", sm: "10px 20px" },
                fontSize: { xs: "12px", sm: "14px" },
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": { backgroundColor: "white", color: "#F38E58" },
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
        ></Drawer>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
