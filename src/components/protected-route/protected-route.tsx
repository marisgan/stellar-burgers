import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { PATHS } from '../../constants/constants';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: JSX.Element;
};

type LocationState = {
  from?: string;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  element
}) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((s) => s.user);

  if (!isAuthChecked) {
    return null;
  }

  const state = location.state as LocationState | null;

  if (onlyUnAuth && user) {
    return <Navigate to={state?.from || PATHS.home} replace />;
  }

  if (!onlyUnAuth && !user) {
    return (
      <Navigate to={PATHS.login} state={{ from: location.pathname }} replace />
    );
  }

  return element;
};
