import { RootState } from './store';


export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export const selectFeed = (state: RootState) => state.feeds.feed;
export const selectOrders = (state: RootState) => state.feeds.orders;
export const selectFeedsLoading = (state: RootState) => state.feeds.isLoading;

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientById = (id: string) => (state: RootState) =>
  state.ingredients.items.find((i) => i._id === id) || null;

export const selectOrderData = (state: RootState) => state.order.orderData;
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderError = (state: RootState) => state.order.lastError;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;