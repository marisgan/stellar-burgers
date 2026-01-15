import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  constructorInitialState
} from '../slices/constructor';

import { bun, filling, sauce } from '../../constants/data-mocks';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn()
}));

const mockUuid = uuidv4 as unknown as jest.Mock<string, []>;

describe('burgerConstructor slice reducer', () => {
  beforeEach(() => {
    mockUuid.mockReset();
  });

  it('should return initial state by default', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(constructorInitialState);
  });

  it('should handle addIngredient: bun goes to bun field', () => {
    mockUuid.mockReturnValueOnce('uuid-bun');

    const state = reducer(constructorInitialState, addIngredient(bun));

    expect(state.bun).toEqual({ ...bun, id: 'uuid-bun' });
    expect(state.ingredients).toHaveLength(0);
  });

  it('should handle addIngredient: non-bun goes to ingredients list', () => {
    mockUuid
      .mockReturnValueOnce('uuid-filling')
      .mockReturnValueOnce('uuid-sauce');

    const withFilling = reducer(constructorInitialState, addIngredient(filling));
    const withTwo = reducer(withFilling, addIngredient(sauce));

    expect(withTwo.bun).toBeNull();
    expect(withTwo.ingredients).toEqual([
      { ...filling, id: 'uuid-filling' },
      { ...sauce, id: 'uuid-sauce' }
    ]);
  });

  it('should handle removeIngredient: removes item by id', () => {
    mockUuid
      .mockReturnValueOnce('uuid-filling')
      .mockReturnValueOnce('uuid-sauce');

    const stateWithTwo = reducer(
      reducer(constructorInitialState, addIngredient(filling)),
      addIngredient(sauce)
    );

    const nextState = reducer(stateWithTwo, removeIngredient('uuid-filling'));

    expect(nextState.ingredients).toEqual([{ ...sauce, id: 'uuid-sauce' }]);
  });

  it('should handle moveIngredient: changes order inside ingredients', () => {
    mockUuid
      .mockReturnValueOnce('uuid-filling')
      .mockReturnValueOnce('uuid-sauce');

    const stateWithTwo = reducer(
      reducer(constructorInitialState, addIngredient(filling)),
      addIngredient(sauce)
    );

    const nextState = reducer(
      stateWithTwo,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(nextState.ingredients).toEqual([
      { ...sauce, id: 'uuid-sauce' },
      { ...filling, id: 'uuid-filling' }
    ]);
  });

  it('should not change state with invalid index', () => {
    mockUuid
      .mockReturnValueOnce('uuid-filling')
      .mockReturnValueOnce('uuid-sauce');

    const stateWithTwo = reducer(
      reducer(constructorInitialState, addIngredient(filling)),
      addIngredient(sauce)
    );

    const nextState = reducer(
      stateWithTwo,
      moveIngredient({ fromIndex: 0, toIndex: 0 })
    );

    expect(nextState).toEqual(stateWithTwo);
  });

  it('should handle clearConstructor', () => {
    mockUuid
      .mockReturnValueOnce('uuid-bun')
      .mockReturnValueOnce('uuid-filling');

    const filledState = reducer(
      reducer(constructorInitialState, addIngredient(bun)),
      addIngredient(filling)
    );

    const cleared = reducer(filledState, clearConstructor());

    expect(cleared).toEqual(constructorInitialState);
  });
});
