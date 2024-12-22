import React from "react";
import { CircularProgress } from "@mui/material";

const CustomLoader = ({ circlesize = 24 }) => (
  <div
    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
  >
    <CircularProgress size={circlesize} />
  </div>
);

export default CustomLoader;
