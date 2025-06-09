describe('Darwynn Login - Helper Functions', () => {
  it('should login using helper functions', () => {
    cy.visit('/authentication/sign-in')

    // Using the helper command
    cy.fillFormField([
      'input[name="username"]',
      'input[placeholder*="Username"]',
      'input[type="text"]'
    ], Cypress.env('TEST_USERNAME'))

    cy.fillFormField([
      'input[name="password"]',
      'input[type="password"]'
    ], Cypress.env('TEST_PASSWORD'))

    cy.fillFormField([
      'input[name="verification"]',
      'input[placeholder*="Verification"]'
    ], Cypress.env('VERIFICATION_CODE'))

    cy.get('button').contains(/sign in/i).click()

    cy.url({ timeout: 15000 }).should('not.include', 'authentication')
  })
})
