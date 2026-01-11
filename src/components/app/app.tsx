import { useEffect } from 'react';
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
  protectedRoute
} from '@components';
import '../../index.css';
import styles from './app.module.css';

// type BackgroundLocationState = {
//   background?: Location;
// };

const App = () => (
  // const state = false;
  // const location = useLocation();
  // const state = location.state as BackgroundLocationState | undefined;
  // const navigate = useNavigate();
  // const handleModalClose = () => navigate(-1);

  <div className={styles.app}>
    <AppHeader />
    <Routes>
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/profile/orders' element={<ProfileOrders />} />
      <Route path='*' element={<NotFound404 />} />
      <Route path='/feed/:number' element={<OrderInfo />} />
      <Route path='/ingredients/:id' element={<IngredientDetails />} />
      <Route path='/profile/orders/:number' element={<OrderInfo />} />
    </Routes>

    {/* {state?.background && (
      <Routes>
        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингредиента' onClose={handleModalClose}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route
          path='/feed/:number'
          element={
            <Modal title='' onClose={handleModalClose}>
              <OrderInfo />
            </Modal>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <Modal title='' onClose={handleModalClose}>
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
    )} */}
  </div>
  // );
);

export default App;
