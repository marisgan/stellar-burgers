import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import constructorReducer from './slices/constructor';
import feedsReducer from './slices/feeds';
import ingredientsReducer from './slices/ingredients';
import orderReducer from './slices/order';
import userReducer from './slices/user';

export const rootReducer = combineReducers({
  burgerConstructor: constructorReducer,
  feeds: feedsReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const useDispatch: () => AppDispatch = () => dispatchHook();

export default store;
