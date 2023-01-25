describe('Auth', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#email').type(Cypress.env('CYPRESS_E2E_USERNAME'));
    cy.get('#password').type(Cypress.env('CYPRESS_E2E_PASSWORD'));
    cy.findByRole('button', {
      name: /login/i
    }).click();
  });

  it('Should login sucessfully', () => {
    cy.contains('logout').should('be.visible');
    cy.contains(/calls history/i).should('be.visible');
  });

  it('Should logout sucessfully', () => {
    cy.contains('logout').should('be.visible');
    cy.contains(/calls history/i).should('be.visible');

    cy.findByRole('button', {
      name: /logout/i
    }).click();

    cy.contains('logout').should('not.exist');
    cy.contains(/calls history/i).should('not.exist');
  });
});
