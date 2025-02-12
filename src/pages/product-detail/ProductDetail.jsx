"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../../features/product-detail/productDetailsApi";
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
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { addItem, updateItemQuantity } from "../../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import ReviewModal from "./ReviewModel";

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
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
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
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= product.totalStock) {
      setQuantity(newQuantity);
    }
  };

  const getStockStatusColor = (stock) => {
    if (stock === 0) return "#FF4D4F";
    if (stock <= 5) return "#FF7A00";
    if (stock <= 10) return "#FFAB00";
    return "#00C853";
  };

  const getStockStatusText = (stock) => {
    if (stock === 0) return "Out of stock";
    if (stock <= 5) return `Only ${stock} left in stock - order soon`;
    if (stock <= 10) return `Limited stock - ${stock} items left`;
    return `In stock (${stock} available)`;
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
    setIsAddingToCart(true);
    try {
      const itemInCart = cartItems.find((item) => item.productId === productId);
      if (itemInCart) {
        await dispatch(
          updateItemQuantity({ cartItemId: itemInCart.cartItemId, quantity })
        );
      } else {
        await dispatch(addItem({ ...product, quantity }));
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
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
        <Typography color="grey">{"No Product Details Available"}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 6 },
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mb: { xs: 2, sm: 3 },
          color: "#94969F",
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          "& > .separator": { mx: 0.5 },
        }}
      >
        <Typography sx={{ cursor: "pointer", "&:hover": { color: "#262C36" } }}>
          Shop
        </Typography>
        <span className="separator">/</span>
        <Typography sx={{ cursor: "pointer", "&:hover": { color: "#262C36" } }}>
          Products
        </Typography>
        <span className="separator">/</span>
        <Typography color="#262C36">{product.productName}</Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 4, md: 6 }}>
        {" "}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: "relative",
              backgroundColor: "#F8F9FA",
              borderRadius: "16px",
              p: 2,
            }}
          >
            <Box
              component="img"
              src={product.imageUrls[currentImageIndex]}
              alt={product.productName}
              sx={{
                width: "100%",
                height: { xs: "250px", sm: "300px", md: "400px" },
                objectFit: "contain",
                transition: "all 0.3s ease",
              }}
            />
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
                disabled={currentImageIndex === 0}
                sx={{
                  minWidth: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
                  p: 0,
                }}
              >
                <ChevronLeft size={16} />
              </Button>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflow: "hidden",
                }}
              >
                {product.imageUrls.map((url, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    sx={{
                      width: { xs: 48, sm: 60 },
                      height: { xs: 48, sm: 60 },
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        index === currentImageIndex
                          ? "2px solid #262C36"
                          : "2px solid transparent",
                      transition: "all 0.2s ease",
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
                  minWidth: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
                  p: 0,
                }}
              >
                <ChevronRight size={16} />
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
              height: "100%",
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                fontWeight: 700,
                color: "#262C36",
                mb: 0.5,
              }}
            >
              {product.productName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#262C36" }}
                >
                  {product.averageRating.toFixed(1)}
                </Typography>
              </Box>
              <Button
                startIcon={
                  <Star
                    size={16}
                    fill={userRating > 0 ? "#FF7A00" : "none"}
                    color={userRating > 0 ? "#FF7A00" : "#262C36"}
                  />
                }
                onClick={() => setIsReviewModalOpen(true)}
                sx={{
                  color: "#262C36",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  p: 0.5,
                }}
              >
                {userRating > 0 ? "Update rating" : "Rate this product"}
              </Button>
              <Typography variant="body2" color="#94969F">
                ({product.totalReviews} reviews)
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: 1.5,
                py: 1.5,
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              {product.discountPercentage > 0 ? (
                <>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{ fontWeight: 700, color: "#262C36" }}
                  >
                    £
                    {(
                      product.pricePerItem *
                      (1 - product.discountPercentage / 100)
                    ).toFixed(2)}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      textDecoration: "line-through",
                      color: "#94969F",
                    }}
                  >
                    £{product.pricePerItem.toFixed(2)}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.5,

                      bgcolor: "#FFE9E5",
                      borderRadius: "4px",
                      color: "#FF4D4F",
                      fontSize: "0.875rem",
                    }}
                  >
                    {product.discountPercentage}% Off
                  </Box>
                </>
              ) : (
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{ fontWeight: 700, color: "#262C36" }}
                >
                  £{product.pricePerItem.toFixed(2)}
                </Typography>
              )}
            </Box>
            <Box sx={{}}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#262C36",
                  mb: 1,
                }}
              >
                Description
              </Typography>
              <Typography
                sx={{
                  color: "#4B5563",
                  lineHeight: 1.5,
                  fontSize: "0.875rem",
                }}
              >
                {product.description}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                py: 2,
                borderTop: "1px solid #E5E7EB",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: 0.6,
                  backgroundColor: "#F8F9FA",
                  borderRadius: "8px",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: getStockStatusColor(product.totalStock),
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: getStockStatusColor(product.totalStock),
                  }}
                >
                  {getStockStatusText(product.totalStock)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#262C36",
                    fontSize: "0.875rem",
                  }}
                >
                  Quantity
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      overflow: "hidden",
                      bgcolor: product.totalStock === 0 ? "#F8F9FA" : "white",
                    }}
                  >
                    <Button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity === 1 || product.totalStock === 0}
                      sx={{
                        minWidth: "40px",
                        height: "40px",
                        borderRadius: 0,
                        color: "#262C36",
                        "&.Mui-disabled": {
                          color: "#94969F",
                        },
                      }}
                    >
                      -
                    </Button>
                    <Typography
                      sx={{
                        minWidth: "48px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: product.totalStock === 0 ? "#94969F" : "#262C36",
                      }}
                    >
                      {quantity}
                    </Typography>
                    <Button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.totalStock}
                      sx={{
                        minWidth: "40px",
                        height: "40px",
                        borderRadius: 0,
                        color: "#262C36",
                        "&.Mui-disabled": {
                          color: "#94969F",
                        },
                      }}
                    >
                      +
                    </Button>
                  </Box>
                </Box>
              </Box>
              {product.totalStock > 0 && product.totalStock <= 10 && (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    color: "#FF7A00",
                    fontStyle: "italic",
                  }}
                >
                  Order now
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              sx={{
                py: 1.5,
                backgroundColor: "#262C36",
                color: "white",
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                mt: "10px",
              }}
            >
              {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <ReviewModal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        productId={productId}
        userId={userId}
        currentRating={userRating}
        onSubmit={handleRatingSubmit}
      />
    </Box>
  );
}
