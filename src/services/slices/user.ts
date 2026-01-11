import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  type TLoginData,
  type TRegisterData,
  updateUserApi
} from '@api';
import type { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const ERRORS = {
  register: 'Ошибка регистрации',
  login: 'Ошибка авторизации',
  update: 'Ошибка обновления профиля'
} as const;

const TOKEN_KEYS = {
  refresh: 'refreshToken',
  access: 'accessToken'
} as const;

const saveTokens = (refreshToken: string, accessToken: string) => {
  localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
  setCookie(TOKEN_KEYS.access, accessToken);
};

const clearTokens = () => {
  deleteCookie(TOKEN_KEYS.access);
  localStorage.removeItem(TOKEN_KEYS.refresh);
};

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const res = await registerUserApi(data);
    saveTokens(res.refreshToken, res.accessToken);
    return res.user;
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const res = await loginUserApi(data);
    saveTokens(res.refreshToken, res.accessToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk<void>('user/logout', async () => {
  await logoutApi();
  clearTokens();
});

export const fetchUser = createAsyncThunk<TUser>('user/fetch', async () => {
  const res = await getUserApi();
  return res.user;
});

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

const setPending = (state: UserState) => {
  state.isLoading = true;
  state.error = null;
};

const setRejected = (
  state: UserState,
  message: string,
  action: { error: { message?: string } }
) => {
  state.isLoading = false;
  state.error = action.error.message || message;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerUser.pending, setPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        setRejected(state, ERRORS.register, action);
      })

      // login
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        setRejected(state, ERRORS.login, action);
      })

      // fetch user (важно: всегда выставляем isAuthChecked = true)
      .addCase(fetchUser.pending, setPending)
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
      })

      // update
      .addCase(updateUser.pending, setPending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        setRejected(state, ERRORS.update, action);
      })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
