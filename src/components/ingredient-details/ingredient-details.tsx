import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredientById } from '../../services/selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredientData = useSelector(
    id ? selectIngredientById(id) : () => null
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <>
      <h3
        className='text text_type_main-large'
        style={{ textAlign: 'center', marginTop: 30 }}
      >
        Детали ингредиента
      </h3>
      <IngredientDetailsUI ingredientData={ingredientData} />;
    </>
  );
};
