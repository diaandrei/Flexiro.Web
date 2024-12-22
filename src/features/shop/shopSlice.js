import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchShopItems } from "./shopApi";

export const getShopItems = createAsyncThunk("/customer/shops", async () => {
  const response = await fetchShopItems();
  return response.data.content;
});

const shopSlice = createSlice({
  name: "shop",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getShopItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getShopItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(getShopItems.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const selectShop = (state) => state.shop;
export default shopSlice.reducer;
