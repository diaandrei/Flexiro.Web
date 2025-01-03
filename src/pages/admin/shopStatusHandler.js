import axios from "axios";
import toast from 'react-hot-toast';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

// Function to update shop status
export const changeshopstatus = async (shopId, newStatus) => {
  try {
    const statusMap = {
      Active: 1,
      Inactive: 2,
      Pending: 0,
    };

    const statusData = {
      ShopId: shopId,
      newStatus: newStatus,
    };
    const response = await axios.put(
      `${API_ENDPOINT}/Admin/change-shop-status`,
      statusData
    );
    
    if (response.data.success == true) {
      toast.success(response.data.title);
    }
    return response.data;
  } catch (error) {

    throw error;
  }
};
