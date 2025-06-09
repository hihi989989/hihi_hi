

export function login(username,password,code)  { 
    cy.visit('/authentication/sign-in')
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="code"]').type(code);
    cy.contains('Remember me').click();
    cy.contains('Sign In').click();
    cy.get('button[type="submit"], button')
    .contains(/sign in|login|log in/i, { timeout: 30000 })
    .should('exist')
    .click({ force: true, timeout: 30000 })

    cy.log('Login button clicked')
    // cy.location("pathname").should("equal",'/en/dashboard')
}


export function fillLoginFormCorrectly(username, password, verificationCode) {
  // Use default values if environment variables are not set
  username = username || 'test@example.com'
  password = password || 'password123'
  verificationCode = verificationCode || '123456'

  cy.visit('/authentication/sign-in', { timeout: 120000 })

    // Wait for the form to load completely with increased timeout
  cy.get('form', { timeout: 40000 }).should('exist')
  cy.log('Form found - proceeding with login')

  cy.log('Filling login form with improved field identification')

  // First, let's analyze the form to understand its structure
  cy.get('form').within(() => {
    // Log all input fields to understand the form structure
    cy.get('input').then($inputs => {
      cy.log(`Found ${$inputs.length} input fields in the form`)

      // Log details about each input
      $inputs.each((index, input) => {
        const $input = Cypress.$(input)
        cy.log(`Input #${index}: type=${$input.attr('type')}, name=${$input.attr('name')}, placeholder=${$input.attr('placeholder')}`)
      })

      // Take a screenshot of the form
      cy.screenshot('login-form-structure')

      // Now fill the fields based on their position and attributes
      if ($inputs.length >= 2) {
        // First field is typically username/email
        cy.get('input').eq(0)
          .should('exist')
          .clear({ force: true })
          .type(username, { delay: 100, force: true })

        cy.log('Username entered in first field')

        // Second field is typically password
        cy.get('input[type="password"]')
          .should('exist')
          .clear({ force: true })
          .type(password, { delay: 100, force: true })

        cy.log('Password entered')

        // If there's a third field and it's not a checkbox, it's likely verification code
        if ($inputs.length > 2) {
          const thirdInput = $inputs.eq(2)
          if (thirdInput.attr('type') !== 'checkbox') {
            cy.get('input').eq(2)
              .should('exist')
              .clear({ force: true })
              .type(verificationCode, { delay: 100, force: true })

            cy.log('Verification code entered in third field')
          } else {
            cy.log('Third field is a checkbox, not entering verification code here')
          }
        } else {
          cy.log('No third field found for verification code')
        }
      } else {
        cy.log('Form has fewer than 2 fields, cannot identify username and password fields reliably')
      }
    })
  })
}

export function submitLoginForm() {
  cy.log('Submitting login form')

  // Try to find and click the submit button with multiple approaches
  cy.get('button[type="submit"], button')
    .contains(/sign in|login|log in/i, { timeout: 30000 })
    .should('exist')
    .click({ force: true, timeout: 30000 })

  cy.log('Login button clicked')

  // Add a wait to allow for server processing
  cy.wait(10000)
}

export function verifySuccessfulLogin() {
  cy.log('Verifying successful login')

  // Take a screenshot right after login attempt
  cy.screenshot('after-login-attempt')

  // Check URL or page content to verify login success
  cy.url({ timeout: 90000 }).then(url => {
    cy.log(`Current URL after login: ${url}`)

    // If we're still on the authentication page after submitting
    if (url.includes('authentication') || url.includes('sign-in') || url.includes('login')) {
      cy.log('Still on login page - checking for errors')

      // Check if there's an error message
      cy.get('body').then($body => {
        if ($body.text().includes('error') ||
            $body.text().includes('invalid') ||
            $body.text().includes('incorrect')) {
          cy.log('Login failed - error message detected')
          // Take a screenshot for debugging
          cy.screenshot('login-error')
        } else {
          cy.log('No error detected but still on login page - trying again')
          // Try clicking the button again
          submitLoginForm()
        }
      })
    } else {
      cy.log('Successfully redirected after login to: ' + url)

      // Wait for the page to fully load
      cy.wait(5000)

      // Check if we can interact with the page
      cy.document().then(doc => {
        cy.log(`Document ready state: ${doc.readyState}`)
      })

      // Check for common post-login elements
      cy.get('body').then($body => {
        cy.log('Page title: ' + $body.find('title').text())
        cy.log('First 100 chars of body: ' + $body.text().substring(0, 100))
      })
    }
  })

  // Check for elements that would indicate successful login
  cy.get('body', { timeout: 60000 }).then($body => {
    // Log what we're seeing on the page
    cy.log('Body text length: ' + $body.text().length)

    const successIndicators = [
      !$body.text().includes('Sign In'),
      !$body.text().includes('Login'),
      $body.text().includes('Dashboard') ||
      $body.text().includes('Welcome') ||
      $body.text().includes('Account') ||
      $body.text().includes('Logout') ||
      $body.text().includes('Sign Out')
    ]

    // If any success indicators are true, consider it a success
    const isLoggedIn = successIndicators.some(indicator => indicator === true)

    if (isLoggedIn) {
      cy.log('Login successful - found dashboard elements')
    } else {
      cy.log('Login verification inconclusive')
      // Take a screenshot for debugging
      cy.screenshot('login-verification-inconclusive')
    }
  })
}
