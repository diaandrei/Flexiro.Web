import axios from "axios";

// Create an Axios instance with base URL and common headers
const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

// Request interceptor to add JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to store token if present in response
api.interceptors.response.use(
  (response) => {
    if (response.data?.content?.token) {
      localStorage.setItem("token", response.data?.content?.token);
    }
    if (response.data?.content?.id) {
      localStorage.setItem("userId", response.data.content.id); // Storing userId
    }
    if (response.data?.content?.role) {
      localStorage.setItem("role", response.data.content.role); // Storing userId
    }
    return response;
  },
  (error) => Promise.reject(error)
);

// Generic HTTP request functions
export const getRequest = (url, params = {}) => {
  return api.get(url, { params });
};

export const postRequest = (url, data) => {
  return api.post(url, data);
};

export const putRequest = (url, data) => {
  return api.put(url, data);
};

export const deleteRequest = (url) => {
  return api.delete(url);
};

export default api;
