import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest } from '../../api/api';

export const getPaymentDetails = createAsyncThunk(
  'payment/getPaymentDetails',
  async () => {
    const response = await getRequest('/payment-details');
    return response.data;
  }
);

export const submitPaymentDetails = createAsyncThunk(
  'payment/submitPaymentDetails',
  async (paymentData) => {
    const response = await postRequest('/process-payment', paymentData);
    return response.data;
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentDetails: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPaymentDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPaymentDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.paymentDetails = action.payload;
      })
      .addCase(getPaymentDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitPaymentDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitPaymentDetails.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(submitPaymentDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectPayment = (state) => state.payment;

export default paymentSlice.reducer;
