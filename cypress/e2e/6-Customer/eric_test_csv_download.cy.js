import dayjs from 'dayjs';
const {
  login,
  handlePopup,
  submitLoginForm,
  verifySuccessfulLogin,
  generateOrderNumber,
  generateAndVerifyOrder
} = require('../../support/founctions');
describe('Darwynn Inventory Navigation Test', () => {

beforeEach(() => {
    //cy.fixture('menu_dir.json').as('subdirs');

    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')

    // Login if required
    login(username, password, verificationCode);   
    // Ensure login redirected to dashboard
    //cy.url().should('include', 'dashboard');
    cy.wait(2000)
});

it('randomly picks a customer name from the table', () => {
  cy.visit('/app/customer/owner_customers');
  
    cy.contains('button','CSV Upload').click();
    cy.contains('button','Download').click();
    cy.contains('button','Continue').click();
    cy.contains('button','Choose File').click();
    cy.contains('button','Finish').click();


        });
});

