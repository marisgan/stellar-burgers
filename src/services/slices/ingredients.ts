import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Этот слайс отвечает за загрузку и хранение списка ингредиентов
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

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    // Запрашиваю ингредиенты с сервера
    const items = await getIngredientsApi();
    return items;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: ingredientsInitialState,
  reducers: {
    // Хелпер на случай, если понадобится вручную установить список
    setIngredients(state, action: PayloadAction<TIngredient[]>) {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isLoading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const { setIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
