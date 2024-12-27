import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const getWishlistProducts = async (userId) => {
    try {
        const response = await axios.get(`${API_ENDPOINT}/Customer/wishlist-products/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist products:", error);
        throw error;
    }
};

export const removeProductFromWishlist = async (productId, userId) => {
    try {
        const response = await axios.delete(`${API_ENDPOINT}/Customer/remove-product-wishlist`, {
            params: { productId, userId },
        });
        return response.data;
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        throw error;
    }
};