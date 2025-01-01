import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import searchErrorImage from "../../components/images/SearchError.png";

function NotFound() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Box
        component="img"
        src={searchErrorImage}
        alt="Not Found"
        sx={{ maxWidth: "100%", height: "auto", mb: 2 }}
      />

      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Oops, Sorry!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        We couldn't find what you're looking for. Please try again or browse
        other options.
      </Typography>
      <Button
        onClick={handleGoHome}
        variant="contained"
        sx={{
          marginTop: "30px",
          bgcolor: "#111827",
          color: "#fff",
        }}
      >
        Got back Home
      </Button>
    </Box>
  );
}

export default NotFound;
