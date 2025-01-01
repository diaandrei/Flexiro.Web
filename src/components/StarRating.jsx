import React from "react";
import StarIcon from "@mui/icons-material/Star";
import { Box, Typography } from "@mui/material";

const StarRating = ({ rating, maxRating = 5 }) => {
  const filledStars = Math.round(rating);
  const emptyStars = maxRating - filledStars;

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginY: 1 }}>
      {[...Array(filledStars)].map((_, index) => (
        <StarIcon key={index} fontSize="small" sx={{ color: "orange" }} />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <StarIcon
          key={index + filledStars}
          fontSize="small"
          sx={{ color: "gray" }}
        />
      ))}
    </Box>
  );
};

export default StarRating;
