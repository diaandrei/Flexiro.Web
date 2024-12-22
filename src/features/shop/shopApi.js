import axios from "axios";

// Define the headers to use in the API requests
const headers = {
  "Content-Type": "application/json",
  ...(process.env.NODE_ENV === "development" && {
    "Bypass-Tunnel-Reminder": "true",
    "ngrok-skip-browser-warning": "true",
  }),
};

// Create an Axios instance with the base URL of the deployed API on Azure
const api = axios.create({
  baseURL: "https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net", // Base URL
  headers,
});

// Function to fetch shop items from the /api/customer/dashboard endpoint
export const fetchShopItems = async () => {
  try {
    // Send a GET request to the /api/customer/dashboard endpoint
    const response = await api.get("/api/customer/dashboard");
    return response.data; // Return the data from the response
  } catch (error) {
    // Handle and throw an error if the request fails
    throw error;
  }
};
