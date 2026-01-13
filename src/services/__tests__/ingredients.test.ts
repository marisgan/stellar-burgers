import reducer, {
  fetchIngredients,
  ingredientsInitialState
} from '../slices/ingredients';

import type { TIngredient } from '@utils-types';
import { bun, filling, sauce } from '../../constants/data-mocks';

describe('ingredients slice reducer', () => {
  it('should set isLoading=true on fetchIngredients.pending', () => {
    const nextState = reducer(
      ingredientsInitialState,
      fetchIngredients.pending('', undefined)
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should save items and set isLoading=false on fetchIngredients.fulfilled', () => {
    const mockItems: TIngredient[] = [bun, filling, sauce];

    const loadingState = { ...ingredientsInitialState, isLoading: true };

    const nextState = reducer(
      loadingState,
      fetchIngredients.fulfilled(mockItems, '', undefined)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.items).toEqual(mockItems);
    expect(nextState.error).toBeNull();
  });

  it('should save error and set isLoading=false on fetchIngredients.rejected', () => {
    const loadingState = { ...ingredientsInitialState, isLoading: true };

    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Network error' }
    };

    const nextState = reducer(loadingState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Network error');
  });
});
