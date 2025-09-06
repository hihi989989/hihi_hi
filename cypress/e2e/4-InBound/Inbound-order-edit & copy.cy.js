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

  it('Edit inbound order and add another SKU', () => {
    
    cy.visit('/app/inbounds')

// Find the label that contains the text 'ASN Status' then choose those orders with status 'created'
    cy.get('label')
      .contains('ASN Status') 
      .parent()
      .parent() 
      .find('input[role="combobox"][aria-autocomplete="list"]') 
      .type('Created {esc}'); 
    //cy.contains('.MuiAutocomplete-option', 'Created', { timeout: 8000 }).click(); 
 
    cy.get('table tbody tr').first().as('firstRow'); 
    cy.get('@firstRow')
      .find('td:nth-child(4)') 
      .find('button').contains('more_vert').first() 
      .click(); 
    cy.get('ul[role="menu"]') 
      .should('be.visible') 
      .find('li[role="menuitem"]') 
      .contains('Edit') 
      .click(); 

    let date = dayjs().add(3, 'day'); 
            while (date.day() === 0 || date.day() === 6) { 
               date = date.add(1, 'day');
    }

    const ExpectedDate = date.format('MM/DD/YYYY'); 
    const Weekday = date.format('dddd'); 
    cy.get('input[name="date"]').clear().type(ExpectedDate);
    cy.log(`Selected weekday: ${Weekday}`);

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
      }
    })

    cy.get('[role="rowgroup"] [role="row"]').last().invoke('attr', 'data-rowindex').then((rowIndex) => {
    cy.log(`The last row's data-rowindex is: ${rowIndex}`);

        cy.get(`[data-rowindex="${rowIndex}"]`).within(() => {
          //cy.get('[data-field="qty"] input').clear().type('10');             // Quantity
          cy.get('[data-field="batch"] input').clear().type('BATCH-00X');    // Batch No.
          const Production_date = dayjs().add(2, 'day').format('YYYY-MM-DD');
          cy.get('[data-field="productionDate"] input').clear().type(Production_date);   
          const Expried_date = dayjs().add(100, 'day').format('YYYY-MM-DD');             
          cy.get('[data-field="expirationDate"] input').clear().type(Expried_date);   
    
          cy.get('[data-field="actions"] button')
            .eq(0) 
            .click();
       });
    });

  cy.contains('button', 'Save').should('not.be.disabled').click();
  });


  it('Copy inbound order and add another SKU', () => {
    
    cy.visit('/app/inbounds')

// Find the label that contains the text 'ASN Status' then choose those orders with status 'created'

    cy.get('table tbody tr').first().as('firstRow'); 
    cy.get('@firstRow')
      .find('td:nth-child(3)') 
      .find('button.MuiButtonBase-root span.material-icons-round:contains("more_vert")') 
      .click(); 
    cy.get('ul[role="menu"]') 
      .should('be.visible') 
      .find('li[role="menuitem"]') 
      .contains('Copy') 
      .click(); 


    //const orderNumber = generateAndVerifyOrder('inbound');
    const CopyOrderNumber = `-COPY`; // Append '-COPY'
    cy.get('input[name="fromOrderNo"]').type(CopyOrderNumber);

    let date = dayjs().add(3, 'day'); 
            while (date.day() === 0 || date.day() === 6) { 
               date = date.add(1, 'day');
    }

    const ExpectedDate = date.format('MM/DD/YYYY'); 
    const Weekday = date.format('dddd'); 
    cy.get('input[name="date"]').clear().type(ExpectedDate);
    cy.log(`Selected weekday: ${Weekday}`);

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
      }
    })

    cy.get('[role="rowgroup"] [role="row"]').last().invoke('attr', 'data-rowindex').then((rowIndex) => {
    cy.log(`The last row's data-rowindex is: ${rowIndex}`);

        cy.get(`[data-rowindex="${rowIndex}"]`).within(() => {
          //cy.get('[data-field="qty"] input').clear().type('10');             // Quantity
          cy.get('[data-field="batch"] input').clear().type('BATCH-00X');    // Batch No.
          const Production_date = dayjs().add(2, 'day').format('YYYY-MM-DD');
          cy.get('[data-field="productionDate"] input').clear().type(Production_date);   
          const Expried_date = dayjs().add(100, 'day').format('YYYY-MM-DD');             
          cy.get('[data-field="expirationDate"] input').clear().type(Expried_date);   
    
          cy.get('[data-field="actions"] button')
            .eq(0) 
            .click();
       });
    });

  cy.contains('button', 'Save').should('not.be.disabled').click();
  });





});

