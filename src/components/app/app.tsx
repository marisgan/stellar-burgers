import { useEffect, useMemo, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';

import '../../index.css';
import styles from './app.module.css';
import { PATHS } from '../../constants/constants';

import { useDispatch } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients';
import { fetchUser, setAuthChecked } from '../../services/slices/user';

type BackgroundLocationState = { background?: Location };

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as BackgroundLocationState | undefined;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser()).finally(() => dispatch(setAuthChecked(true)));
  }, [dispatch]);

  const locationForRoutes = useMemo(
    () => state?.background ?? location,
    [state, location]
  );

  const onModalClose = useCallback(() => navigate(-1), [navigate]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={locationForRoutes}>
        {/* public */}
        <Route path={PATHS.home} element={<ConstructorPage />} />
        <Route path={PATHS.feed} element={<Feed />} />

        {/* only for guests */}
        <Route
          path={PATHS.login}
          element={<ProtectedRoute onlyUnAuth element={<Login />} />}
        />
        <Route
          path={PATHS.register}
          element={<ProtectedRoute onlyUnAuth element={<Register />} />}
        />
        <Route
          path={PATHS.forgot}
          element={<ProtectedRoute onlyUnAuth element={<ForgotPassword />} />}
        />
        <Route
          path={PATHS.reset}
          element={<ProtectedRoute onlyUnAuth element={<ResetPassword />} />}
        />

        {/* protected */}
        <Route
          path={PATHS.profile}
          element={<ProtectedRoute element={<Profile />} />}
        />
        <Route
          path={PATHS.profileOrders}
          element={<ProtectedRoute element={<ProfileOrders />} />}
        />

        {/* details (page) */}
        <Route path={PATHS.feedOrder} element={<OrderInfo />} />
        <Route path={PATHS.ingredient} element={<IngredientDetails />} />
        <Route
          path={PATHS.profileOrder}
          element={<ProtectedRoute element={<OrderInfo />} />}
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path={PATHS.ingredient}
            element={
              <Modal title='Детали ингредиента' onClose={onModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path={PATHS.feedOrder}
            element={
              <Modal title='' onClose={onModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path={PATHS.profileOrder}
            element={
              <ProtectedRoute
                element={
                  <Modal title='' onClose={onModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
