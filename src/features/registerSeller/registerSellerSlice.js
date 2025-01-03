import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { registerSellerAPI } from './registerSellerApi';
import toast from 'react-hot-toast';

export const registerSeller = createAsyncThunk(
    'registerSeller/registerSeller',
    async (sellerData, { rejectWithValue }) => {
        try {
            const response = await registerSellerAPI(sellerData);
            if (response.success == false) {
                const errorMessage = response.description || "Sign-up failed. Please check your information and try again.";
                toast.error(errorMessage);
                return rejectWithValue(response.description || "Sign-up failed. Please check your information and try again.");
            }
            
            if (response.success == true) {
                const successMessage = response.title || "Sign Up Success!";
                toast.success(successMessage);
                return response.content;
            }
            return response.content;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const registerSellerSlice = createSlice({
    name: 'registerSeller',
    initialState: {
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerSeller.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerSeller.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerSeller.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const selectAuthStatus = (state) => state.registerSeller.status;
export const selectAuthError = (state) => state.registerSeller.error;

export default registerSellerSlice.reducer;
