import { FC, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATHS } from '../../constants/constants';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor } from '../../services/slices/constructor';
import { createOrder, clearOrder } from '../../services/slices/order';
import {
  selectConstructorItems,
  selectOrderData,
  selectOrderRequest,
  selectUser
} from '../../services/selectors';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderData);
  const user = useSelector(selectUser);

  const ingredientIds = useMemo(() => {
    if (!bun) return null;
    const ids = ingredients.map((item) => item._id);
    return [bun._id, ...ids, bun._id];
  }, [bun, ingredients]);

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const onOrderClick = useCallback(() => {
    if (!user) {
      navigate(PATHS.login);
      return;
    }

    if (!ingredientIds || orderRequest) return;

    dispatch(createOrder(ingredientIds));
  }, [user, navigate, ingredientIds, orderRequest, dispatch]);

  const closeOrderModal = useCallback(() => {
    if (!orderModalData) return;

    dispatch(clearConstructor());
    dispatch(clearOrder());
  }, [orderModalData, dispatch]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
