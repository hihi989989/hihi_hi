

import { login, submitLoginForm, verifySuccessfulLogin } from'../support/founctions';



describe('Darwynn Dashboard Test', () => {
    const baseUrl = 'https://test-csr.darwynnfulfillment.com'
    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    const verificationCode = Cypress.env('VERIFICATION_CODE')

  

  before(() => {
    // Login if required
    login(username, password, verificationCode);

    // Ensure login redirected to dashboard
    cy.url().should('include', 'dashboard');
  }); 

  const subpages = [
    {
      name: 'Inventory',
      path: '/app/inventory/products',
      checkText: 'Products',
      children: [
        { name: 'Monthly Reports', path: 'app/inventory/products', checkText: 'Monthly Summary' },
        { name: 'Annual Reports', path: 'app/inventory/products', checkText: 'Annual Summary' }
      ]
    },
  ];

  subpages.forEach((page) => {
    it(`Navigates to ${page.name} and verifies`, () => {
      cy.visit(page.path);
      cy.contains(page.checkText).should('be.visible');

      page.children.forEach((child) => {
        it(`Navigates to ${child.name} under ${page.name}`, () => {
          cy.visit(child.path);
          cy.contains(child.checkText).should('be.visible');
        });
      });
    });
  });
});