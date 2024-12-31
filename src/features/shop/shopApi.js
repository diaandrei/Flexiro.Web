import axios from "axios";

const headers = {
  "Content-Type": "application/json",
  ...(process.env.NODE_ENV === "development" && {
    "Bypass-Tunnel-Reminder": "true",
    "ngrok-skip-browser-warning": "true",
  }),
};

const api = axios.create({
  baseURL: "https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api",
});


export const fetchShopItems = async () => {
  try {
    const response = await api.get("/customer/dashboard");

    return response;
  } catch (error) {
    throw error;
  }
};
