import dayjs from 'dayjs';
const {
  login,
  handlePopup,
  submitLoginForm,
  verifySuccessfulLogin,
  generateOrderNumber,
  generateAndVerifyOrder
} = require('../../../support/founctions');
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

  it('randomly picks an order name from the table and searches it', () => {
    
    cy.visit('/app/outbounds/wholesale',{timeout: 20000});
    cy.wait(5000);
    cy.get('table tbody tr',{timeput: 10000}).then(rows=>{
        const rowCount = rows.length;
        cy.log(rowCount)

        const randomIndex = Math.floor(Math.random()*rowCount);
        const randomRow=rows[randomIndex]

    });

    cy.wrap(randomRow)
    .find('td[data-index="2"]')
    .invoke('text')
    .then(tdText)=>{
        cy.log(tdText.trim);
        const cleanedText= tdText.replace(/^"(.*)"$/, '$1');
        cy.get('input[id="rl"]').type(cleanedText);
    });

});
});
