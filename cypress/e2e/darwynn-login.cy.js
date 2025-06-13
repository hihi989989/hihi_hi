describe('Darwynn Login Tests', () => {
  const baseUrl = 'https://test-csr.darwynnfulfillment.com'
  
  beforeEach(() => {
    cy.visit(`${baseUrl}/authentication/sign-in`)
  })

  it('should login successfully with valid credentials', () => {
    // Fill in username
    cy.get('input[placeholder*="Username"]')
      .should('be.visible')
      .type('your-username')

    // Fill in password
    cy.get('input[type="password"]')
      .should('be.visible')
      .type('your-password')

    // Handle verification code (if it's a static code for testing)
    cy.get('input[placeholder*="Verification"]')
      .should('be.visible')
      .type('verification-code') // Replace with actual test verification code

    // Check "Remember me" if needed
    cy.get('input[type="checkbox"]').check()

    // Click Sign In button
    cy.get('button')
      .contains('SIGN IN')
      .should('be.enabled')
      .click()

    // Verify successful login (adjust based on redirect URL)
    cy.url().should('not.include', '/sign-in')
    // Add more specific assertions based on the dashboard/home page
  })

  it('should show validation errors for empty fields', () => {
    // Try to submit without filling fields
    cy.get('button').contains('SIGN IN').click()
    
    // Check for validation messages (adjust selectors based on actual error display)
    cy.get('input[placeholder*="Username"]').should('have.class', 'error')
    cy.get('input[type="password"]').should('have.class', 'error')
  })

  it('should handle invalid credentials', () => {
    cy.get('input[placeholder*="Username"]').type('invalid-user')
    cy.get('input[type="password"]').type('wrong-password')
    cy.get('input[placeholder*="Verification"]').type('123456')
    
    cy.get('button').contains('SIGN IN').click()
    
    // Check for error message (adjust selector based on actual error display)
    cy.get('[role="alert"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Invalid')
  })
})
