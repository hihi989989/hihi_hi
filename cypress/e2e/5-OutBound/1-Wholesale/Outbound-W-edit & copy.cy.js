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

  it('Edit outbound wholesale order and add another SKU', () => {
    
    cy.visit('/app/outbounds/wholesale')

// Find the label that contains the text 'ASN Status' then choose those orders with status 'created'
    cy.get('label')
      .contains('Order Status') 
      .parent()
      .parent() 
      .find('input[role="combobox"][aria-autocomplete="list"]') 
      .type('Action Required'); 
    cy.contains('.MuiAutocomplete-option', 'Action Required', { timeout: 1000 }).click(); 
    cy.get('body').click();
    cy.wait (2000);
 
    cy.get('table tbody tr').first().as('firstRow'); 
    cy.get('@firstRow')
      .find('td:nth-child(4)') 
      .find('button.MuiButtonBase-root span.material-icons-round:contains("more_vert")') 
      .click(); 
    cy.get('ul[role="menu"]') 
      .should('be.visible') 
      .find('li[role="menuitem"]') 
      .contains('Edit') 
      .click(); 
    cy.wait (2000);
    const fromOrderNoSelector = 'input[name="fromOrderNo"]';

    cy.get(fromOrderNoSelector)
      .invoke('val')
      .then((originalValue) => {
    const newValue = `${originalValue}-auto-edit`;
    cy.log(`new from order No.: ${newValue}`);
    cy.get(fromOrderNoSelector) 
      .clear()
      .type(newValue);
    });
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
      .parent()                        
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
              cy.get('[data-field="qty"] input').clear().type('1');                   
              const Production_date = dayjs().add(2, 'day').format('YYYY-MM-DD');      
              const Expried_date = dayjs().add(100, 'day').format('YYYY-MM-DD');           
              cy.get('[data-field="actions"] button')
                .eq(0) 
                .click();
           });
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
    //cy.get('button[name="action"][value="saveOnly"]').click();
  });

  it('Copy wholesale order and add another SKU', () => {
    
    cy.visit('/app/outbounds/wholesale')
    cy.get('table tbody').then(($tbody) => {
  
     const rows = $tbody.find('tr');
     const rowCount = rows.length;

    if (rowCount === 0) {
      cy.log('Error: No data in wholesale order, can not copy order');
      } else if (rowCount > 1) {
         cy.log('Second Row');
         cy.wrap(rows.eq(1))
           .find('td:nth-child(3)')
           .find('button.MuiButtonBase-root span.material-icons-round:contains("more_vert")')
           .click();
      } else { 
         cy.log('First Line');
         cy.wrap(rows.eq(0))
           .find('td:nth-child(3)')
           .find('button.MuiButtonBase-root span.material-icons-round:contains("more_vert")')
           .click();
      }
    });
    cy.get('ul[role="menu"]')
      .should('be.visible')
      .find('li[role="menuitem"]')
      .contains('Copy')
      .click();

    cy.get('ul[role="menu"]')
      .should('be.visible')
      .find('li[role="menuitem"]')
      .contains('Copy')
      .click();

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
         // Batch No.
          const Production_date = dayjs().add(2, 'day').format('YYYY-MM-DD');
          cy.get('[data-field="productionDate"] input').clear().type(Production_date);   
          const Expried_date = dayjs().add(100, 'day').format('YYYY-MM-DD');             
          cy.get('[data-field="expirationDate"] input').clear().type(Expried_date);   
    
          cy.get('[data-field="actions"] button')
            .eq(0) 
            .click();
       });
    });

     //cy.contains('button', 'Save').should('not.be.disabled').click();
  });
 



});

