/// <reference types="cypress" />

import { ALIASES } from './aliases'
import { SELECTORS } from './selectors';

const apiBaseUrl = Cypress.env('apiBaseUrl');

const setAuth = (win: Window) => {
  win.localStorage.setItem('refreshToken', 'test-refresh-token');
  win.document.cookie = 'accessToken=Bearer test-access-token';
};

Cypress.Commands.add('mockConstructorApi', () => {
  cy.intercept('GET', `${apiBaseUrl}/ingredients`, { fixture: 'ingredients.json' }).as(
    ALIASES.getIngredients
  );

  cy.intercept('GET', `${apiBaseUrl}/auth/user`, { fixture: 'user.json' }).as(
    ALIASES.getUser
  );

  cy.intercept('POST', `${apiBaseUrl}/orders`, (req) => {
    expect(req.body).to.have.property('ingredients');
    req.reply({ fixture: 'order.json' });
  }).as(ALIASES.createOrder);

  cy.intercept('POST', `${apiBaseUrl}/auth/token`, {
    statusCode: 200,
    body: {
      success: true,
      accessToken: 'Bearer mocked-access-token',
      refreshToken: 'mocked-refresh-token'
    }
  }).as(ALIASES.refreshToken);
});

Cypress.Commands.add('visitHomeWithAuth', () => {
  cy.visit('/', { onBeforeLoad: setAuth });
  cy.wait([`@${ALIASES.getIngredients}`, `@${ALIASES.getUser}`]);
});

Cypress.Commands.add('addIngredientToConstructor', (name: string) => {
  cy.contains(SELECTORS.ingredientCard, name)
    .should('exist')
    .within(() => {
      cy.contains('button', 'Добавить').click();
    });
});

Cypress.Commands.add('openIngredientModal', (name: string) => {
  cy.contains(SELECTORS.ingredientCard, name)
    .find(SELECTORS.ingredientLink)
    .click();

  cy.get(SELECTORS.modal).should('be.visible').and('contain.text', name);
});

Cypress.Commands.add('closeModalByButton', () => {
  cy.get(SELECTORS.modalClose).click();
  cy.get(SELECTORS.modal).should('not.exist');
});

Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get(SELECTORS.modalOverlay).click({ force: true });
  cy.get(SELECTORS.modal).should('not.exist');
});
