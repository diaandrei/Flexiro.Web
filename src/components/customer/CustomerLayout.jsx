import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import CustomFooter from "../footer/CustomFooter";
import routes from "../../routes/routes";
import GlobalNotification from "../../GlobalNotification";
import { Box } from "@mui/material";
import { SearchProvider } from "../../context/SearchContext";

const CustomerLayout = ({ children }) => {
  return (
    <SearchProvider>
      <GlobalNotification />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          margin: "0px",
          padding: "0px",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flex: 1,
            width: "100%",
          }}
        >
          <Routes>
            {routes[0].children.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Box>
        <CustomFooter />
      </Box>
    </SearchProvider>
  );
};

export default CustomerLayout;
