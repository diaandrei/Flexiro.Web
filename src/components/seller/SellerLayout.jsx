import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "../../routes/routes";
import { Box, CssBaseline } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GlobalNotification from "../../GlobalNotification";
import { SearchProvider } from "../../context/searchContext";

const SellerLayout = ({ children }) => {
  return (
    <SearchProvider>
      <GlobalNotification />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Sidebar />
        <Box
          sx={{
            width: "100%",
            height: "100%",
            flexDirection: "column",
            zIndex: 1,
          }}
        >
          <Header />
          <Routes>
            {routes[2].children.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Box>
      </Box>
    </SearchProvider>
  );
};

export default SellerLayout;
