import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const addOrUpdateReview = async (reviewData) => {
    try {
        const formData = new FormData();
        formData.append('productId', reviewData.productId);
        formData.append('userId', reviewData.userId);
        formData.append('rating', reviewData.rating);

        const response = await axios.post(
            `${API_ENDPOINT}/Customer/product/review`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getUserRating = async (productId, userId) => {
    try {
        const response = await axios.get(
            `${API_ENDPOINT}/Customer/product/review/user-rating`,
            {
                params: {
                    productId,
                    userId
                }
            }
        );
        return response.data;
    } catch (error) {

        return null;
    }
};