import { login, handlePopup, submitLoginForm, verifySuccessfulLogin } from '../support/founctions';
describe('Darwynn Inventory Navigation Test', () => {
  
 /* Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    // when the application throws an uncaught exception
    return false
  })*/
  
  //Add dirs attribute to test
  before(() => {
    cy.fixture('menu_dir.json').as('subdirs');

    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')

    // Login if required
    login(username, password, verificationCode);   
    // Ensure login redirected to dashboard
    cy.url().should('include', 'dashboard');
    //cy.url({ timeout: 120000 }).should('not.include', 'authentication')
    // Take a screenshot of what we see after login
    cy.screenshot('after-login-success')
    // Wait a bit for everything to load
    cy.wait(2000)
  });

  // Add an event listener to handle uncaught exceptions
  it('should be able to access all subdirectories', function() {
    this.subdirs.subdirectories.forEach((subdir) => {
      const fullUrl = `${this.subdirs.baseUrl}${subdir.path}`;
      
      cy.log(`Testing access to ${subdir.path}`);
      
      // Test HTTP status code
      cy.request({
        url: fullUrl,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(subdir.statusCode);
      });

      // Visit the page for content testing
      cy.visit(fullUrl, {
        timeout: this.subdirs.timeout
      });

      // Verify page title
      /*if (subdir.expectedTitle) {
        cy.title().should('include', subdir.expectedTitle);
      }*/

      // Verify multiple content pieces
      /*subdir.expectedContent.forEach((content) => {
        cy.contains(content, { timeout: this.subdirs.timeout }).should('be.visible');
      });*/

      // Optional: Take screenshot for visual reference
      cy.screenshot(`subdir-${subdir.path.replace(/\//g, '-')}`);
    });
    cy.visit('/app/dashboard');
  });
  

  it('should have Orders hung up pages', () => {

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
            cy.wait(2000)
            
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
            //cy.go('back')
            //cy.wait(2000)
            //cy.screenshot('back-to-dashboard')
          } 
        })
      } 
    })
  })
    
})
