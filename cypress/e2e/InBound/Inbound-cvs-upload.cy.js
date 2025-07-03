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
    const username =  'peiran-admin'
    const password =  'Zz!2020101'

    // Login if required
    login(username, password, verificationCode);   
    // Ensure login redirected to dashboard
    //cy.url().should('include', 'dashboard');
    cy.wait(2000)
});

  it('CVS upload batch of orders', () => {
    
    cy.visit('/app/inbounds')
    cy.contains('button', 'CSV Upload').click();
    //const ExcelJS = require('exceljs');
   // const fs = require('fs');
   // const path = require('path');

cy.contains('label', 'Owner ID or Name')
  .parents('.MuiFormControl-root')
  .find('input[role="combobox"]')
  .as('ownerInput')

cy.get('@ownerInput')
  .click({ force: true })
  .clear()
  .type('NS0048', { delay: 100 }) // 加 delay 给 debounce 使用

// 等待下拉出现 + 选择
cy.get('.MuiAutocomplete-option', { timeout: 5000 })
  .should('contain.text', 'NS0048 Name: EricaL')
  .click()

// 校验结果
cy.get('@ownerInput')
  .should('have.value', 'NS0048 Name: EricaL')

  });

// 用于 Cypress 中调用
  //const filePath = path.join(__dirname, '../../downloads/inbound_test.xlsx');
  //generateInboundExcel(filePath);



    //const orderNumber = generateAndVerifyOrder('inbound');
    // From Order No.
   
});


