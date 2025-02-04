import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const getCart = async (userId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/Customer/cart`, {
      params: { userId },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCartItem = async (cartItemId, quantity, userId) => {
  try {
    const cartData = {
      cartItemId: cartItemId,
      quantity: quantity,
      userId: userId,
    };
    const response = await axios.put(
      `${API_ENDPOINT}/Customer/UpdateCartItemQuantity`,
      cartData
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeCartItem = async (cartItemId, userId) => {
  try {
    const itemData = {
      cartItemId: cartItemId,
      userId: userId,
    };
   
    const response = await axios.delete(
      `${API_ENDPOINT}/Customer/RemoveItemFromCart`,
      {
        params: {
          cartItemId,
          userId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const applyCoupon = async (cartId, couponCode) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/cart/coupon`, {
      cartId,
      couponCode,
    });
    return response.data;
  } catch (error) {
    console.error("Error applying discount code:", error);
    throw error;
  }
};
