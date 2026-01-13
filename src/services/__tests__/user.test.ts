import reducer, {
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  updateUser,
  setAuthChecked
} from '../slices/user';

import type { TUser } from '@utils-types';

describe('user slice reducer', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  const registerData = {
    email: 'test@test.com',
    password: 'password123',
    name: 'Test User'
  };

  const loginData = {
    email: 'test@test.com',
    password: 'password123'
  };

  it('should return initial state by default', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('should handle setAuthChecked', () => {
    const nextState = reducer(initialState, setAuthChecked(true));
    expect(nextState.isAuthChecked).toBe(true);
  });

  // ---- registerUser ----
  it('should set isLoading=true and clear error on registerUser.pending', () => {
    const prevState = { ...initialState, error: 'prev error' };

    const nextState = reducer(
      prevState,
      registerUser.pending('', registerData)
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should set user and isLoading=false on registerUser.fulfilled', () => {
    const loadingState = { ...initialState, isLoading: true };

    const nextState = reducer(
      loadingState,
      registerUser.fulfilled(mockUser, '', registerData)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.error).toBeNull();
  });

  it('should set error and isLoading=false on registerUser.rejected', () => {
    const loadingState = { ...initialState, isLoading: true };

    const action = {
      type: registerUser.rejected.type,
      error: { message: 'Register error' }
    };

    const nextState = reducer(loadingState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Register error');
  });

  it('should use default error text on registerUser.rejected without message', () => {
    const action = {
      type: registerUser.rejected.type,
      error: {}
    };

    const nextState = reducer(initialState, action);

    expect(nextState.error).toBe('Ошибка регистрации');
  });

  // ---- loginUser ----
  it('should set isLoading=true and clear error on loginUser.pending', () => {
    const prevState = { ...initialState, error: 'prev error' };

    const nextState = reducer(
      prevState,
      loginUser.pending('', loginData)
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should set user and isLoading=false on loginUser.fulfilled', () => {
    const loadingState = { ...initialState, isLoading: true };

    const nextState = reducer(
      loadingState,
      loginUser.fulfilled(mockUser, '', loginData)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.error).toBeNull();
  });

  it('should set error and isLoading=false on loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'Login error' }
    };

    const nextState = reducer(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Login error');
  });

  it('should use default error text on loginUser.rejected without message', () => {
    const action = {
      type: loginUser.rejected.type,
      error: {}
    };

    const nextState = reducer(initialState, action);

    expect(nextState.error).toBe('Ошибка авторизации');
  });

  // ---- fetchUser ----
  it('should set isLoading=true and clear error on fetchUser.pending', () => {
    const prevState = { ...initialState, error: 'prev error' };

    const nextState = reducer(
      prevState,
      fetchUser.pending('', undefined)
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should set user, isAuthChecked=true and isLoading=false on fetchUser.fulfilled', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
      isAuthChecked: false
    };

    const nextState = reducer(
      loadingState,
      fetchUser.fulfilled(mockUser, '', undefined)
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should set isAuthChecked=true and isLoading=false on fetchUser.rejected', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
      isAuthChecked: false
    };

    const nextState = reducer(loadingState, {
      type: fetchUser.rejected.type,
      error: { message: 'Fetch error' }
    });

    expect(nextState.isLoading).toBe(false);
    expect(nextState.isAuthChecked).toBe(true);
  });

  // ---- updateUser ----
  it('should set isLoading=true and clear error on updateUser.pending', () => {
    const prevState = { ...initialState, error: 'prev error' };

    const nextState = reducer(
      prevState,
      updateUser.pending('', { name: 'New Name' })
    );

    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('should set user and isLoading=false on updateUser.fulfilled', () => {
    const loadingState = { ...initialState, isLoading: true };

    const nextState = reducer(
      loadingState,
      updateUser.fulfilled(mockUser, '', { name: 'New Name' })
    );

    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(mockUser);
    expect(nextState.error).toBeNull();
  });

  it('should set error and isLoading=false on updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: 'Update error' }
    };

    const nextState = reducer(initialState, action);

    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Update error');
  });

  it('should use default error text on updateUser.rejected without message', () => {
    const action = {
      type: updateUser.rejected.type,
      error: {}
    };

    const nextState = reducer(initialState, action);

    expect(nextState.error).toBe('Ошибка обновления профиля');
  });

  // ---- logoutUser ----
  it('should set user=null on logoutUser.fulfilled', () => {
    const filledState = { ...initialState, user: mockUser };

    const nextState = reducer(
      filledState,
      logoutUser.fulfilled(undefined, '')
    );

    expect(nextState.user).toBeNull();
  });
});
