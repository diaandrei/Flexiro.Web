import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  Box,
  Typography,
} from "@mui/material";

const ReviewModal = ({
  open,
  onClose,
  productId,
  userId,
  currentRating,
  onSubmit,
}) => {
  const [rating, setRating] = useState(currentRating);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "100%",
          maxWidth: "440px",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          pt: 4,
          pb: 2,
          fontSize: "24px",
          fontWeight: 600,
          color: "#262C36",
        }}
      >
        Rate this product
      </DialogTitle>

      <DialogContent sx={{ px: 4 }}>
        <Box
          sx={{
            my: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Rating
            name="product-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#FF7A00",
              },
              "& .MuiRating-iconHover": {
                color: "#FF7A00",
              },
              fontSize: "48px",
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 4,
          pt: 2,
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "text.secondary",
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!rating}
          sx={{
            backgroundColor: "#262C36",
            px: 2,
            py: 1,
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#3a4149",
            },
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: "#a0a0a0",
            },
          }}
        >
          Submit Rating
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
