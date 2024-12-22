"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";

const ProductCard = ({ product }) => (
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
          ${product.originalPrice}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
          ${product.discountedPrice}
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
    </CardContent>
  </Card>
);

export default ProductCard;
