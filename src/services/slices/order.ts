import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import type { TOrder } from '@utils-types';

export type OrderState = {
  orderRequest: boolean;
  orderData: TOrder | null;
  lastError: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderData: null,
  lastError: null
};

const CREATE_ORDER_ERROR = 'Не удалось оформить заказ';
const FETCH_ORDER_ERROR = 'Не удалось получить заказ';

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (ingredientIds) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number, { rejectWithValue }) => {
    const data = await getOrderByNumberApi(number);
    const order = data.orders?.[0];

    if (!order) {
      return rejectWithValue(FETCH_ORDER_ERROR);
    }

    return order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.orderData = null;
      state.lastError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // create order
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.lastError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.lastError = action.error.message || CREATE_ORDER_ERROR;
      })

      // fetch by number
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.lastError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        const payloadMessage =
          typeof action.payload === 'string' ? action.payload : null;
        state.lastError =
          payloadMessage || action.error.message || FETCH_ORDER_ERROR;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
