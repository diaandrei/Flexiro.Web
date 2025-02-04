import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getPaymentDetails,
  submitPaymentDetails,
  selectPayment,
} from "../../features/payment/paymentSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentDetails, status, error } = useSelector(selectPayment);

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(getPaymentDetails());
  }, [dispatch]);

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv) {
      setErrorMessage("Please fill in all the payment details.");
      return;
    }

    try {
      await dispatch(submitPaymentDetails({ cardNumber, expiryDate, cvv }));
      navigate("/confirmation");
    } catch (err) {
      setErrorMessage(
        "Payment failed. Please check your details and try again."
      );
    }
  };

  const renderCartSummary = () => {
    if (cartItems.length === 0) {
      return <Typography>Your cart is empty.</Typography>;
    }

    return cartItems.map((item, index) => {
      const name = item.name || "Unnamed Product";
      const quantity = item.quantity ?? 0;
      const price = item.price ?? 0;

      return (
        <Typography key={index}>
          {name} - Quantity: {quantity}, Price: £{price.toFixed(2)}
        </Typography>
      );
    });
  };

  return (
    <Box
      sx={{ padding: { xs: 3, sm: 4, md: 5 }, maxWidth: 800, margin: "0 auto" }}
    >
      <Paper sx={{ padding: 3, boxShadow: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Payment Details
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Your Cart Summary:
          </Typography>
          {renderCartSummary()}
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Card Number"
            variant="outlined"
            fullWidth
            value={paymentDetails ? paymentDetails.cardNumber : cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            type="number"
            sx={{ mb: 2 }}
            inputProps={{ maxLength: 16 }}
            placeholder="**** **** **** 1234"
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Expiry Date (MM/YY)"
                variant="outlined"
                fullWidth
                value={paymentDetails ? paymentDetails.expiryDate : expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                type="text"
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 5 }}
                placeholder="MM/YY"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                variant="outlined"
                fullWidth
                value={paymentDetails ? paymentDetails.cvv : cvv}
                onChange={(e) => setCvv(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 3 }}
                placeholder="***"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                variant="outlined"
                fullWidth
                value={paymentDetails ? paymentDetails.cvv : cvv}
                onChange={(e) => setCvv(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
                inputProps={{ maxLength: 3 }}
                placeholder="***"
              />
            </Grid>
          </Grid>
        </Box>
        {errorMessage && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePayment}
          disabled={status === "loading"}
          sx={{
            padding: "14px",
            fontSize: "16px",
            boxShadow: 3,
            "&:hover": { backgroundColor: "primary.main", boxShadow: 6 },
          }}
        >
          {status === "loading" ? <CircularProgress size={24} /> : "Pay Now"}
        </Button>
      </Paper>
    </Box>
  );
};

export default Payment;
