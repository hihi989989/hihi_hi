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

it('Adds a customer',() => {
    cy.visit('/app/returns');
    cy.contains('button','Add').click();



    //cy.contains('button','Add New Address').click();

    cy.get('input[name="fromOrderNo"]').type('666');

    cy.get('input[name="date"]').click();
    cy.get('button[data-timestamp="1756353600000"]').click();
    cy.contains('button','OK').click();

    cy.get('input[name="businessType"]').type('B2B Return{downarrow}{enter}');

    //cy.get('input[name="businessType"]').type('B2B Return{downarrow}{enter}{tab}{tab}{downarrow}{enter}');

    cy.contains('Ship to Warehouse').next().find('input').type('{enter}{downarrow}{downarrow}{enter}');

    cy.get('input[placeholder="Enter Product SKU, SKU Alias or Product Name"]').type(' {downarrow}{enter}');

    cy.get('input[placeholder="Enter Customer ID or Name"]').type(' {uparrow}{enter}');

    //cy.contains('button','Save').click();

    
});

});
