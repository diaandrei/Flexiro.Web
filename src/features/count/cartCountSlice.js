import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCartCount } from './cartCountApi';

// Async thunk to fetch cart count
export const getCartCount = createAsyncThunk(
    'cartCount/getCartCount',
    async (userId, { rejectWithValue }) => {
        try {
            const count = await fetchCartCount(userId);
            return count;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Slice definition
const cartCountSlice = createSlice({
    name: 'cartCount',
    initialState: {
        count: 0,      
        loading: false, 
        error: null,    
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCartCount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartCount.fulfilled, (state, action) => {
                state.count = action.payload; // Update the cart count
                state.loading = false;
            })
            .addCase(getCartCount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Capture error
            });
    },
});

export default cartCountSlice.reducer;
