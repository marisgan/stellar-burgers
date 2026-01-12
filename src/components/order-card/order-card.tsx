import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors';
import { MAX_INGREDIENTS } from '../../constants/constants';

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Быстрый доступ по id: O(1) вместо find O(n)
    const ingredientById = new Map<string, TIngredient>(
      ingredients.map((ing) => [ing._id, ing])
    );

    const ingredientsInfo: TIngredient[] = [];
    for (const id of order.ingredients) {
      const ing = ingredientById.get(id);
      if (ing) ingredientsInfo.push(ing);
    }

    const total = ingredientsInfo.reduce((sum, item) => sum + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, MAX_INGREDIENTS);
    const remains = Math.max(0, ingredientsInfo.length - MAX_INGREDIENTS);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date: new Date(order.createdAt)
    };
  }, [ingredients, order]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});
