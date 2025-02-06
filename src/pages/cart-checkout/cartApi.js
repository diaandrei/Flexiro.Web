import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const getCart = async (userId) => {
  try {
    const response = await axios.get(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/cart`, {
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
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/UpdateCartItemQuantity`,
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
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/RemoveItemFromCart`,
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
    const response = await axios.post(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/cart/coupon`, {
      cartId,
      couponCode,
    });
    return response.data;
  } catch (error) {
    console.error("Error applying discount code:", error);
    throw error;
  }
};
