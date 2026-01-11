import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

export type FeedsState = {
  feed: TOrdersData | null;
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedsState = {
  feed: null,
  orders: [],
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk('feeds/fetchFeed', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchProfileOrders = createAsyncThunk(
  'feeds/fetchProfileOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.isLoading = false;
          state.feed = action.payload;
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить ленту';
      })
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить заказы';
      });
  }
});

export default feedsSlice.reducer;
