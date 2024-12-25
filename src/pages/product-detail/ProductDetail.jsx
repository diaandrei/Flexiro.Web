"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../../features/product-detail/ProductDetailsApi";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Button,
  Rating,
  Avatar,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    dispatch(fetchProductDetails({ productId, userId }));
  }, [dispatch, productId, userId]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
    } else {
      debugger;
      const itemInCart = cartItems.find((item) => item.productId === productId);
      if (itemInCart) {
        const actionResult = await dispatch(
          updateItemQuantity({ cartItemId: itemInCart.cartItemId, quantity })
        );
      } else {
        const actionResult = await dispatch(addItem({ ...product, quantity }));
        if (addItem.fulfilled.match(actionResult)) {
        } else {
        }
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {product.averageRating.toFixed(1)}
              </Typography>
              <Rating
                value={product.averageRating}
                readOnly
                precision={0.1}
                size={isMobile ? "small" : "medium"}
              />
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
              >
                Available {product.totalStock}
              </Typography>
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
                    $
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
                    ${product.pricePerItem.toFixed(2)}
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
                  ${product.pricePerItem.toFixed(2)}
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
                onClick={() => handleAddToCart()}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: { xs: 4, sm: 6, md: 8 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 8 },
            mb: { xs: 4, sm: 6 },
          }}
        >
          <Box
            sx={{
              bgcolor: "#1F2937",
              borderRadius: "16px",
              p: { xs: 3, sm: 4 },
              color: "white",
              width: { md: "300px" },
              textAlign: "center",
              maxHeight: { xs: "none", md: "180px" },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "48px", sm: "64px" },
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {product.averageRating.toFixed(1)}
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "18px", sm: "24px" },
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 400,
                }}
              >
                /5
              </Typography>
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                "& .MuiRating-root": {
                  color: "#FF7A00",
                },
              }}
            >
              <Rating value={5} readOnly size={isMobile ? "medium" : "large"} />
            </Box>
            <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.7)" }}>
              {product.totalReviews} Reviews
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ position: "relative", mb: 4, display: "inline-block" }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{ fontWeight: 600 }}
              >
                Reviews ({product.totalReviews})
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: "-4px",
                  left: 0,
                  width: "40%",
                  height: "2px",
                  bgcolor: "#FF7A00",
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {product.reviews.map((review) => (
                <Box key={review.reviewId} sx={{ display: "flex", gap: 3 }}>
                  <Avatar
                    sx={{
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                      bgcolor: "#F3F4F6",
                      color: "#374151",
                    }}
                  >
                    {review.userName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        {review.userName}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#6B7280",
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        }}
                      >
                        {review.rating.toFixed(1)}
                      </Typography>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{
                          "& .MuiRating-root": {
                            color: "#FF7A00",
                          },
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        color: "#6B7280",
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {review.comment}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
