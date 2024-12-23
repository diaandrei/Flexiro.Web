import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInSellerApi } from './signInApi';
import toast from 'react-hot-toast';

export const signInSeller = createAsyncThunk(
    'signin/signInSeller',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const sellerData = await signInSellerApi({ email, password });
            return sellerData; // Return seller data if successful
        } catch (error) {

            toast.error(error.message);

            // Return error message if sign-in fails
            return rejectWithValue(error.message || 'Sign-in failed. Please verify your details and try again');
        }
    }
);

// Initial state for the slice
const initialState = {
    user: null,
    error: null,
    loading: false,
};

// Create the slice
const signInSlice = createSlice({
    name: 'signIn',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null; // Reset the error state
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInSeller.pending, (state) => {
                state.loading = true;
                state.error = null; // Clear error on new request
            })
            .addCase(signInSeller.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Set user data on success
            })
            .addCase(signInSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Sign-in failed. Please verify your details and try again';
            });
    },
});

export const { resetError } = signInSlice.actions;

export const selectUser = (state) => state.signIn.user;
export const selectAuthError = (state) => state.signIn.error;
export const selectAuthLoading = (state) => state.signIn.loading;

export default signInSlice.reducer;
