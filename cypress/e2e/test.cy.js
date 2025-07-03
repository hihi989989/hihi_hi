import { login, handlePopup, submitLoginForm, verifySuccessfulLogin } from '../support/founctions';

describe('Darwynn Inventory Navigation Test', () => {

beforeEach(() => {
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
    cy.log("ran before");
    // Wait a bit for everything to load
    cy.wait(2000)
  });


  it('should be able to access all subdirectories', function() {
    
    cy.visit('/app/inventory/Inventory_stock', { timeout: 2000, failOnStatusCode: false })
  });

    it('should be able to access all subdirectories', function() {

   cy.visit('/app/returns', { timeout: 2000, failOnStatusCode: false })
  });
    
  });

