const tryTypingIntoAvailableInput = (text) => {
  cy.get('body').then($body => {
    if ($body.find('input[id=":rj:"]').length) {
      cy.get('input[id=":rj:"]').clear().type(text);
    } else if ($body.find('input[id=":rn:"]').length) {
      cy.get('input[id=":rn:"]').clear().type(text);
    } else if ($body.find('input[id=":ri:"]').length) {
      cy.get('input[id=":ri:"]').clear().type(text);
    } else {
      throw new Error('No input field with id :rj:, :rn:, or :ri: was found.');
    }
  });
};

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

it('randomly picks a customer name from the table and searches it', () => {
  cy.visit('/app/customer/owner_customers', { timeout: 10000 });
  cy.get('table tbody tr', { timeout: 10000 }).then(rows => {
    const rowCount = rows.length;
    cy.log(`Total rows: ${rowCount}`);

    const randomIndex = Math.floor(Math.random() * rowCount);
    const randomRow = rows[randomIndex];

  // Wrap the selected row so we can work with it in Cypress
  cy.wrap(randomRow)
    .find('td','data-index="2"')
    //.eq(2) // td at index 2
    .then($td => {
      const el = $td[0];
      const win = el.ownerDocument.defaultView;
      const beforeContent = win
        .getComputedStyle(el, '::before')
        .getPropertyValue('content')
        .replaceAll('"', 'i');

      cy.log(`::before content from td[2]: ${beforeContent}`);
      tryTypingIntoAvailableInput(beforeContent);
      //cy.get('input[id=":rj:"]').clear().type(beforeContent);

});
});
});
});

