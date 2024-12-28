import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

// Function to fetch the cart count
export const fetchCartCount = async (userId) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/Customer/cart/item-count/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch cart count"
    );
  }
};
