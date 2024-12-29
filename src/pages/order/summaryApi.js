import axios from "axios";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const getCartSummary = async (userId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/Customer/cart/summary`, {
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
      `${API_ENDPOINT}/Customer/order/place`,
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
      `${API_ENDPOINT}/Customer/GetAddressBook`,
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
      `${API_ENDPOINT}/payment/create-payment-intent`,
      {
        OrderId: userId,
        Amount: Math.round(amount * 100),
        Currency: "usd",
      }
    );
    return response.data;
  } catch (error) {

    throw error;
  }
};
export const getCustomerOrders = async (userId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/Customer/orders`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {

    throw error;
  }
};
