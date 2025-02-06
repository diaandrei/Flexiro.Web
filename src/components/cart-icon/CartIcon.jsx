import React, { useEffect, useState } from "react";
import { Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { getCartCount } from "../../features/cart/cartCountSlice";
import axios from "axios";

const CartIcon = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.cartCount.count);
  const [currentId, setCurrentId] = useState("");

  const ensureGuestIdSync = async () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      return null;
    }

    try {
      const response = await axios.get(`/api/Customer/cart?userId=${guestId}`);
      if (response.data && response.data.success && response.data.content) {
        const dbGuestId =
          response.data.content.GuestUserId || response.data.content.UserId;
        if (dbGuestId && dbGuestId !== guestId) {
          console.log(
            "Updating guestId in local storage from",
            guestId,
            "to",
            dbGuestId
          );
          localStorage.setItem("guestId", dbGuestId);
          guestId = dbGuestId;
        }
      }
    } catch (error) {
      console.error("Error syncing guest id:", error);
    }
    return guestId;
  };

  const getGuestId = () => localStorage.getItem("guestId");

  const getCurrentId = () => {
    const userId = localStorage.getItem("userId");
    return userId || getGuestId();
  };

  useEffect(() => {
    const syncAndDispatch = async () => {
      let id = getCurrentId();

      if (!localStorage.getItem("userId") && id) {
        id = await ensureGuestIdSync();
      }
      setCurrentId(id);
      if (id) {
        dispatch(getCartCount(id));
      }
    };

    syncAndDispatch();
  }, [dispatch]);

  return (
    <Badge badgeContent={count} color="secondary">
      <ShoppingCartIcon />
    </Badge>
  );
};

export default CartIcon;
