import { createSlice } from '@reduxjs/toolkit';
import { fetchShopProducts } from './shopDetailApi';

const initialState = {
  products: [],
  status: 'idle',
  error: null,
};

// Create slice and define reducers
const shopDetailSlice = createSlice({
  name: 'shopDetail',
  initialState,
  reducers: {
    clearProducts(state) {
      state.products = []; // Clear the products array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShopProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload; // Set products from API response
      })
      .addCase(fetchShopProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectShopProducts = (state) => state.shopDetail.products;
export const selectShopProductsStatus = (state) => state.shopDetail.status;
export const selectShopProductsError = (state) => state.shopDetail.error;
export const { clearProducts } = shopDetailSlice.actions;
export default shopDetailSlice.reducer;
