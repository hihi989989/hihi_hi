// Add to cypress/support/commands.js
Cypress.Commands.add('fillFormField', (fieldIdentifiers, value) => {
  cy.get(fieldIdentifiers.join(', '))
    .first()
    .should('be.visible')
    .clear()
    .type(value)
})

Cypress.Commands.add('login',(username,password,code)=>{
    cy.visit('/')
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="code"]').type(code);
    cy.contains('Remember me').click();
    cy.contains('Sign In').click();
    // cy.location("pathname").should("equal",'/en/dashboard')
})