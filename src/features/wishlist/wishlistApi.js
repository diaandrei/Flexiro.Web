import { postRequest, deleteRequest } from '../../api/api';

export const addProductToWishlist = (productId, shopId) => {

    const userId = localStorage.getItem('userId').toString();

    return postRequest('/Customer/add-product-wishlist', { productId: productId, userId: userId, shopId: shopId.toString() });
};

export const removeFromWishlistApi = (productId, shopId) => {
    const userId = localStorage.getItem('userId').toString();
    return deleteRequest(`/Customer/remove-product-wishlist?productId=${productId}&userId=${userId}&shopId=${shopId}`);
};