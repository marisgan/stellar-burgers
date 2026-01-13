import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import type { TOrder, TOrdersData } from '@utils-types';

export type FeedsState = {
  feed: TOrdersData | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: FeedsState = {
  feed: null,
  orders: [],
  isLoading: false,
  error: null
};

const FEED_ERROR = 'Не удалось загрузить ленту';
const ORDERS_ERROR = 'Не удалось загрузить заказы';

export const fetchFeed = createAsyncThunk<TOrdersData>(
  'feeds/fetchFeed',
  async () => getFeedsApi()
);

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'feeds/fetchProfileOrders',
  async () => getOrdersApi()
);

const setLoading = (state: FeedsState) => {
  state.isLoading = true;
  state.error = null;
};

const setError = (state: FeedsState, message: string) => {
  state.isLoading = false;
  state.error = message;
};

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // feed
      .addCase(fetchFeed.pending, setLoading)
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        setError(state, action.error.message || FEED_ERROR);
      })

      // profile orders
      .addCase(fetchProfileOrders.pending, setLoading)
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        setError(state, action.error.message || ORDERS_ERROR);
      });
  }
});

export default feedsSlice.reducer;
