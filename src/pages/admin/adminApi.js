import axios from "axios";
import { toast, Bounce } from 'react-toastify';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchAdminDashboard = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/Admin/dashboard`);
    return response.data; // return the response data
  } catch (error) {

    throw error;
  }
};
