import { postRequest, deleteRequest, putRequest } from '../../api/api';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const getCurrentId = () => {
  const userId = localStorage.getItem('userId');
  return userId || getGuestId();
};
const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = `${uuidv4()}`;
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const addItemToCart = async (item) => {

  const isGuest = !localStorage.getItem('userId')
  const currentId = getCurrentId();
  const requestPayload = {
    Items: [
      {
        ProductId: item.productId,
        Quantity: item.quantity,
        ShopId: item.shopId,
        Price: item.pricePerItem,
      }
    ],
    IsGuest: isGuest,
  };

  const response = await postRequest(`/customer/add-product-to-cart?userId=${currentId}`, requestPayload);

  if (response.request.status === 200) {
    toast.success('Your item has been added to the cart.', {
      duration: 2000,
    });
    return response.data;
  } else {
    toast.error(response.data.title);
  }
};

// Remove an item from the cart by cartItemId
export const removeItemFromCart = async (cartItemId) => {
  const userId = localStorage.getItem("userId");
  const currentId = getCurrentId();
  const response = await deleteRequest(`/customer/RemoveItemFromCart?cartItemId=${cartItemId}&userId=${currentId}`);

  if (response.request.status === 200) {
    return response;

  } else {
    throw new Error(response.data.title);
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const userId = localStorage.getItem("userId");
  const currentId = getCurrentId();
  const response = await putRequest(`/customer/UpdateCartItemQuantity?cartItemId=${cartItemId}&quantity=${quantity}&userId=${currentId}`);

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

  } else {
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

export const transferGuestCartApi = async (guestId, userId) => {

  const response = await postRequest('/Customer/transfer-guest-cart', {
    guestId,
    userId
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(response.data.title);
  }
};