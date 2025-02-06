import React, { useState, useEffect } from "react";
import DropIn from "braintree-web-drop-in-react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";

const BraintreePayment = ({ onInstance, onError }) => {
  const [clientToken, setClientToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await fetch(
          `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/payment/generate-client-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch client token");
        }

        const data = await response.json();
        setClientToken(data.clientToken);
      } catch (err) {
        const errorMessage = "Failed to initialize payment system";
        setError(errorMessage);
        if (onError) onError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchClientToken();
  }, [onError]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!clientToken) {
    return (
      <Typography color="error" variant="body2">
        Payment system is currently unavailable. Please try again later.
      </Typography>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <DropIn
        options={{
          authorization: clientToken,

          card: {
            vault: {
              allowVaulting: true,
            },
          },
          styles: {
            input: {
              "font-size": "14px",
              "font-family": "inherit",
            },
          },
        }}
        onInstance={(instance) => {
          if (onInstance) {
            onInstance(instance);
          }
        }}
      />
    </Box>
  );
};

export default BraintreePayment;
