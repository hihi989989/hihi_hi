import { login, handlePopup, submitLoginForm, verifySuccessfulLogin } from '../support/founctions';
describe('Darwynn Inventory Navigation Test', () => {
  //Add dirs attribute to test
  before(() => {
    cy.fixture('menu_dir.json').as('subdirs');
    // Get credentials from environment variables
    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')

    // Login if required
    login(username, password, verificationCode);
    
    // Ensure login redirected to dashboard
    cy.url().should('include', 'dashboard');
 

    // Wait for URL to change (indicating successful login)
    //cy.url({ timeout: 120000 }).should('not.include', 'authentication')
    // Take a screenshot of what we see after login
    //cy.screenshot('after-login-success')
    // Wait a bit for everything to load
    //cy.wait(10000)
  });



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
  });

    
  })
