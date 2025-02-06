import { createAsyncThunk } from "@reduxjs/toolkit";
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const fetchProductDetails = createAsyncThunk(
  "product/fetchProductDetails",
  async ({ productId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/api/Customer/product/details/${productId}?userId=${userId}`
      );
      if (!response.ok) {
        return rejectWithValue("Unable to retrieve Product Information");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        "An error occurred while fetching product details"
      );
    }
  }
);
