import { FC, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATHS } from '../../constants/constants';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

const STORAGE_KEYS = {
  resetPassword: 'resetPassword',
  refreshToken: 'refreshToken'
} as const;

export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const hasResetFlag = Boolean(
      localStorage.getItem(STORAGE_KEYS.resetPassword)
    );
    const isAuthed = Boolean(localStorage.getItem(STORAGE_KEYS.refreshToken));

    if (isAuthed) {
      navigate(PATHS.home, { replace: true });
      return;
    }

    if (!hasResetFlag) {
      navigate(PATHS.forgot, { replace: true });
    }
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      setError(null);

      try {
        await resetPasswordApi({ password, token });
        localStorage.removeItem(STORAGE_KEYS.resetPassword);
        navigate(PATHS.login);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    },
    [navigate, password, token]
  );

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
