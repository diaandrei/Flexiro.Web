import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

// Function to fetch the cart count
export const fetchCartCount = async (userId) => {
  try {
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/cart/item-count/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch cart count"
    );
  }
};
