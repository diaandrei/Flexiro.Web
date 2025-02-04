import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "../../routes/routes";
import { Box, CssBaseline } from "@mui/material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { SearchProvider } from "../../context/searchContext";

const AdminLayout = ({ children }) => {
  return (
    <SearchProvider>
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
            {routes[1].children.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Box>
      </Box>
    </SearchProvider>
  );
};

export default AdminLayout;
