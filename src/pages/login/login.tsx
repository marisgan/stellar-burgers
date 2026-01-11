import { FC, SyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/user';
import {
  selectUser,
  selectUserLoading,
  selectUserError
} from '../../services/selectors';
import { useForm } from '../../hooks/useForm';

type LoginForm = {
  email: string;
  password: string;
};

type LocationState = {
  from?: string;
};

const HOME_PATH = '/';

export const Login: FC = () => {
  const [form, , setFormValues] = useForm<LoginForm>({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const isLoading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  const setField = useCallback(
    <K extends keyof LoginForm>(
      key: K
    ): Dispatch<SetStateAction<LoginForm[K]>> =>
      (value) => {
        setFormValues((prev) => {
          const nextValue =
            typeof value === 'function' ? value(prev[key]) : value;

          if (prev[key] === nextValue) return prev;
          return { ...prev, [key]: nextValue };
        });
      },
    [setFormValues]
  );

  const setEmail = useMemo(() => setField('email'), [setField]);
  const setPassword = useMemo(() => setField('password'), [setField]);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(loginUser({ email: form.email, password: form.password }));
    },
    [dispatch, form.email, form.password]
  );

  useEffect(() => {
    if (!user || isLoading) return;

    const state = location.state as LocationState | null;
    navigate(state?.from || HOME_PATH, { replace: true });
  }, [user, isLoading, navigate, location.state]);

  return (
    <LoginUI
      errorText={error || ''}
      email={form.email}
      setEmail={setEmail}
      password={form.password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
