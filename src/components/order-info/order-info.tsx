import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients, selectOrderData } from '../../services/selectors';
import { fetchOrderByNumber } from '../../services/slices/order';

type IngredientWithCount = TIngredient & { count: number };
type IngredientsWithCount = Record<string, IngredientWithCount>;

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const orderData = useSelector(selectOrderData);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!number) return;

    const orderNumber = Number(number);
    if (Number.isNaN(orderNumber)) return;

    dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || ingredients.length === 0) return null;

    const ingredientById = new Map<string, TIngredient>(
      ingredients.map((ing) => [ing._id, ing])
    );

    const ingredientsInfo: IngredientsWithCount = {};

    for (const id of orderData.ingredients) {
      const base = ingredientById.get(id);
      if (!base) continue;

      const existing = ingredientsInfo[id];
      if (existing) {
        existing.count += 1;
      } else {
        ingredientsInfo[id] = { ...base, count: 1 };
      }
    }

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date: new Date(orderData.createdAt),
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return (
    <>
      <p
        className='text text_type_digits-default'
        style={{ textAlign: 'center', marginTop: 30 }}
      >
        #{number}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />;
    </>
  );
};
