/// <reference types="cypress" />
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      mockConstructorApi(): Chainable<void>;
      visitHomeWithAuth(): Chainable<void>;
      addIngredientToConstructor(name: string): Chainable<void>;
      openIngredientModal(name: string): Chainable<void>;
      closeModalByButton(): Chainable<void>;
      closeModalByOverlay(): Chainable<void>;
    }
  }
}

export {};
