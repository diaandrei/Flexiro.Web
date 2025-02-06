import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchSellerProducts = async (shopId) => {
  try {
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Seller/getallproducts/${shopId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching seller products:", error);
    throw error;
  }
};
