import { FC, SyntheticEvent, useCallback, useEffect, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATHS } from '../../constants/constants';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/slices/user';
import {
  selectUser,
  selectUserError,
  selectUserLoading
} from '../../services/selectors';
import { useForm } from '../../hooks/useForm';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export const Register: FC = () => {
  const [form, , setFormValues] = useForm<RegisterForm>({
    name: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const error = useSelector(selectUserError);
  const isLoading = useSelector(selectUserLoading);

  const setField = useCallback(
    <K extends keyof RegisterForm>(
      key: K
    ): Dispatch<SetStateAction<RegisterForm[K]>> =>
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

  // Чтобы ссылки на сеттеры не менялись на каждый рендер
  const setUserName = useMemo(() => setField('name'), [setField]);
  const setEmail = useMemo(() => setField('email'), [setField]);
  const setPassword = useMemo(() => setField('password'), [setField]);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(registerUser(form));
    },
    [dispatch, form]
  );

  useEffect(() => {
    if (!user || isLoading) return;
    navigate(PATHS.home, { replace: true });
  }, [user, isLoading, navigate]);

  return (
    <RegisterUI
      errorText={error || ''}
      email={form.email}
      userName={form.name}
      password={form.password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
