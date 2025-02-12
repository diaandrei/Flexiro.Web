import axios from "axios";

const API_ENDPOINT =
  process.env.REACT_APP_API_ENDPOINT ||
  "https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net";

function buildUrl(path) {
  let base = API_ENDPOINT.endsWith("/") ? API_ENDPOINT.slice(0, -1) : API_ENDPOINT;

  if (base.toLowerCase().endsWith("/api")) {
    if (path.toLowerCase().startsWith("api/")) {
      path = path.substring(4);
    }
  }
  if (path.startsWith("/")) {
    path = path.substring(1);
  }
  return `${base}/${path}`;
}

export const getCartSummary = async (userId) => {
  try {
    const url = buildUrl("api/Customer/cart/summary");
    const response = await axios.get(url, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    throw error;
  }
};

export const placeOrder = async (orderData) => {
  try {
    const url = buildUrl("api/Customer/order/place");
    const response = await axios.post(url, orderData);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const fetchAddress = async () => {
  try {
    const userId = localStorage.getItem("userId");
    const url = buildUrl("api/Customer/GetAddressBook");
    const response = await axios.get(url, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error("Error fetching address book:", error);
    throw error;
  }
};

export const createPaymentIntent = async (userId, amount) => {
  try {
    const url = buildUrl("api/payment/create-payment-intent");
    const response = await axios.post(url, {
      OrderId: userId,
      Amount: Math.round(amount * 100),
      Currency: "gbp",
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

export const getCustomerOrders = async (userId) => {
  try {
    const url = buildUrl("api/Customer/orders");
    const response = await axios.get(url, { params: { userId } });
    const data = response.data;
    return Array.isArray(data) ? data : data.orders;
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};
