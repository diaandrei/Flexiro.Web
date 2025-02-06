import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast, Bounce } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchShopProducts = createAsyncThunk(

  "shopDetail/fetchShopProducts",
  async ({ shopId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/shops/${shopId}/products`,
        {
          params: { userId },
        }
      );

      return response.data.content;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
