import React from "react";
import { Box, Typography } from "@mui/material";

const ScrollableContainer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "60vh",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "16px",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
      }}
    >
      <Typography variant="h4">Scrollable Content</Typography>
      {Array.from({ length: 50 }, (_, index) => (
        <Typography key={index} variant="body1">
          Item {index + 1}
        </Typography>
      ))}
    </Box>
  );
};

export default ScrollableContainer;
