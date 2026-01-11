import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const constructorInitialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState: constructorInitialState,
  reducers: {
    addIngredient: {
      reducer(
        state,
        action: PayloadAction<{ ingredient: TConstructorIngredient }>
      ) {
        const { ingredient } = action.payload;
        if (ingredient.type === 'bun') {
          state.bun = ingredient;
        } else {
          state.ingredients.push(ingredient);
        }
      },
      prepare(payload: { ingredient: TIngredient }) {
        const { ingredient } = payload;
        return {
          payload: {
            ingredient: { ...ingredient, id: uuidv4() }
          }
        };
      }
    },
    removeIngredient(state, action: PayloadAction<{ id: string }>) {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload.id
      );
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.ingredients];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      state.ingredients = items;
    },
    clearConstructor(state) {
      state.bun = null;
      state.ingredients = [];
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
