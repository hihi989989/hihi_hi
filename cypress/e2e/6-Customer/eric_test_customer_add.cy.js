function generateCustomer() {
  const firstNames = ['Alex', 'Jamie', 'Taylor', 'Jordan', 'Riley', 'Casey'];
  const lastNames = ['Smith', 'Johnson', 'Lee', 'Brown', 'Davis', 'Garcia'];

  const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];

  const fullName = `${randomFirst} ${randomLast}`;
  const customerId = `Auto-CUST-${Math.floor(1000 + Math.random() * 9000)}`; // 6-digit random ID

  return {
    name: fullName,
    id: customerId
  };
}

function generatePhoneNumber() {
  const areaCodes = ['416', '647', '905', '778', '604', '289']; // Canadian area codes (you can change or expand)
  
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)];
  const middle = Math.floor(100 + Math.random() * 900);     // ensures 3 digits, not starting with 0
  const last = Math.floor(1000 + Math.random() * 9000);     // ensures 4 digits

  return `${areaCode}-${middle}-${last}`;
}

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
    cy.visit('/app/customer/owner_customers');
    cy.contains('button','Add').click();

        
    //Generate a customer id and name
    const customer = generateCustomer();
    cy.get('input[name="customerId"]').type(customer.id);
    cy.get('input[name="customerName"]').type(customer.name);


    cy.contains('button','Add New Address').click();

    cy.get('input[name="title"]').type('manager');

    cy.get('input[name="fullName"]').type(customer.name);

    cy.get('input[name="email"]').type('666@qq.com');

    cy.contains('label','Address 1').next().type('33 sadbee Rd');

    //cy.get('input[id=":r1v:"]').type();

    cy.get('input[name="city"]').type('Toronto');

    cy.get('input[name="province"]').type('ohio');

    cy.get('input[name="postcode"]').type('666EEE');

    //cy.contains('button').click();
    //cy.contains('button','Canada - CA').click();
    cy.get('input[name="countryObj"]').type('CANADA - CA');
    cy.get('input[name="countryObj"]') // or any focusable input
      .focus()
      .type('{downarrow}') // press ↓
      //.type('{downarrow}') // press ↓ again (optional)
      .type('{enter}');   
    //cy.get('select[name="countryObj"]').select('Canada');

    const phone = generatePhoneNumber();
    cy.get('input[type="tel"]').type(phone);

    //cy.get('input[type="checkbox"]').check();

    //cy.contains('button','Submit').click();

    
});

});
