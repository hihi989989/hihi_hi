describe('Darwynn Login - Enhanced', () => {
  const baseUrl = 'https://test-csr.darwynnfulfillment.com'
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit(`${baseUrl}/authentication/sign-in`)
  })

  it('should complete full login flow', () => {
    // Get credentials from environment variables
    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')

    // Wait for the form to load completely
    cy.get('form', { timeout: 30000 }).should('be.visible')

    // Work within the form context for better isolation
    cy.get('form').within(() => {
      // Target the first input field (username) and create an alias
      cy.get('input').first().as('usernameField')
      cy.get('@usernameField')
        .should('be.visible')
        .clear()
        .type(username)

      // Target the password field specifically
      cy.get('input[type="password"]').as('passwordField')
      cy.get('@passwordField')
        .should('be.visible')
        .clear()
        .type(password)

      // Target the verification field (assuming it's the last input)
      cy.get('input').then($inputs => {
        // If there are more than 2 inputs (username and password), assume the third is verification
        if ($inputs.length > 2) {
          // Target the third input field (verification code)
          cy.get('input').eq(2)
            .should('be.visible')
            .clear()
            .type(verificationCode)
        } else {
          // Log that verification field wasn't found
          cy.log('Verification field not found - continuing without it')
        }
      })
    })

    // Submit the form - more flexible selector
    cy.get('button[type="submit"], button')
      .contains(/sign in/i)
      .should('be.enabled')
      .click()

    cy.wait(5000)
    // Wait for redirect and verify successful login
    cy.url({ timeout: 60000 }).then(url => {
      // If we're still on the authentication page after submitting
      if (url.includes('authentication')) {
        // Check if there's an error message
        cy.get('body').then($body => {
          if ($body.text().includes('error') || $body.text().includes('invalid')) {
            cy.log('Login failed - error message detected')
          } else {
            // Try clicking the button again if still on login page
            cy.get('button').contains(/sign in/i).click()

            // Now wait for redirect with increased timeout
            cy.url({ timeout: 60000 }).should('not.include', 'authentication')
          }
        })
      } else {
        // We've already been redirected, which is good
        cy.log('Successfully redirected after login')
      }
    })

    // Additional verification that we're no longer on login page
    cy.get('body', { timeout: 30000 }).should('not.contain', 'Sign In')

    // You can add more specific checks for the dashboard/home page
    // cy.get('[data-testid="dashboard"]').should('be.visible')
  })

  it('should handle form validation with better selectors', () => {
    // Test empty form submission
    cy.get('form',  { timeout: 30000 }).within(() => {
      // Try to submit without filling any fields
      cy.get('button').contains(/sign in/i).click()
    })

    // Check for validation errors using flexible selectors
    cy.get('input').first().then($input => {
      // Check if field has error styling or validation state
      const hasErrorClass = $input.hasClass('error') ||
                           $input.hasClass('is-invalid') ||
                           $input.attr('aria-invalid') === 'true';
      const isInvalid = !$input[0].validity.valid;

      // Assert that at least one validation indicator is present
      expect(hasErrorClass || isInvalid).to.be.true;
    })
  })

  it('should handle network errors gracefully', () => {
    // Intercept the login request to simulate network error
    cy.intercept('POST', '**/login', { forceNetworkError: true }).as('loginRequest')
    cy.intercept('POST', '**/auth/**', { forceNetworkError: true }).as('authRequest')


    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')

    cy.get('form', { timeout: 30000 }).within(() => {
      cy.get('input').first().type(username)
      cy.get('input[type="password"]').type(password)
      // Check if verification field exists before attempting to interact with it
      cy.get('input').then($inputs => {
        if ($inputs.length > 2) {
          cy.get('input').eq(2).type('1213', { delay: 100 })
        }
      })
    })

    cy.get('button').contains(/sign in/i).click()

    // Wait for the failed request
    cy.wait(['@loginRequest', '@authRequest'], { timeout: 30000 })
      .its('length')
      .should('be.gte', 0)

    // Check for error message (adjust selector based on your app)
    cy.get('body').then($body => {
      const hasErrorMessage = $body.find('[role="alert"], .error-message, .alert, .error, [class*="error"]').length > 0 ||
                             $body.text().toLowerCase().includes('error') ||
                             $body.text().toLowerCase().includes('failed') ||
                             $body.text().toLowerCase().includes('network');

      expect(hasErrorMessage).to.be.true;
    })
  })
})
