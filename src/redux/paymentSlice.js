import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ENDPOINTS, axiosConfig } from './endpoints';

// Async thunk for initiating payment
export const initiatePayment = createAsyncThunk(
  'payment/initiate',
  async ({ rejectWithValue, getState }) => {
    try {

      const { token } = getState().auth;

      const config = {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.post(ENDPOINTS.INITIATE_PAYMENT, {}, config);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for confirming payment
export const confirmPayment = createAsyncThunk(
  'payment/confirm',
  async (confirmationData, { rejectWithValue, getState }) => {
    try {

      const { token } = getState().auth;


      const response = await axios.post(ENDPOINTS.CONFIRM_PAYMENT, {
        data: {
          order_id: confirmationData.order_id,
          payment_id: confirmationData.payment_id,
          signature: confirmationData.signature,
          status: confirmationData.status,
          amount: confirmationData.amount
        }
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPlans = createAsyncThunk(
  'payment/getPlans',
  async (_, { rejectWithValue, getState }) => {

    const { token } = getState().auth;

    const config = {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(ENDPOINTS.GET_PLANS, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  initiatePayment: null,
  confirmPayment: null,
  initiateLoading: false,
  confirmLoading: false,
  initiateError: null,
  confirmError: null,
  planData: null,
  getPlansLoading: false,
  getPlansError: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  extraReducers: (builder) => {
    builder
      // Handle initiate payment
      .addCase(initiatePayment.pending, (state) => {
        state.initiateLoading = true;
        state.initiateError = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.initiatePayment = action.payload;
        state.initiateLoading = false;
        state.initiateError = null;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.initiateLoading = false;
        state.initiateError = action.payload;
      })
      // Handle confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.confirmLoading = true;
        state.confirmError = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.confirmPayment = action.payload;
        state.confirmLoading = false;
        state.confirmError = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.confirmLoading = false;
        state.confirmError = action.payload;
      })
      // Handle get plans
      .addCase(getPlans.pending, (state) => {
        state.getPlansLoading = true;
        state.getPlansError = null;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.planData = action.payload;
        state.getPlansLoading = false;
        state.getPlansError = null;
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.getPlansLoading = false;
        state.getPlansError = action.payload;
      });
  }
});

export default paymentSlice.reducer; 