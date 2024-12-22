import React from "react";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartIcon = ({ itemCount }) => {
  return (
    <Badge badgeContent={itemCount} color="secondary">
      <ShoppingCartIcon />
    </Badge>
  );
};

export default CartIcon;
