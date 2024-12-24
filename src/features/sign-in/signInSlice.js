import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInApi } from './signInApi';
import toast from 'react-hot-toast';

export const signInUser = createAsyncThunk(
  'signin/signInUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userData = await signInApi({ email, password });
        return userData;
        
    } catch (error) {
      toast.error(error.message);
      // Return error message if sign-in fails
      return rejectWithValue(error.message || 'Sign-in failed. Please try again.');
    }
  }
);

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
      state.error = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign-in failed'; 
      });
  },
});

export const { resetError } = signInSlice.actions;

export const selectUserId = (state) => state.signIn.userId;
export const selectUser = (state) => state.signIn.user;
export const selectAuthError = (state) => state.signIn.error;
export const selectAuthLoading = (state) => state.signIn.loading;

export default signInSlice.reducer;
