import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { setUser } from "../../features/user/userSlice";
import logo from "../images/flex.png";
import { logOutUser } from "../../features/user/userSlice";

const drawerWidth = 280;
const buttonBackgroundColor = "#F38E58";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    overflowY: "hidden",
  },
}));

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  const user = useSelector((state) => state.user);
  const handleLogout = () => {
    dispatch(logOutUser());
    navigate("/");
  };
  const menuItems = [
    { text: "Shops", icon: <ShoppingCartIcon />, path: "/Admin/dashboard" },
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
      <Box sx={{ mb: 2, alignItems: "center", margin: 4, ml: 6 }}>
        <img
          onClick={goToHome}
          src={logo}
          alt="Website Logo"
          style={{ width: "100px", height: "auto", cursor: "pointer" }}
        />
      </Box>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", ml: 3, mb: 2 }}>
        <Avatar sx={{ width: 48, height: 48, mr: 2 }}>AA</Avatar>
        <Box>
          <Typography variant="subtitle1">{user.name}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: "80%",
          height: "1px",
          backgroundColor: "#E1E1FB",
          mx: "auto",
          mb: 2,
        }}
      />
      <List>
        {menuItems.map((item) => {
          const isVisitShop = item.text === "Go Home";

          return (
            <ListItem
              button
              key={item.text}
              component={isVisitShop ? "a" : Link}
              to={!isVisitShop ? item.path : undefined}
              href={isVisitShop ? item.path : undefined}
              selected={location.pathname === item.path}
              onClick={() => isMobile && handleDrawerToggle()}
              sx={{
                width: "200px",
                margin: "16px auto",
                backgroundColor: buttonBackgroundColor,
                color: "white",
                borderRadius: "8px",
                padding: "8px 8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: "#d97847",
                },
                "&.Mui-selected": {
                  backgroundColor: "#808080",
                  "&:hover": {
                    backgroundColor: "#d97847",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{ color: "white", minWidth: "auto", marginRight: "12px" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
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
