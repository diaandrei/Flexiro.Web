import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useToken = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return token;
};

const ProductCard = ({ product, isWishlisted, toggleWishlist }) => {
  const navigate = useNavigate();
  const token = useToken();

  const handleWishlistClick = () => {
    if (token) {
      toggleWishlist(product);
      toast.success("Product added to wishlist.");
    } else {
      toast.error("Please log in to add products to your wishlist.");
      navigate("/login");
    }
  };

  const effectiveWishlisted = token ? isWishlisted : false;

  return (
    <Card
      sx={{
        width: "100%",
        position: "relative",
        textAlign: "center",
        boxShadow: 3,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="180"
          image={product.mainImage}
          alt={product.productName}
        />
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "black",
            color: "white",
            padding: "5px 8px",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          {product.discountPercentage + "% OFF"}
        </Box>
      </Box>
      <CardContent>
        <Typography variant="h6">{product.productName}</Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ textDecoration: "line-through", mr: 1 }}
          >
            £{product.originalPrice}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
            £{product.discountedPrice}
          </Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box>Available: {product.stockQuantity}</Box>
              <Box>Sold: {product.totalSold}</Box>
            </Box>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(product.totalSold / product.stockQuantity) * 100}
            sx={{ height: "8px", borderRadius: "5px", mt: 1 }}
          />
        </Box>
        <Box mt={2}>
          <IconButton onClick={handleWishlistClick}>
            <FavoriteIcon color={effectiveWishlisted ? "error" : "action"} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
