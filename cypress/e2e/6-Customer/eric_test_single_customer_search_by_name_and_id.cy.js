const tryTypingIntoAvailableInput = (text) => {
    cy.contains('label','Search by Customer ID or Name').next().find('input').clear().type(text);
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
    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')

    // Login
    login(username, password, verificationCode);   
    cy.wait(2000);
  });

  it('randomly picks a customer name from the table and searches it', () => {
    cy.visit('/app/customer/owner_customers', { timeout: 20000 });
    cy.wait(5000);

    cy.get('table tbody tr', { timeout: 10000 }).then(rows => {
      const rowCount = rows.length;
      cy.log(`Total rows: ${rowCount}`);

      const randomIndex = Math.floor(Math.random() * rowCount);
      const randomRow = rows[randomIndex];

      // Wrap and process the selected row
    cy.wrap(randomRow)
    .find('td[data-index="2"]')
    .invoke('text')
    .then((tdText) => {
    cy.log(`Text content of td: ${tdText.trim()}`);
    const cleanedContent = tdText.replace(/^"(.*)"$/, '$1');
    tryTypingIntoAvailableInput(cleanedContent)

    cy.wait(3000);
    tryTypingIntoAvailableInput('{enter}')
    cy.wait(3000);

    cy.get('table tbody tr', { timeout: 10000 }).then(rows => {
      const rowCount = rows.length;
      cy.log(`Total rows: ${rowCount}`);

      const randomIndex = Math.floor(Math.random() * rowCount);
      const randomRow = rows[randomIndex];
    
    cy.wrap(randomRow)
    .find('td[data-index="4"]')
    .invoke('text')
    .then((tdText) => {
    cy.log(`Text content of td: ${tdText.trim()}`);
    const cleanedContent = tdText.replace(/^"(.*)"$/, '$1');
    tryTypingIntoAvailableInput(cleanedContent)
  });
        });
    });
  });
});
});
