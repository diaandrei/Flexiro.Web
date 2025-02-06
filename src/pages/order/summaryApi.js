import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const getCartSummary = async (userId) => {
  try {
    const response = await axios.get(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/cart/summary`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/order/place`,
      orderData
    );
    return response.data;
  } catch (error) {

    throw error;
  }
};
export const fetchAddress = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.get(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/GetAddressBook`,
      {
        params: { userId },
      }
    );
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const createPaymentIntent = async (userId, amount) => {
  try {
    const response = await axios.post(
      `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/payment/create-payment-intent`,
      {
        OrderId: userId,
        Amount: Math.round(amount * 100),
        Currency: "gbp",
      }
    );
    return response.data;
  } catch (error) {

    throw error;
  }
};

export const getCustomerOrders = async (userId) => {
  try {
    const response = await axios.get(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/orders`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};