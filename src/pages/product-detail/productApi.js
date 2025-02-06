import axios from "axios";
import toast from 'react-hot-toast';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const addOrUpdateReview = async (reviewData) => {
    try {
        const formData = new FormData();
        formData.append('productId', reviewData.productId);
        formData.append('userId', reviewData.userId);
        formData.append('rating', reviewData.rating);

        const response = await axios.post(
            `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/product/review`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        debugger;
        if (response.data.success == true) {
            toast.success(response.data.title);
        }
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const getUserRating = async (productId, userId) => {
    try {
        const response = await axios.get(
            `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/product/review/user-rating`,
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