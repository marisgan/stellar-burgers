/// <reference types="cypress" />

import { ALIASES } from '../support/aliases';
import { SELECTORS } from '../support/selectors';

const INGREDIENTS = {
  bun: 'Краторная булка',
  filling: 'Мясо бессмертных моллюсков',
  sauce: 'Соус с шипами антории'
} as const;

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.mockConstructorApi();
    cy.visitHomeWithAuth();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => win.localStorage.clear());
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.addIngredientToConstructor(INGREDIENTS.bun);
    cy.addIngredientToConstructor(INGREDIENTS.filling);

    cy.get(SELECTORS.constructor).should('contain.text', `${INGREDIENTS.bun} (верх)`);
    cy.get(SELECTORS.constructorItem)
      .should('have.length', 1)
      .first()
      .should('contain.text', INGREDIENTS.filling);
    cy.get(SELECTORS.constructor).should('contain.text', `${INGREDIENTS.bun} (низ)`);
  });

  it('открывает и закрывает модальное окно ингредиента по кнопке и оверлею', () => {
    cy.openIngredientModal(INGREDIENTS.bun);
    cy.closeModalByButton();

    cy.visitHomeWithAuth();

    cy.openIngredientModal(INGREDIENTS.filling);
    cy.closeModalByOverlay();
  });

  it('закрывает модальное окно ингредиента по клавише Escape', () => {
    cy.openIngredientModal(INGREDIENTS.bun);

    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('создает заказ и очищает конструктор после закрытия модалки', () => {
    cy.addIngredientToConstructor(INGREDIENTS.bun);
    cy.addIngredientToConstructor(INGREDIENTS.filling);
    cy.addIngredientToConstructor(INGREDIENTS.sauce);

    cy.contains('button', 'Оформить заказ').click();

    cy.wait(`@${ALIASES.createOrder}`).then(({ request, response }) => {
      const body = request.body as { ingredients: string[] };
      expect(body.ingredients).to.have.length(4);

      expect(response?.statusCode).to.eq(200);
      const orderBody = response?.body as { order: { number: number } } | undefined;
      expect(orderBody?.order.number).to.eq(654321);
    });

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.orderNumber).should('have.text', '654321');

    cy.closeModalByButton();

    cy.get(SELECTORS.constructorItem).should('have.length', 0);
    cy.get(SELECTORS.constructor)
      .should('contain.text', 'Выберите булки')
      .and('contain.text', 'Выберите начинку');
  });
});
