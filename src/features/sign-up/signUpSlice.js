import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signUpAPI } from './signUpApi';
import toast from 'react-hot-toast';

export const signUpUser = createAsyncThunk(
    'signup/signUpUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await signUpAPI(userData);

            debugger;
            if (response.success == false) {
                const errorMessage = response.title || "Sign-up failed. Please check your information and try again.";
                toast.error(errorMessage);
                return rejectWithValue(response.title || "Sign-up failed. Please check your information and try again.");
            }

            if (response.success == true) {
                const successMessage = response.titile || "Sign Up Success!";

                toast.success(successMessage);
                return response.content;
            }

            return response.data;
        } 
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const signUpSlice = createSlice({
    name: 'signup',
    initialState: {
        authStatus: 'idle',
        authError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(signUpUser.pending, (state) => {
                state.status = 'loading'; 
                state.error = null; 
            })
            .addCase(signUpUser.fulfilled, (state) => {
                state.status = 'succeeded'; 
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.status = 'failed'; 
                state.error = action.payload;
            });
    },
});

export const selectAuthStatus = (state) => state.signup.authStatus;
export const selectAuthError = (state) => state.signup.authError;

export default signUpSlice.reducer;
