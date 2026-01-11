import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { TConstructorIngredient, TIngredient } from '@utils-types';

export type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const constructorInitialState: ConstructorState = {
  bun: null,
  ingredients: []
};

type MovePayload = { fromIndex: number; toIndex: number };

const constructorSlice = createSlice({
  name: 'constructor',
  initialState: constructorInitialState,
  reducers: {
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
          return;
        }

        state.ingredients.push(ingredient);
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: { ...ingredient, id: uuidv4() } as TConstructorIngredient
        };
      }
    },

    removeIngredient(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.ingredients = state.ingredients.filter((item) => item.id !== id);
    },

    moveIngredient(state, action: PayloadAction<MovePayload>) {
      const { fromIndex, toIndex } = action.payload;

      // защита от некорректных индексов
      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }

      const [moved] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, moved);
    },

    clearConstructor() {
      // вернуть новый объект, чтобы гарантировать сброс
      return constructorInitialState;
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;
