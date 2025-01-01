import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../features/cart/cartSlice";

const Confirmation = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isConfirmed) {
      dispatch(clearCart());
      navigate("/");
    }
  }, [isConfirmed, dispatch, navigate]);

  const handleConfirmPayment = () => {
    setIsConfirmed(true);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Payment successful! Thank you for your purchase.
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Your Order Summary:
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <Typography variant="h6">Product</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Quantity</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Price</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Total</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">£{item.price}</TableCell>
                  <TableCell align="center">
                    {isNaN(item.price) ||
                    isNaN(item.quantity) ||
                    item.price == null ||
                    item.quantity == null
                      ? "0.00"
                      : (item.price * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1">Your cart is empty.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Total: £
          {cartItems
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirmPayment}
        >
          Confirm Payment
        </Button>
      </Box>
    </Box>
  );
};

export default Confirmation;
