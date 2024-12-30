import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchSellerProducts = async (shopId) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINT}/Seller/getallproducts/${shopId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching seller products:", error);
    throw error;
  }
};
