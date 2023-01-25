import '@testing-library/cypress/add-commands';

/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'https://frontend-test-api.aircall.dev/auth/login',
    body: {
      username: Cypress.env('CYPRESS_E2E_USERNAME'),
      password: Cypress.env('CYPRESS_E2E_PASSWORD')
    }
  }).then(resp => {
    const { access_token, refresh_token } = resp.body;
    console.log('access_token', access_token);
    window.localStorage.setItem('access_token', JSON.stringify(access_token));
    window.localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
  });
});
