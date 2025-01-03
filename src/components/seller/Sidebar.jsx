import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ProductIcon from "@mui/icons-material/Store";
import OrderIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/user/userSlice";
import logo from "../images/flex.png";
import { useNavigate } from "react-router-dom";

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  width: "200px",
  margin: "16px auto",
  backgroundColor: selected ? "#F38E58" : "transparent",
  color: selected ? "#000" : "#808080",
  borderRadius: "8px",
  padding: "8px 8px",
  "&:hover": {
    backgroundColor: "#F38E58",
  },
}));

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      dispatch(setUser(userData));
    }
  }, [dispatch]);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/seller/dashboard" },
    { text: "Products", icon: <ProductIcon />, path: "/seller/products" },
    { text: "Orders", icon: <OrderIcon />, path: "/seller/orders" },
    {
      text: "Wishlist",
      icon: <FavoriteIcon />,
      path: "/seller/wishlistproducts",
    },
    { text: "Go Home", icon: <HomeIcon />, path: "/" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const goToHome = () => {
    navigate("/");
  };
  const drawerContent = (
    <>
      <Box>
        <Box sx={{ mb: 2, alignItems: "center", margin: 4, ml: 6 }}>
          <img
            onClick={goToHome}
            src={logo}
            alt="Seller Logo"
            style={{ width: "100px", height: "auto", cursor: "pointer" }}
          />
        </Box>
        <Box sx={{ p: 2, display: "flex", alignItems: "center", ml: 3, mb: 2 }}>
          <Avatar sx={{ width: 48, height: 48, mr: 2 }}>
            {user.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">{user.name}</Typography>
            <Typography variant="caption" color="orange">
              Verified Seller
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ width: "80%", mx: "auto", mb: 2 }} />
        <List>
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <StyledListItem
                key={item.text}
                component={Link}
                to={item.path}
                selected={isSelected}
                onClick={() => isMobile && handleDrawerToggle()}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? "white" : "#808080",
                    minWidth: "auto",
                    marginRight: "12px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: isSelected ? "white" : "#808080",
                    minWidth: "auto",
                    marginRight: "12px",
                  }}
                  primary={item.text}
                />
              </StyledListItem>
            );
          })}
        </List>
      </Box>
      <Box>
        <List>
          <StyledListItem
            component={Link}
            to="/seller/settings"
            onClick={() => isMobile && handleDrawerToggle()}
            sx={{
              justifyContent: "center",
              color: "#000",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <ListItemIcon
              sx={{ color: "#000", minWidth: "auto", marginRight: "12px" }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" sx={{ color: "#000" }} />
          </StyledListItem>
        </List>
      </Box>
    </>
  );

  return (
    <>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <StyledDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ alignSelf: "flex-end", margin: 1 }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {drawerContent}
      </StyledDrawer>
    </>
  );
};

export default Sidebar;
