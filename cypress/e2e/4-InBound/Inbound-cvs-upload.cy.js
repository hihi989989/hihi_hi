import dayjs from 'dayjs';
const {
  login,
  handlePopup,
  submitLoginForm,
  verifySuccessfulLogin,
  generateOrderNumber,
  generateAndVerifyOrder,
  getNextWorkday,
  generateInboundExcel

} = require('../../support/founctions');
describe('Darwynn Inventory Navigation Test', () => {

beforeEach(() => {
    //cy.fixture('menu_dir.json').as('subdirs');

    //const username = Cypress.env('TEST_USERNAME')
    //const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')
    //const username =  'peiran-admin'
    //const password =  'Zz!2020101'

    // Login if required
    login(username, password, verificationCode);   
    // Ensure login redirected to dashboard
    //cy.url().should('include', 'dashboard');
    cy.wait(2000)
});

  it('CVS upload batch of orders', () => {

    const inputid = 'NS0048';
    
    const idtext = 'NS0048 Name: EricaL'; 
    
    cy.visit('/app/inbounds')
    cy.contains('button', 'CSV Upload').click();
    //const ExcelJS = require('exceljs');
   // const fs = require('fs');

    cy.contains('h2', 'Import Inbounds Receipt List') 
      .closest('div') 
      .within(() => {
      cy.contains('label', 'Owner ID or Name')
        .parent() 
        .find('input') 
        .should('be.visible') 
        .as('ownerIdInput') 
        .type(inputid)
        .type('{enter}');
     });
   
  });
});


