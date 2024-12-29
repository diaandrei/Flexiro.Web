import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getCartCount = createAsyncThunk(
    'cartCount/getCount',
    async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/Customer/cart/item-count/${userId}`);
            const data = await response.json();
            return data.totalItems || 0;
        } catch (error) {

            return 0;
        }
    }
);

const cartCountSlice = createSlice({
    name: 'cartCount',
    initialState: {
        count: 0,
        loading: false,
        error: null,
    },
    reducers: {
        incrementCount: (state) => {
            state.count += 1;
        },
        decrementCount: (state) => {
            state.count = Math.max(0, state.count - 1);
        },
        updateCount: (state, action) => {
            state.count = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartCount.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCartCount.fulfilled, (state, action) => {
                state.count = action.payload;
                state.loading = false;
            })
            .addCase(getCartCount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { incrementCount, decrementCount, updateCount } = cartCountSlice.actions;
export default cartCountSlice.reducer;