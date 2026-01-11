import { FC, SyntheticEvent, useEffect, useCallback, useMemo } from 'react';

import { ProfileUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';
import { updateUser } from '../../services/slices/user';
import { useForm } from '../../hooks/useForm';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const initialForm = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    }),
    [user]
  );

  const [formValue, onChange, setFormValue] = useForm(initialForm);

  useEffect(() => {
    setFormValue((prev) => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user, setFormValue]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    Boolean(formValue.password);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      if (!user) return;

      const payload: { name?: string; email?: string; password?: string } = {};

      if (formValue.name !== user.name) payload.name = formValue.name;
      if (formValue.email !== user.email) payload.email = formValue.email;
      if (formValue.password) payload.password = formValue.password;

      if (!Object.keys(payload).length) return;

      dispatch(updateUser(payload));
      setFormValue((prev) => ({ ...prev, password: '' }));
    },
    [dispatch, formValue, user, setFormValue]
  );

  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue(initialForm);
    },
    [setFormValue, initialForm]
  );

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={onChange}
    />
  );
};
