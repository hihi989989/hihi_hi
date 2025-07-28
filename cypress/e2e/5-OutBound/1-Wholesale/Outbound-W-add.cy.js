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

  it('Fills main form of outbound wholesale order and adds two SKUs', () => {
    
    cy.visit('/app/outbounds/wholesale')
    cy.contains('button', 'Add').click();
    const orderNumber = generateAndVerifyOrder('outbound-W');
    // From Order No.
    cy.get('input[name="fromOrderNo"]').type(orderNumber);
    //cy.get('input[name="Business Type"]').type(orderNumber);



    cy.get('label')
      .contains('Ship from Warehouse')
      .parent()
      .parent()                        // upper level to contain combobox
      .find('input[aria-autocomplete="list"]')
      .type('WHCANON001-Toronto(WH02001)');
    cy.contains('.MuiAutocomplete-option', 'WHCANON001-Toronto(WH02001)', { timeout: 8000 }).click();


    cy.get('label')
      .contains('Carrier')
      .parent()
      .parent()                        // upper level to contain combobox
      .find('input[aria-autocomplete="list"]')
      .type('UPS');
    cy.contains('.MuiAutocomplete-option', 'UPS', { timeout: 8000 }).click();
    cy.get('label')
      .contains('Operation SLA (Service Level Agreement)')
      .parent()
      .parent()                        
      .find('input[aria-autocomplete="list"]')
      .type('Priority - 3hr SLA Rush Order');
    cy.contains('.MuiAutocomplete-option', 'Priority - 3hr SLA Rush Order', { timeout: 8000 }).click();


    cy.get('input[name="expectedShippingDate"]') 
      .parent() 
      .parent() 
      .find('button[aria-label="Choose date"]') 
    cy.get('[role="dialog"]').should('be.visible'); 

    let date = dayjs().add(3, 'day');
    let date2 = dayjs().add(3, 'day');
    let date3 = dayjs().add(3, 'day');
    while (date.day() === 0 || date.day() === 6) {
        date = date.add(1, 'day');
        date2 = date.add(2, 'day');
        date3 = date.add(3, 'day');
    }

    const ExpectedDate = date.format('MM/DD/YYYY'); 
    const RequiredDate = date2.format('MM/DD/YYYY');
    const DueDate = date3.format('MM/DD/YYYY');

    const Weekday = date.format('dddd'); 
    const Weekday2 = date.format('dddd');
    const Weekday3 = date.format('dddd');

    cy.get('input[name="expectedShippingDate"]').clear().type(ExpectedDate);
    cy.get('input[name="requiredDeliveryDate"]').clear().type(RequiredDate);
    cy.get('input[name="dueDate"]').clear().type(DueDate);
    cy.log(`Selected weekday: ${Weekday}`);
    cy.log(`Selected weekday: ${Weekday2}`);
    cy.log(`Selected weekday: ${Weekday3}`);

    cy.get('input[name="soReference1"]').type("Just for auto test reference 1");
    cy.get('input[name="soReference2"]').type("Just for auto test reference 2");
    cy.get('input[name="soReference3"]').type("Just for auto test reference 3");

    cy.get('label')
      .contains('Additional Requirements')
      .parent()
      .parent()
      .find('input[aria-autocomplete="list"]')
      .as('additionalRequirementsInput'); 

    cy.get('@additionalRequirementsInput')
      .type('1–Packing list'); 
    cy.contains('.MuiAutocomplete-option', '1–Packing list', { timeout: 8000 })
      .click(); 
    cy.get('@additionalRequirementsInput')
      .type('2–Invoice'); 
    cy.contains('.MuiAutocomplete-option', '2–Invoice', { timeout: 8000 })
      .click(); 

    cy.get('input[name="noteText"]').type("Test note P@ssW0rd!2#AbC$dEfG%7^8* ");
    

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
      cy.get('[data-field="qty"] input').clear().type('1');             // Quantity
      //cy.get('[data-field="batch"] input').clear().type('BATCH-001');    // Batch No.
      const expirationDate = dayjs().add(2, 'day').format('YYYY-MM-DD');
      //cy.get('[data-field="expirationDate"] input').clear().type(expirationDate);   
      const warehousingDate = dayjs().add(100, 'day').format('YYYY-MM-DD');             
      //cy.get('[data-field="warehousingDate"] input').clear().type(warehousingDate);   

      cy.get('[data-field="actions"] button')
        .eq(0) 
        .click();
   });
    cy.wait (5000);


  // Add 2nd product
    cy.contains('label', 'Select Product')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .type('{downarrow}{downarrow}{downarrow}{enter}');
    cy.wait (5000);
    
  // 3. Quantity（
    cy.get('[data-rowindex="1"]').within(() => {
      cy.get('[data-field="qty"] input').clear().type('1');             // Quantity
      //cy.get('[data-field="batch"] input').clear().type('BATCH-002');    // Batch No.
      const Production_date = dayjs().add(2, 'day').format('YYYY-MM-DD');
      //cy.get('[data-field="productionDate"] input').clear().type(Production_date);   
      const Expried_date = dayjs().add(100, 'day').format('YYYY-MM-DD');             
      //cy.get('[data-field="expirationDate"] input').clear().type(Expried_date);   
      cy.get('[data-field="actions"] button')
        .eq(0) 
        .click();
      });
    }
  });

  


    cy.contains('label', 'Ship to')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .as('shipto')
      .click()
      .type(' ', { delay: 100 }) 
      .type('{backspace}');
    cy.get('body') 
     .find('.MuiAutocomplete-option', { timeout: 8000 })
     .then($options => {
    if ($options.length === 0) {
      throw new Error('There is no valid Ship to info.');
    } else {
  
    cy.contains('label', 'Ship to')
      .parent()
      .find('input[aria-autocomplete="list"]')
      .type('{downarrow}{enter}');
 

    }
  });

    // submit

    cy.get('button[name="action"][value="saveOnly"]').click();
    //cy.contains('button', 'Save only').click();
  });
});

