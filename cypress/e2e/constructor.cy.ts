import { SELECTORS } from '../support/selectors';

const apiBaseUrl = Cypress.env('apiBaseUrl');

const INGREDIENTS = {
  bun: 'Краторная булка',
  filling: 'Мясо бессмертных моллюсков',
  sauce: 'Соус с шипами антории'
} as const;

const aliases = {
  getIngredients: 'getIngredients',
  getUser: 'getUser',
  createOrder: 'createOrder',
  refreshToken: 'refreshToken'
} as const;

const setAuth = (win: Window) => {
  win.localStorage.setItem('refreshToken', 'test-refresh-token');
  win.document.cookie = 'accessToken=Bearer test-access-token';
};

const visitHome = () => {
  cy.visit('/', { onBeforeLoad: setAuth });
  cy.wait([`@${aliases.getIngredients}`, `@${aliases.getUser}`]);
};

const addIngredientToConstructor = (name: string) => {
  cy.contains(SELECTORS.ingredientCard, name)
    .should('exist')
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
};

const openIngredientModal = (name: string) => {
  cy.contains(SELECTORS.ingredientCard, name)
    .find(SELECTORS.ingredientLink)
    .click();
  cy.get(SELECTORS.modal).should('be.visible').and('contain.text', name);
};

const closeModalByButton = () => {
  cy.get(SELECTORS.modalClose).click();
  cy.get(SELECTORS.modal).should('not.exist');
};

const closeModalByOverlay = () => {
  cy.get(SELECTORS.modalOverlay).click({ force: true });
  cy.get(SELECTORS.modal).should('not.exist');
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', `${apiBaseUrl}/ingredients`, { fixture: 'ingredients.json' }).as(
      aliases.getIngredients
    );

    cy.intercept('GET', `${apiBaseUrl}/auth/user`, { fixture: 'user.json' }).as(
      aliases.getUser
    );

    cy.intercept('POST', `${apiBaseUrl}/orders`, (req) => {
      expect(req.body).to.have.property('ingredients');
      req.reply({ fixture: 'order.json' });
    }).as(aliases.createOrder);

    cy.intercept('POST', `${apiBaseUrl}/auth/token`, {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'Bearer mocked-access-token',
        refreshToken: 'mocked-refresh-token'
      }
    }).as(aliases.refreshToken);

    visitHome();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => win.localStorage.clear());
  });

  it('Добавление ингредиентов из списка в конструктор (булка + начинка)', () => {
    addIngredientToConstructor(INGREDIENTS.bun);
    addIngredientToConstructor(INGREDIENTS.filling);

    cy.get(SELECTORS.constructor).should('contain.text', `${INGREDIENTS.bun} (верх)`);
    cy.get(SELECTORS.constructorItem)
      .should('have.length', 1)
      .first()
      .should('contain.text', INGREDIENTS.filling);
    cy.get(SELECTORS.constructor).should('contain.text', `${INGREDIENTS.bun} (низ)`);
  });

  it('Открытие модалки ингредиента и закрытие по крестику и по оверлею', () => {
    openIngredientModal(INGREDIENTS.bun);
    closeModalByButton();

    visitHome();
    cy.get(SELECTORS.ingredientCard).should('have.length.at.least', 1);

    openIngredientModal(INGREDIENTS.filling);
    closeModalByOverlay();
  });

  it('Закрытие модалки ингредиента по клавише Escape', () => {
    openIngredientModal(INGREDIENTS.bun);

    cy.get('body').type('{esc}');
    cy.get(SELECTORS.modal).should('not.exist');
  });

  it('Создание заказа и очищение конструктора после закрытия модалки', () => {
    addIngredientToConstructor(INGREDIENTS.bun);
    addIngredientToConstructor(INGREDIENTS.filling);
    addIngredientToConstructor(INGREDIENTS.sauce);

    cy.contains('button', 'Оформить заказ').click();

    cy.wait(`@${aliases.createOrder}`).then(({ request, response }) => {
      const body = request.body as { ingredients: string[] };
      expect(body.ingredients).to.have.length(4);

      expect(response?.statusCode).to.eq(200);
      const orderBody = response?.body as { order: { number: number } } | undefined;
      expect(orderBody?.order.number).to.eq(654321);
    });

    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.orderNumber).should('have.text', '654321');

    closeModalByButton();

    cy.get(SELECTORS.constructorItem).should('have.length', 0);
    cy.get(SELECTORS.constructor)
      .should('contain.text', 'Выберите булки')
      .and('contain.text', 'Выберите начинку');
  });
});
