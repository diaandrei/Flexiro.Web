import axios from "axios";
import { toast, Bounce } from 'react-toastify';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchAdminDashboard = async () => {
  try {
    const response = await axios.get(`https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Admin/dashboard`);
    return response.data; // return the response data
  } catch (error) {

    throw error;
  }
};
