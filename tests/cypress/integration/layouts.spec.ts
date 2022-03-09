describe('Checking layouts', () => {
  it('shows the section layout on layout page', () => {
    cy.visit('/');
    cy.get('h1').should('contain', 'kollitsch.de');
    cy.htmlvalidate();
  });
});
