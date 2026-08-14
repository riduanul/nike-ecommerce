import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/orders', orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Order creation failed');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/orders/my');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Order not found');
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const { data } = await API.get(`/orders?${queryString}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/orders/${id}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'orders/dashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/orders/stats/dashboard');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    order: null,
    myOrders: [],
    stats: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearOrderState: (state) => { state.success = false; state.error = null; state.order = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.success = false; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.order = action.payload; state.success = true; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.order = action.payload; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.orders = action.payload.orders || action.payload; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.stats = action.payload; });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
