import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const getWishlistProducts = async (userId) => {
    try {
        const response = await axios.get(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/wishlist-products/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeProductFromWishlist = async (productId, userId) => {
    try {
        const response = await axios.delete(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/remove-product-wishlist`, {
            params: { productId, userId },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};