import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

// Этот слайс отвечает за оформление заказа и детальную информацию по номеру
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

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    // Отправляю заказ на сервер
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
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
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.lastError = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderRequest = false;
          state.orderData = action.payload;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.lastError = action.error.message || 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.lastError = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.orderData = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.lastError = action.error.message || 'Не удалось получить заказ';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
