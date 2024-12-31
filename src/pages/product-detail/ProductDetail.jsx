"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../../features/productDetail/ProductDetailsApi";
import { addOrUpdateReview, getUserRating } from "./productApi";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addItem, updateItemQuantity } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { product, status, error } = useSelector(
    (state) => state.productDetail
  );
  const cartItems = useSelector((state) => state.cart.items);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchProductDetails({ productId, userId }));

    if (userId) {
      const fetchUserRating = async () => {
        try {
          const result = await getUserRating(productId, userId);
          if (result?.success && result?.content?.rating) {
            setUserRating(result.content.rating);
          }
        } catch (error) {}
      };
      fetchUserRating();
    }
  }, [dispatch, productId, userId]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleRatingSubmit = async (newValue) => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await addOrUpdateReview({
        productId,
        userId,
        rating: newValue,
      });
      dispatch(fetchProductDetails({ productId, userId }));
      setUserRating(newValue);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      navigate("/login");
    } else {
      const itemInCart = cartItems.find((item) => item.productId === productId);
      if (itemInCart) {
        await dispatch(
          updateItemQuantity({ cartItemId: itemInCart.cartItemId, quantity })
        );
      } else {
        await dispatch(addItem({ ...product, quantity }));
      }
    }
  };

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed" || !product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <Typography color="error">
          {error || "Failed to load product"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        px: { xs: 2, sm: 4 },
        py: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: { xs: 2, sm: 4 },
          color: "text.secondary",
          fontSize: { xs: "0.8rem", sm: "1rem" },
        }}
      >
        <Typography>Product</Typography>
        <Typography>{">"}</Typography>
        <Typography color="text.primary">{product.productName}</Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 4, md: 6 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={product.imageUrls[currentImageIndex]}
              alt={product.productName}
              sx={{
                width: "100%",
                maxWidth: "100%",
                height: { xs: "300px", sm: "400px", md: "400px" },
                borderRadius: "16px",
                aspectRatio: "1",
                objectFit: "contain",
              }}
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                position: "relative",
              }}
            >
              <Button
                onClick={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
                disabled={currentImageIndex === 0}
                sx={{
                  minWidth: "auto",
                  p: 1,
                  color: "text.primary",
                  "&:disabled": { color: "text.disabled" },
                }}
              >
                <ChevronLeft />
              </Button>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflow: "hidden",
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                {product.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: { xs: 60, sm: 80 },
                      height: { xs: 60, sm: 80 },
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        index === currentImageIndex
                          ? "2px solid"
                          : "2px solid transparent",
                      borderColor: "primary.main",
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`Product view ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>

              <Button
                onClick={() =>
                  setCurrentImageIndex((i) =>
                    Math.min(product.imageUrls.length - 1, i + 1)
                  )
                }
                disabled={currentImageIndex === product.imageUrls.length - 1}
                sx={{
                  minWidth: "auto",
                  p: 1,
                  color: "text.primary",
                  "&:disabled": { color: "text.disabled" },
                }}
              >
                <ChevronRight />
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {product.averageRating.toFixed(1)}
                </Typography>
                <Rating
                  value={product.averageRating}
                  readOnly
                  precision={0.1}
                  size={isMobile ? "small" : "medium"}
                />
                <Typography color="text.secondary">
                  ({product.totalReviews} Reviews)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography>
                  {userRating > 0 ? "Your rating:" : "Rate this product:"}
                </Typography>
                <Rating
                  value={userRating}
                  onChange={(event, newValue) => {
                    if (!isSubmitting) {
                      handleRatingSubmit(newValue);
                    }
                  }}
                  disabled={isSubmitting}
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            </Box>

            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: 600 }}
            >
              {product.productName}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
              {product.discountPercentage > 0 ? (
                <>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{ fontWeight: 600, color: "#262C36" }}
                  >
                    £
                    {(
                      product.pricePerItem *
                      (1 - product.discountPercentage / 100)
                    ).toFixed(2)}
                  </Typography>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{
                      fontWeight: 600,
                      textDecoration: "line-through",
                      color: "text.secondary",
                    }}
                  >
                    £{product.pricePerItem.toFixed(2)}
                  </Typography>
                  <Typography
                    color="error"
                    sx={{
                      fontSize: { xs: "0.8rem", sm: "1rem" },
                      fontWeight: 500,
                    }}
                  >
                    {product.discountPercentage}% Off
                  </Typography>
                </>
              ) : (
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  sx={{ fontWeight: 600 }}
                >
                  £{product.pricePerItem.toFixed(2)}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 300 }}>
                Description
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              >
                {product.description}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Typography>Quantity</Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                  sx={{
                    minWidth: { xs: 32 },
                    height: { xs: 32 },
                    color: "black",
                    backgroundColor: "#D0D0D2",
                  }}
                >
                  -
                </Button>
                <Typography
                  sx={{ minWidth: { xs: 32, sm: 40 }, textAlign: "center" }}
                >
                  {quantity}
                </Typography>
                <Button
                  onClick={() => handleQuantityChange(1)}
                  sx={{
                    minWidth: { xs: 32 },
                    height: { xs: 32 },
                    color: "#f38e58",
                    backgroundColor: "#262C36",
                  }}
                >
                  +
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Button
                variant="contained"
                sx={{
                  px: 7,
                  py: 1,
                  minWidth: "fit-content",
                  backgroundColor: "#262C36",
                  color: "white",
                  fontSize: "14px",
                  textTransform: "none",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#3a4149",
                  },
                }}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
