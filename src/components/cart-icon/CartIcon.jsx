import React, { useEffect } from "react";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { getCartCount } from "../../features/cart/cartCountSlice";

const CartIcon = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.cartCount.count);
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    return guestId;
  };
  const getCurrentId = () => {
    const userId = localStorage.getItem("userId");
    return userId || getGuestId();
  };

  const userId = getCurrentId();
  useEffect(() => {
    if (userId) {
      dispatch(getCartCount(userId));
    }
  }, [dispatch, userId]);

  return (
    <Badge badgeContent={count} color="secondary">
      <ShoppingCartIcon />
    </Badge>
  );
};

export default CartIcon;
