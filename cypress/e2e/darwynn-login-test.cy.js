import { login, handlePopup, submitLoginForm, verifySuccessfulLogin } from '../support/founctions';
describe('Darwynn Inventory Navigation Test', () => {
  // Add an event listener to handle uncaught exceptions
  Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    // when the application throws an uncaught exception
    return false
  })

  it('should login and navigate to all inventory sub-pages', () => {
    // Get credentials from environment variables
    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')

    // Login if required
    login(username, password, verificationCode);
    
    // Ensure login redirected to dashboard
    cy.url().should('include', 'dashboard');
 
    // Increase page load timeout
    //Cypress.config('pageLoadTimeout', 180000) // 3 minutes
    // Set a larger viewport size
    //cy.viewport(1920, 1080)
    // Visit the login page
    //cy.visit('/authentication/sign-in', { timeout: 180000 })
    // Wait for login form
    //cy.get('form', { timeout: 90000 }).should('exist')
    // Fill login form
    /*cy.get('form').within(() => {
      // Username/email field
      cy.get('input').first()
        .should('exist')
        .clear({ force: true })
        .type(username || 'test@example.com', { delay: 100, force: true })
      // Password field
      cy.get('input[type="password"]')
        .should('exist')
        .clear({ force: true })
        .type(password || 'password123', { delay: 100, force: true })

      // Verification code field (if it exists)
      cy.get('input').then($inputs => {
        if ($inputs.length > 2) {
          // Assuming the third input is for verification code
          cy.get('input').eq(2)
            .should('exist')
            .clear({ force: true })
            .type(verificationCode || '123456', { delay: 100, force: true })
        }
      })
    })

    // Submit login form
    cy.get('button[type="submit"], button')
      .contains(/sign in|login|log in/i, { timeout: 30000 })
      .should('exist')
      .click({ force: true })*/

    // Wait for URL to change (indicating successful login)
    cy.url({ timeout: 120000 }).should('not.include', 'authentication')

    // Take a screenshot of what we see after login
    cy.screenshot('after-login-success')

    // Wait a bit for everything to load
    cy.wait(10000)
    
    // Test clicking on "Orders hung up" hyperlink
    cy.log('Testing "Orders hung up" hyperlink')
    cy.screenshot('dashboard-before-click')
    
    // Look for the "Orders hung up" link with various selectors
    cy.get('body').then($body => {
      // Log what we see on the dashboard
      cy.log('Dashboard content preview:')
      cy.log($body.text().substring(0, 500) + '...')
      
      // Take a screenshot of the dashboard
      cy.screenshot('dashboard-content')
      
      // Check if "Orders hung up" text exists on the page
      const hasOrdersHungUpText = $body.text().includes('Orders hung up')
      cy.log(`"Orders hung up" text found: ${hasOrdersHungUpText}`)
      
      if (hasOrdersHungUpText) {
        // Try to find and click the link
        cy.contains('Orders hung up').then($link => {
          if ($link.length > 0) {
            cy.log('Found "Orders hung up" link, clicking it...')
            cy.wrap($link).scrollIntoView().screenshot('orders-hung-up-link')
            cy.wrap($link).click({ force: true })
            
            // Wait for page to load after click
            cy.wait(10000)
            
            // Take a screenshot after clicking
            cy.screenshot('after-orders-hung-up-click')
            
            // Verify we navigated to a different page
            cy.url().then(url => {
              cy.log(`Current URL after clicking: ${url}`)
              
              // Check page content
              cy.get('body').then($newBody => {
                cy.log('Page content after clicking:')
                cy.log($newBody.text().substring(0, 500) + '...')
                
                // Look for tables or data
                const tables = $newBody.find('table, [role="grid"], .grid, .table')
                cy.log(`Found ${tables.length} tables/grids on the page`)
                
                if (tables.length > 0) {
                  cy.get('table, [role="grid"], .grid, .table')
                    .first()
                    .scrollIntoView()
                    .screenshot('orders-hung-up-table')
                }
              })
            })
            
            // Navigate back to dashboard
            cy.go('back')
            cy.wait(5000)
            cy.screenshot('back-to-dashboard')
          } else {
            cy.log('Could not find clickable "Orders hung up" link')
            
            // Try alternative approach - look for any links that might be related
            cy.get('a').each($a => {
              const text = $a.text().trim()
              cy.log(`Link text: "${text}"`)
              
              if (text.includes('order') || text.includes('hung') || text.includes('pending')) {
                cy.log(`Found potentially related link: "${text}"`)
                cy.wrap($a).scrollIntoView().screenshot(`potential-link-${text.replace(/\s+/g, '-')}`)
              }
            })
          }
        })
      } else {
        cy.log('Could not find "Orders hung up" text on the dashboard')
        
        // Try to find any order-related links
        cy.log('Looking for any order-related links...')
        cy.get('a').each($a => {
          const text = $a.text().trim()
          if (text.includes('order') || text.includes('pending') || text.includes('status')) {
            cy.log(`Found order-related link: "${text}"`)
            cy.wrap($a).scrollIntoView().screenshot(`order-related-link-${text.replace(/\s+/g, '-')}`)
            
            // Click on the first order-related link we find
            cy.wrap($a).click({ force: true })
            cy.wait(8000)
            cy.screenshot(`after-clicking-${text.replace(/\s+/g, '-')}`)
            
            // Go back to dashboard
            cy.go('back')
            cy.wait(5000)
            
            // Break the each loop after clicking the first link
            return false
          }
        })
      }
    })
    
    // Function to handle pop-up if it appears
    const handlePopup = () => {
      // Check if the pop-up exists
      cy.get('body').then($body => {
        // Look for the pop-up with the specific message
        const hasPopup = $body.text().includes('Unable to find')

        if (hasPopup) {
          cy.log('Found "Unable to find" pop-up, attempting to close it')
          cy.screenshot('popup-detected')
          
          // Try different approaches to close the pop-up
          // Approach 1: Look for close button
          cy.get('button.close, .modal-close, [aria-label="Close"], .close-button, button:contains("Close"), button:contains("OK"), button:contains("Cancel")')
            .then($closeButtons => {
              if ($closeButtons.length > 0) {
                cy.wrap($closeButtons).first().click({ force: true })
                cy.log('Clicked close button on pop-up')
              } else {
                // Approach 2: Try clicking outside the modal
                cy.get('body').click(10, 10, { force: true })
                cy.log('Attempted to click outside the pop-up')

                // Approach 3: Try pressing Escape key
                cy.get('body').type('{esc}', { force: true })
                cy.log('Pressed Escape key to close pop-up')
              }
            })

          // Take a screenshot after attempting to close
          cy.wait(1000)
          cy.screenshot('after-popup-close-attempt')
        }
      })
    }

    // Test Inventory Stock page
    cy.log('Testing Inventory Stock page')
    cy.visit('/app/inventory/Inventory_stock', { timeout: 180000, failOnStatusCode: false })
    cy.wait(8000)
    handlePopup() // Handle pop-up if it appears
    cy.screenshot('inventory-stock', { capture: 'viewport' })
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.get('table, [role="grid"], .grid, .table').then($tables => {
      if ($tables.length > 0) {
        cy.get('table, [role="grid"], .grid, .table')
          .first()
          .scrollIntoView()
          .screenshot('inventory-stock-table', { capture: 'viewport' })
      }
    })

    // Test Product page
    cy.log('Testing Product page')
    cy.visit('/app/inventory/products', { timeout: 180000, failOnStatusCode: false })
    cy.wait(8000)
    handlePopup() // Handle pop-up if it appears
    cy.screenshot('products', { capture: 'viewport' })
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.get('table, [role="grid"], .grid, .table').then($tables => {
      if ($tables.length > 0) {
        cy.get('table, [role="grid"], .grid, .table')
          .first()
          .scrollIntoView()
          .screenshot('products-table', { capture: 'viewport' })
      }
    })

    // Test Kit Management page
    cy.log('Testing Kit Management page')
    cy.visit('/app/inventory/kit_management', { timeout: 180000, failOnStatusCode: false })
    cy.wait(8000)
    handlePopup() // Handle pop-up if it appears
    cy.screenshot('kit-management', { capture: 'viewport' })
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.get('table, [role="grid"], .grid, .table').then($tables => {
      if ($tables.length > 0) {
        cy.get('table, [role="grid"], .grid, .table')
          .first()
          .scrollIntoView()
          .screenshot('kit-management-table', { capture: 'viewport' })
      }
    })

    // Test Packaging page
    cy.log('Testing Packaging page')
    cy.visit('/app/inventory/packaging', { timeout: 180000, failOnStatusCode: false })
    cy.wait(8000)
    handlePopup() // Handle pop-up if it appears
    cy.screenshot('packaging', { capture: 'viewport' })
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.get('table, [role="grid"], .grid, .table').then($tables => {
      if ($tables.length > 0) {
        cy.get('table, [role="grid"], .grid, .table')
          .first()
          .scrollIntoView()
          .screenshot('packaging-table', { capture: 'viewport' })
      }
    })

    // Test SKU Mapping page
    cy.log('Testing SKU Mapping page')
    cy.visit('/app/inventory/sku_mapping', { timeout: 180000, failOnStatusCode: false })
    cy.wait(8000)
    handlePopup() // Handle pop-up if it appears
    cy.screenshot('sku-mapping', { capture: 'viewport' })
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.get('table, [role="grid"], .grid, .table').then($tables => {
      if ($tables.length > 0) {
        cy.get('table, [role="grid"], .grid, .table')
          .first()
          .scrollIntoView()
          .screenshot('sku-mapping-table', { capture: 'viewport' })
      }
    })

    // Test SKU Mapping page
    cy.log('Testing Customer page')
    cy.visit('app/customer/owner_customers', { timeout: 180000, failOnStatusCode: false })
    cy.wait(8000)
    handlePopup() // Handle pop-up if it appears
    cy.screenshot('sku-mapping', { capture: 'viewport' })
    cy.get('body', { timeout: 30000 }).should('exist')
    cy.get('table, [role="grid"], .grid, .table').then($tables => {
      if ($tables.length > 0) {
        cy.get('table, [role="grid"], .grid, .table')
          .first()
          .scrollIntoView()
          .screenshot('customer_address-table', { capture: 'viewport' })
      }
    })
  })
})
