import dayjs from 'dayjs';
import 'cypress-file-upload';

const fs = require('fs');
const path = require('path');

Cypress.Commands.add('attachFileFromCustomFolder', (inputSelector, filePath) => {
  // Get the absolute file path
  const fileAbsolutePath = path.join(Cypress.config('projectRoot'), 'cypress', filePath);
  
  // Ensure that the file exists before proceeding
  if (!fs.existsSync(fileAbsolutePath)) {
    throw new Error(`File not found at path: ${fileAbsolutePath}`);
  }

  // Attach the file using the Cypress file upload plugin
  cy.get(inputSelector).attachFile(fileAbsolutePath);
});

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

    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
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
      const file = 'cypress/downloads/inbound_test.xlsx';
     // cy.get('label[role="button"]').click();
      cy.get('input[type="file"]').invoke('show').selectFile(file);
      cy.wait(5000);
      //cy.get('input[type="file"]').attachFile('example.json');
      //cy.attachFileFromCustomFolder('input[type="file"]', 'hihi_hi/cypress/downloads/inbound_test.xlsx');

     });
   
  });
});


