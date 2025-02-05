"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DropIn from "braintree-web-drop-in-react";
import toast from "react-hot-toast";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  Select,
  MenuItem,
  DialogTitle,
  DialogActions,
  Snackbar,
  Dialog,
  DialogContent,
  Alert,
  useTheme,
  useMediaQuery,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getCartCount } from "../../features/cart/cartCountSlice";
import { getCartSummary } from "./summaryApi";
import { placeOrder, fetchAddress } from "./summaryApi";
import confetti from "canvas-confetti";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import BraintreePayment from "../../components/BraintreePayment";

export default function OrderSummary() {
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const userId = localStorage.getItem("userId");
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  const [loading, setLoading] = React.useState(true);
  const [cartSummary, setCartSummary] = React.useState(null);
  const [paymentStatus, setPaymentStatus] = useState({
    open: false,
    success: false,
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    note: "",
    addToAddressBook: false,
    paymentMethod: "cod",
  });

  const [addressBook, setAddressBook] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [errors, setErrors] = useState({});

  const [orderConfirmation, setOrderConfirmation] = useState({
    open: false,
    orderId: null,
  });
  const [braintreeInstance, setBraintreeInstance] = useState(null);
  const [clientToken, setClientToken] = useState(null);

  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchCartSummary();
    fetchAddressBook();
    fetchClientToken();
  }, []);

  const fetchClientToken = async () => {
    try {
      const response = await axios.post(
        `${API_ENDPOINT}/payment/generate-client-token`
      );
      setClientToken(response.data.clientToken);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to initialize payment",
        severity: "error",
      });
    }
  };

  const fetchCartSummary = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await getCartSummary(userId);
      if (response.success) {
        setCartSummary(response.content);
        setFormData((prev) => ({
          ...prev,
          totalAmount: response.content.total,
        }));
      } else {
        setSnackbar({
          open: true,
          message: response.description || "Failed to fetch cart summary",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "An error occurred while fetching cart summary",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddressBook = async () => {
    try {
      const response = await fetchAddress();
      if (response) {
        setAddressBook(response.content || []);
      } else {
        setSnackbar({
          open: true,
          message: response.description || "Failed to fetch address book",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "An error occurred while fetching address book",
        severity: "error",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postcode) newErrors.postcode = "Postcode is required";
    if (!formData.country) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if Braintree payment method is selected
    if (formData.paymentMethod === "card") {
      // Validate Braintree payment
      if (!braintreeInstance) {
        toast.error("Payment method not initialized");
        return;
      }

      try {
        const { nonce } = await braintreeInstance.requestPaymentMethod();

        // Process payment
        const paymentResponse = await axios.post(
          `${API_ENDPOINT}/payment/process-payment`,
          {
            orderId: localStorage.getItem("userId"),
            paymentMethodNonce: nonce,
          }
        );

        if (!paymentResponse.data.success) {
          throw new Error(paymentResponse.data.message);
        }
      } catch (err) {
        return;
      }
    }

    // Proceed with order placement
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const orderData = {
        userId,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          postcode: formData.postcode,
          country: formData.country,
          note: formData.note,
          addToAddressBook: formData.addToAddressBook,
        },
        paymentMethod: formData.paymentMethod,
      };

      const response = await placeOrder(orderData);
      if (response.success) {
        dispatch(getCartCount(userId));
        setOrderConfirmation({ open: true, orderId: response.OrderNumber });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        setPaymentStatus({ open: true, success: false });
      }
    } catch (err) {
      setPaymentStatus({ open: true, success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address) => {
    const selected = addressBook.find((item) => item.address === address);
    setSelectedAddress(selected);
    if (selected) {
      setFormData({
        ...formData,
        firstName: selected.firstName,
        lastName: selected.lastName,
        email: selected.email,
        phoneNumber: selected.phoneNumber,
        address: selected.address,
        city: selected.city,
        postcode: selected.postcode,
        country: selected.country,
        note: selected.note,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "addToAddressBook" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
  const handleCloseConfirmation = () => {
    setOrderConfirmation({ open: false, orderId: null });
    navigate("/");
  };
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Shipping Details
              </Typography>
              <Select
                size="small"
                displayEmpty
                value={selectedAddress ? selectedAddress.address : ""}
                onChange={(e) => handleAddressSelect(e.target.value)}
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  Choose from address book
                </MenuItem>
                {addressBook.map((address, index) => (
                  <MenuItem key={index} value={address.address}>
                    {address.address}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Grid container spacing={3}>
              {[
                { name: "firstName", label: "First Name" },
                { name: "lastName", label: "Last Name" },
                { name: "email", label: "Email" },
                { name: "phoneNumber", label: "Phone Number" },
                { name: "address", label: "Address" },
                { name: "city", label: "City" },
                { name: "postcode", label: "Postcode" },
                { name: "country", label: "Country" },
              ].map(({ name, label }) => (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={label}
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  placeholder="Note"
                  name="note"
                  multiline
                  rows={4}
                  value={formData.note}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      backgroundColor: "#fff",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.addToAddressBook}
                      onChange={handleInputChange}
                      name="addToAddressBook"
                      sx={{
                        color: "#D1D5DB",
                        "&.Mui-checked": {
                          color: "#000",
                        },
                      }}
                    />
                  }
                  label="Add to address book"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                bgcolor: "#fff",
                borderRadius: "16px",
                boxShadow:
                  "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
                p: 3,
                border: "1px solid #262C36",
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Your Order Summary
              </Typography>
              {cartSummary?.items?.map((item) => (
                <Box
                  key={item.cartItemId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ color: "#6B7280" }}>
                      {item.quantity}x
                    </Typography>
                    <Typography>{item.productName}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 500 }}>
                    £{item.pricePerUnit * item.quantity}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ mt: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: "#6B7280" }}>Subtotal</Typography>
                  <Typography>£{cartSummary?.subtotal}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: "#6B7280" }}>Shipping</Typography>
                  <Typography>£{cartSummary?.shippingCost || 0}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography sx={{ color: "#6B7280" }}>Tax</Typography>
                  <Typography>£{cartSummary?.tax}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography sx={{ color: "#6B7280" }}>Discount</Typography>
                  <Typography>£{cartSummary?.totalDiscount}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                  py: 2,
                  borderTop: "1px solid #E5E7EB",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>Order Total</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  £{cartSummary?.total}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Payment Method
                </Typography>
                <RadioGroup
                  aria-label="payment-method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="cod"
                    control={<Radio />}
                    label="Cash on Delivery (COD)"
                  />
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Card Payment"
                  />
                </RadioGroup>
              </Box>
              {formData.paymentMethod === "card" && (
                <Box sx={{ mb: 4 }}>
                  <BraintreePayment
                    onInstance={(instance) => setBraintreeInstance(instance)}
                    onError={(error) =>
                      setSnackbar({
                        open: true,
                        message: error,
                        severity: "error",
                      })
                    }
                  />
                </Box>
              )}
              <Typography
                sx={{
                  color: "#6B7280",
                  fontSize: "0.875rem",
                  mb: 3,
                }}
              >
                By placing this order, you agree to our terms and conditions.
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  bgcolor: "#111827",
                  color: "#fff",
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "#000",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "PLACE ORDER"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={paymentStatus.open}
        onClose={() => setPaymentStatus({ ...paymentStatus, open: false })}
      >
        <DialogTitle>
          {paymentStatus.success ? "Payment Successful" : "Payment Failed"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {paymentStatus.success
              ? "Payment processed successfully."
              : "There was an error processing your payment. Please try again."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPaymentStatus({ ...paymentStatus, open: false })}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={orderConfirmation.open}
        onClose={handleCloseConfirmation}
        fullScreen={fullScreen}
        PaperProps={{
          style: {
            borderRadius: fullScreen ? 0 : "16px",
            padding: theme.spacing(4),
            maxWidth: "500px",
          },
        }}
      >
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for your purchase.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pt: 2 }}>
          <Button
            onClick={handleCloseConfirmation}
            variant="contained"
            sx={{
              bgcolor: "#111827",
              color: "#fff",
            }}
          >
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
