import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const ShopCard = ({ image, brandName, rating, link }) => (
  <Paper
    elevation={3}
    sx={{
      cursor: "pointer",

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
    <Card
      sx={{
        border: "none",
        backgroundColor: "transparent", // Set background to transparent
        boxShadow: "none", // Remove shadow
      }}
    >
      <CardMedia
        sx={{
          borderRadius: "20px",
          width: { xs: "100%", sm: "auto" },
          maxWidth: "100%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        component="img"
        height="180px"
        image={image}
        alt={brandName}
      />
      <CardContent>
        <Typography variant="h6" sx={{ width: "100%", textAlign: "center" }}>
          {brandName}
        </Typography>
        <Button
          href={link}
          sx={{
            textDecoration: "underline",
            color: "black",
            textDecorationColor: "orange",
            textUnderlineOffset: "2px",
            width: "100%",
            alignSelf: "center",
          }}
        >
          VISIT SHOP
        </Button>
      </CardContent>
    </Card>
  </Paper>
);

export default ShopCard;
