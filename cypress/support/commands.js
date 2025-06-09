// Add to cypress/support/commands.js
Cypress.Commands.add('fillFormField', (fieldIdentifiers, value) => {
  cy.get(fieldIdentifiers.join(', '))
    .first()
    .should('be.visible')
    .clear()
    .type(value)
})
