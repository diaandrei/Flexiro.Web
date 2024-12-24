import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addItemToCart, removeItemFromCart, clearCartitems, updateCartItemQuantity } from '../cart/cartApi';
import toast from 'react-hot-toast';

export const addItem = createAsyncThunk(
  'cart/addItem',
  async (item, { rejectWithValue }) => {
    try {
      const response = await addItemToCart(item);
      if (Array.isArray(response.items) && response.items.length > 0) {
        const totalQuantity = response.items.reduce((acc, currentItem) => {
          const quantity = Number(currentItem.quantity);
          if (!isNaN(quantity)) {
            return acc + quantity;
          }
          return acc;
        }, 0);

        return { items: response.items, totalQuantity };
      }

    } catch (error) {
      toast.error(error.response.data.title);
      return rejectWithValue(error.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateCartItemQuantity(cartItemId, quantity);
      if (response) {

        return response;

      }
      throw new Error('Invalid response format or empty cart items array');
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update cart item quantity');
    }
  }
);

export const removeItem = createAsyncThunk(
  'cart/removeItem',
  async (cartItemId, { rejectWithValue }) => {
    try {
      const response = await removeItemFromCart(cartItemId);
      return response.request.status;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearCartitems();
      if (response) {
        return { items: [], totalQuantity: 0 };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalQuantity: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Item
      .addCase(addItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.items = [...state.items, ...action.payload.items];
        state.totalQuantity += action.payload.totalQuantity;
        state.loading = false;
        state.error = null;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Item Quantity
      .addCase(updateItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateItemQuantity.fulfilled, (state, action) => {
        const updatedItem = action.payload;

        // Check if the item already exists in the state
        const existingItemIndex = state.items.findIndex(item => item.cartItemId === updatedItem.cartItemId);

        if (existingItemIndex !== -1) {
          // If the item exists, update its quantity and total price
          state.items[existingItemIndex] = {
            ...state.items[existingItemIndex],
            quantity: updatedItem.quantity,
            totalPrice: updatedItem.totalPrice,
          };
        } else {
          // If the item doesn't exist, add it to the state
          state.items.push(updatedItem);
        }

        // Update totalQuantity and other state values
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
        state.loading = false;
        state.error = null;
      })
      .addCase(updateItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.cartItemId !== action.meta.arg);
        state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.loading = false;
        state.error = null;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalQuantity = action.payload.totalQuantity;
        state.loading = false;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
