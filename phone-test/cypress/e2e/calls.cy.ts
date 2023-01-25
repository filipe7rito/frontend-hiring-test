describe('Calls', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/calls');
  });

  it('Should see calls list', () => {
    cy.contains(/calls history/i).should('be.visible');

    cy.contains(Cypress.env('CYPRESS_E2E_USERNAME')).should('be.visible');
    cy.get('[data-test="pagination-page-1"]').should('be.visible');
  });

  it('Should see calls details', () => {
    cy.contains(/calls history/i).should('be.visible');

    cy.get('[data-testid="call-item"]').eq(1).click();

    cy.contains(/calls details/i).should('be.visible');

    [
      'ID',
      'Type',
      'Created at',
      'Direction',
      'From',
      'Duration',
      'Is archived',
      'To',
      'Via'
    ].forEach(label => {
      cy.contains(label).should('be.visible');
    });
  });
});
