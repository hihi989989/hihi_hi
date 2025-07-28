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

  it('Fills main form and adds two SKUs', () => {
    
    cy.visit('/app/inbounds')
    cy.contains('button', 'Add').click();
    const orderNumber = generateAndVerifyOrder('inbound');
    // From Order No.
    cy.get('input[name="fromOrderNo"]').type(orderNumber);

    cy.get('input[name="date"]').click();
    cy.get('button[aria-label="Choose date"]').click();
    cy.get('[role="dialog"]').should('be.visible');

    let date = dayjs().add(3, 'day'); // 从明天开始
        while (date.day() === 0 || date.day() === 6) { // 0 = Sunday, 6 = Saturday
           date = date.add(1, 'day');
    }

    const ExpectedDate = date.format('MM/DD/YYYY'); // 格式化成 MM/DD/YYYY
    const Weekday = date.format('dddd'); // 可选：获取星期几，比如 "Monday"


    cy.get('input[name="date"]').clear().type(ExpectedDate);
    cy.log(`Selected weekday: ${Weekday}`);

    cy.get('label')
      .contains('Ship to Warehouse')
      .parent()
      .parent()                        // upper level to contain combobox
      .find('input[aria-autocomplete="list"]')
      .type('WHCANON001-Toronto(WH02001)');
    cy.contains('.MuiAutocomplete-option', 'WHCANON001-Toronto(WH02001)', { timeout: 8000 }).click();

    //Verify if thers is valid product SKU for the owner
    cy.contains('label', 'Select Product')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .as('productInput')
      .click()
      .type(' ', { delay: 100 }) 
      .type('{backspace}');
    cy.get('body') 
     .find('.MuiAutocomplete-option', { timeout: 8000 })
     .then($options => {
    if ($options.length === 0) {
      throw new Error('There is no valid SKU for this Owner');
    } else {
    cy.contains('label', 'Select Product')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .type('{downarrow}{enter}');

  //Input Quality and other fields 
    cy.get('[data-rowindex="0"]').within(() => {
      cy.get('[data-field="qty"] input').clear().type('10');             // Quantity
      cy.get('[data-field="batch"] input').clear().type('BATCH-001');    // Batch No.
      const Production_date = dayjs().add(2, 'day').format('YYYY-MM-DD');
      cy.get('[data-field="productionDate"] input').clear().type(Production_date);   
      const Expried_date = dayjs().add(100, 'day').format('YYYY-MM-DD');             
      cy.get('[data-field="expirationDate"] input').clear().type(Expried_date);   

      cy.get('[data-field="actions"] button')
        .eq(0) 
        .click();
   });


  // Add 2nd product
    cy.contains('label', 'Select Product')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .type('{downarrow}{downarrow}{enter}');
    
    
  // 3. Quantity（
    cy.get('[data-rowindex="1"]').within(() => {
      cy.get('[data-field="qty"] input').clear().type('10');             // Quantity
      cy.get('[data-field="batch"] input').clear().type('BATCH-002');    // Batch No.
      const Production_date = dayjs().add(2, 'day').format('YYYY-MM-DD');
      cy.get('[data-field="productionDate"] input').clear().type(Production_date);   
      const Expried_date = dayjs().add(100, 'day').format('YYYY-MM-DD');             
      cy.get('[data-field="expirationDate"] input').clear().type(Expried_date);   
      cy.get('[data-field="actions"] button')
        .eq(0) 
        .click();
      });
    }
  });

    cy.get('input[name="carrierId"]')
      .clear()
      .type('ABC123');
    cy.get('input[name="carrierOrderNo"]')
      .clear()
      .type('ABC123');


    cy.contains('label', 'Ship from')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .as('shipfrom')
      .click()
      .type(' ', { delay: 100 }) 
      .type('{backspace}');
    cy.get('body') 
     .find('.MuiAutocomplete-option', { timeout: 8000 })
     .then($options => {
    if ($options.length === 0) {
      throw new Error('There is no valid Ship from info.');
    } else {
  
    cy.contains('label', 'Ship from')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .type('{downarrow}{enter}');
 

    }
  });

    // submit
    //cy.contains('button', 'Save').should('not.be.disabled').click();
  });
});

