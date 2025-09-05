const tryTypingIntoAvailableInput = (text) => {
    cy.get('body').then($body => {
    if ($body.find('input[id=":rm:"]').length) {
      cy.get('input[id=":rm:"]').clear().type(text);
    } else if ($body.find('input[id=":rl:"]').length) {
      cy.get('input[id=":rl:"]').clear().type(text);
    } else {
      throw new Error('No input field with id :rm:, :rl: was found.');
    }
}
)};

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

        cy.wrap(randomRow)
        .find('td[data-index="2"]')
        .invoke('text')
        .then((tdText) => {
            cy.log(tdText.trim);
            const cleanedText= tdText.replace(/^"(.*)"$/, '$1');
            tryTypingIntoAvailableInput(cleanedText);
        cy.wait(5000);
        });
    });

});

  it('randomly picks multiple order name from the table and searches them', () => {
    
    cy.visit('/app/outbounds/wholesale',{timeout: 20000});
    cy.wait(5000);
    cy.get('table tbody tr',{timeput: 10000}).then(rows=>{
        const rowCount = rows.length;
        cy.log(rowCount);
        let repeats = Math.floor(Math.random()*rowCount)+1;

        let list = [];

        for (let i = 0; i < repeats; i+=1){

            let randomIndex = Math.floor(Math.random()*rowCount);
            let randomRow=rows[randomIndex];

            cy.wrap(randomRow)
            .find('td[data-index="2"]')
            .invoke('text')
            .then((tdText) => {
                cy.log(tdText.trim);
                let cleanedText= tdText.replace(/^"(.*)"$/, '$1');
                list.push(cleanedText);
            

            });
        };

       cy.contains('button','help').click();
        cy.wait(2000);
        
        cy.get('button[aria-label="Close"]').click();

        cy.contains('Batch Orders No.').next().find('input').click();
        handlePopup(),

        list.forEach((item) => {
            cy.contains('Enter Order Numbers, One Per Line').next().find('input').type('${item}{enter}');
             });
        cy.contains('button','Enter').click();
    cy.wait(5000);

});
});
});

