import { createSlice } from '@reduxjs/toolkit';
import { fetchProductDetails } from '../../features/product-detail/productDetailsApi';

const productDetailSlice = createSlice({
    name: 'productDetail',
    initialState: {
      product: {
        productName: '',
        description: '',
        pricePerItem: 0,
        mainImage: '',
        imageUrls: [], 
        reviews: [], 
        categoryName: '',
        averageRating: 0,
        totalReviews: 0,
        totalSold: 0,
      },
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProductDetails.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.product = action.payload.content;
        })
        .addCase(fetchProductDetails.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  

export default productDetailSlice.reducer;
