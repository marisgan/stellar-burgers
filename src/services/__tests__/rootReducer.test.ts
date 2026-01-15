import { rootReducer } from '../store';
import constructorReducer, { constructorInitialState } from '../slices/constructor';
import feedsReducer from '../slices/feeds';
import ingredientsReducer, { ingredientsInitialState } from '../slices/ingredients';
import orderReducer from '../slices/order';
import userReducer from '../slices/user';

describe('rootReducer', () => {
  it('returns initial state for unknown action when state is undefined', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expected = {
      burgerConstructor: constructorInitialState,
      feeds: feedsReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      ingredients: ingredientsInitialState,
      order: orderReducer(undefined, { type: 'UNKNOWN_ACTION' }),
      user: userReducer(undefined, { type: 'UNKNOWN_ACTION' })
    };

    expect(state).toEqual(expected);
  });
});
