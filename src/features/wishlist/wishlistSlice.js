import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addProductToWishlist, removeFromWishlistApi } from './wishlistApi';

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlistAsync',
  async ({ productId, shopId }, { rejectWithValue }) => {
    try {
      const response = await addProductToWishlist(productId, shopId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlistAsync',
  async ({ productId, shopId }, { rejectWithValue }) => {
    try {
      const response = await removeFromWishlistApi(productId, shopId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        const newItem = action.payload;
        const existingItem = state.items.find((item) => item.id === newItem.id);
        if (!existingItem) {
          state.items.push(newItem);
        }
        state.loading = false;
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.loading = false;
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;