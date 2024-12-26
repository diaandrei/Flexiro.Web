import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, Paper, Rating } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { addItem, removeItem } from "../../features/cart/cartSlice";
import {
  addToWishlistAsync,
  removeFromWishlistAsync,
} from "../../features/wishlist/wishlistSlice";

export default function ProductCard({
  id,
  image,
  name,
  description,
  price,
  rating,
  reviews,
  sold,
  shopId,
  isInWishlist,
  onClick,
  viewType,
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [cartButtonText, setCartButtonText] = useState("View Product");
  const [wishlistStatus, setWishlistStatus] = useState(isInWishlist);

  useEffect(() => {
    const itemInCart = cartItems.find((item) => item.id === id);
    setCartButtonText(itemInCart ? "View Product" : "View Product");
  }, [cartItems, id]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const product = {
      id,
      image,
      name,
      description,
      price,
      rating,
      reviews,
      sold,
      onClick,
    };
    if (cartButtonText === "View Product") {
      dispatch(addItem(product));
    } else {
      dispatch(removeItem(id));
    }
  };

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    const product = {
      id,
      image,
      name,
      description,
      price,
      rating,
      reviews,
      sold,
    };
    if (wishlistStatus) {
      dispatch(removeFromWishlistAsync({ productId: id, shopId }));
      setWishlistStatus(false);
    } else {
      dispatch(addToWishlistAsync({ productId: id, shopId }));
      setWishlistStatus(true);
    }
  };

  return (
    <Paper
      elevation={3}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: viewType === "grid" ? "column" : "row",
        },
        width: "100%",
        height: "100%",
        padding: 2,
        borderRadius: 2,
        backgroundColor: "#fff",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          flex: viewType === "grid" ? "1" : { xs: "0 0 100%", sm: "0 0 200px" },
          marginRight: { xs: "auto", sm: viewType === "grid" ? "auto" : 2 },
          marginLeft: { xs: "auto", sm: viewType === "grid" ? "auto" : 2 },
          marginBottom: { xs: 2, sm: 0 },
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            height: viewType === "grid" ? "200px" : "100%",
            objectFit: "cover",
            objectPosition: "center",
            maxWidth: "100%",
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
            <Rating value={rating} readOnly precision={0.5} size="small" />
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              ({reviews} reviews) | Sold {sold}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: { xs: 2, sm: 3, md: 4 },
              WebkitBoxOrient: "vertical",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#262C36" }}
          >
            ${price.toFixed(2)}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              color={wishlistStatus ? "error" : "default"}
              onClick={handleAddToWishlist}
              sx={{
                minWidth: "auto",
                padding: "6px",
                borderRadius: "50%",
                border: "none",
              }}
            >
              <FavoriteIcon
                sx={{
                  fontSize: "20px",
                  color: wishlistStatus ? "error.main" : "action.active",
                }}
              />
            </Button>
            <Button
              variant="contained"
              onClick={onClick}
              sx={{
                color: "white",
                backgroundColor: "black",
                textTransform: "none",
                padding: "6px 12px",
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                },
              }}
            >
              {cartButtonText}
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
