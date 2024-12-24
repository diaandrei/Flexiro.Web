import { postRequest, deleteRequest, putRequest } from '../../api/api';
import toast from 'react-hot-toast';

export const addItemToCart = async (item) => {
  const userId = localStorage.getItem("userId");

  // Prepare the item data to match the expected model
  const requestPayload = {
    Items: [
      {
        ProductId: item.productId,
        Quantity: item.quantity,
        ShopId: item.shopId,
        Price: item.pricePerItem,
      }
    ]
  };
  // Send the request to the backend
  const response = await postRequest(`/customer/add-product-to-cart?userId=${userId}`, requestPayload);

  if (response.request.status === 200) {
    toast.success('Proudct added to cart');
    return response.data;
  } else {
    toast.error(response.data.title);

  }
};

// Remove an item from the cart by cartItemId
export const removeItemFromCart = async (cartItemId) => {
  const userId = localStorage.getItem("userId");
  const response = await deleteRequest(`/customer/RemoveItemFromCart?cartItemId=${cartItemId}&userId=${userId}`);

  if (response.request.status === 200) {
    return response;

  } else {
    throw new Error(response.data.title);
  }
};
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const userId = localStorage.getItem("userId");
  const response = await putRequest(`/customer/UpdateCartItemQuantity?cartItemId=${cartItemId}&quantity=${quantity}&userId=${userId}`);
  debugger;
  if (response.status === 200) {
    const responedata = {
      cartItemId: response.data.data.cartItemId,
      cartId: response.data.data.cartId,
      productId: response.data.data.productId,
      shopId: response.data.data.shopId,
      quantity: response.data.data.quantity,
      pricePerUnit: response.data.data.pricePerUnit,
      discountAmount: response.data.data.discountAmount,
      totalPrice: response.data.data.totalPrice,
      createdAt: response.data.data.createdAt,
      updatedAt: response.data.data.updatedAt
    };

      return responedata;
      
  }
    else {
        throw new Error(response.data.title);
  }
};

// Clear all items from the cart for a given user
export const clearCartitems = async () => {
  const userId = localStorage.getItem("userId");
  const response = await postRequest(`/customer/clearCart`, { userId });

  if (response.data.success) {
    return response.data.content;
  } else {
    throw new Error(response.data.title);
  }
};
