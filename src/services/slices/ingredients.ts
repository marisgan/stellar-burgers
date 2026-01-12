import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import type { TIngredient } from '@utils-types';

export type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const ingredientsInitialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

const INGREDIENTS_ERROR = 'Ошибка загрузки ингредиентов';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchAll',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: ingredientsInitialState,
  reducers: {
    setIngredients(state, action) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || INGREDIENTS_ERROR;
      });
  }
});

export const { setIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
