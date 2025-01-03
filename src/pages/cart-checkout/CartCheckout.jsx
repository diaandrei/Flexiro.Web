import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getCartCount } from "../../features/cart/cartCountSlice";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Checkbox,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalOffer as CouponIcon,
} from "@mui/icons-material";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
} from "./cartApi";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const userId = localStorage.getItem("userId");
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await getCart(userId);

      if (response.success) {
        setCart(response.content);
      } else {
        setError(response.description || "Failed to fetch cart items");
      }
    } catch (err) {
      setError("An error occurred while fetching cart");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      dispatch(getCartCount(userId));
    }
  }, [userId, dispatch]);

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await updateCartItem(cartItemId, newQuantity, userId);

      if (response) {
        setCart((prevCart) => {
          // Update items array with new quantity and prices from response
          const updatedItems = prevCart.items.map((item) => {
            if (item.cartItemId === cartItemId) {
              return {
                ...item,
                quantity: newQuantity,
                totalPrice: response.data.totalPrice,
                discountAmount: response.data.discountAmount,
              };
            }
            return item;
          });

          // Get values from the response data
          return {
            ...prevCart,
            items: updatedItems,

            subTotal: response.data.cart.itemsTotal,
            discount: response.data.cart.totalDiscount,
            totalAmount: response.data.cart.totalAmount,
            shippingCost: response.data.cart.shippingCost || 0,
          };
        });

        dispatch(getCartCount(userId));
      } else {
        toast.error(response.description || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("An error occurred while updating quantity");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      if (!cartItemId) {
        toast.error("Plese select at least one product");
      }
      const userId = localStorage.getItem("userId");
      const response = await removeCartItem(cartItemId, userId);
      if (response) {
        setCart((prevCart) => {
          const updatedItems = prevCart.items.filter(
            (item) => item.cartItemId !== cartItemId
          );
          const updatedSubTotal = updatedItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          const updatedCart = {
            ...prevCart,
            items: updatedItems,
            subTotal: updatedSubTotal,
            discount: response.data.cart.totalDiscount,
            totalAmount: response.data.cart.totalAmount,
          };

          // If no items remain in the cart, navigate to the root
          if (updatedItems.length === 0) {
            fetchCart();
          }

          return updatedCart;
        });
        if (userId) {
          dispatch(getCartCount(userId));
        }
      } else {
      }
    } catch (err) {}
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await applyCoupon(cart.cartId, couponCode);
      if (response.success) {
        fetchCart();
        setSnackbar({
          open: true,
          message: "Discount applied successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: response.description || "Invalid discount code",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "An error occurred while applying discount code",
        severity: "error",
      });
    }
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedItems(cart.items.map((item) => item.cartItemId));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(cartItemId)) {
        return prev.filter((id) => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          No items in cart
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your cart is empty. Add items to get started!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 2,

            bgcolor: "#111827",
            color: "#fff",
          }}
          size="large"
          onClick={() => navigate("/")}
        >
          Go back Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ mb: 3, p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              sx={{
                mb: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                }
                label="Select All"
              />
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    selectedItems.forEach(handleRemoveItem);
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Box>

            {cart?.items.map((item) => (
              <Card
                key={item.cartItemId}
                sx={{
                  mb: 2,
                  borderRadius: 4,
                }}
              >
                <CardContent
                  sx={{
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Checkbox
                        checked={selectedItems.includes(item.cartItemId)}
                        onChange={() => handleSelectItem(item.cartItemId)}
                      />
                    </Grid>
                    <Grid item>
                      <Box
                        component="img"
                        src={item.mainImage}
                        alt={item.productName}
                        sx={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          border: "1px  ",
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" gutterBottom>
                        {item.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SKU: {item.sku}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6" color="black">
                        ${item.price}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{ border: "1px solid #F38E58", borderRadius: 2 }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          value={item.quantity}
                          InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            inputProps: {
                              style: {
                                textAlign: "center", // Center-align the text
                              },
                            },
                          }}
                          sx={{ width: 60, mx: 1 }}
                          variant="standard"
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.cartItemId,
                              item.quantity + 1
                            )
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item>
                      <IconButton
                        onClick={() => handleRemoveItem(item.cartItemId)}
                        sx={{ color: "#262C36" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              border: "1px solid #DDE2EB",
              borderRadius: 4,
              mt: 4,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#333", fontWeight: "bold" }}
            >
              Summary
            </Typography>

            <Box my={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                mb={2}
                sx={{
                  "&:hover": {},
                }}
              >
                <Typography sx={{ fontWeight: 500 }}>Subtotal</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  £{cart.subTotal}
                </Typography>
              </Box>

              {cart.discount > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={2}
                  sx={{
                    "&:hover": {},
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Discount</Typography>
                  <Typography color="error" sx={{ fontWeight: 500 }}>
                    -£{cart.discount}
                  </Typography>
                </Box>
              )}

              {cart.shippingCost > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={2}
                  sx={{
                    "&:hover": {},
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>Shipping</Typography>
                  <Typography sx={{ fontWeight: 500 }}>
                    £{cart.shippingCost}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 3, borderColor: "#DDE2EB" }} />
              <Box
                display="flex"
                justifyContent="space-between"
                sx={{
                  "&:hover": {},
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#333" }}
                >
                  £{cart.totalAmount}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate("/order-summary")}
              sx={{
                mt: 2,
                backgroundColor: "#F38E58",
                color: "white",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#D97C49",
                },
              }}
            >
              Checkout
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/")}
              sx={{
                mt: 1,
                color: "#262C36",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#F7F7F7",
                },
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
