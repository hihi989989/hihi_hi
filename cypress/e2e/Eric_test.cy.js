import { loginWithEric } from '../support/founctions';

describe('Darwynn Inventory Navigation Test', () => {
  
  before(() => {
    cy.fixture('menu_dir.json').as('subdirs');

    const username = Cypress.env('TEST_USERNAME');
    const password = Cypress.env('TEST_PASSWORD');
    const verificationCode = Cypress.env('VERIFICATION_CODE');

    // Perform login with fixed function
    loginWithEric(username, password, verificationCode);

    // Confirm dashboard URL & user-menu loaded
    //cy.url({ timeout: 15000 }).should('include', '/app/dashboard');
    //cy.get('[data-testid="user-menu"]', { timeout: 15000 }).should('exist');

    cy.screenshot('after-login-success');
    cy.wait(2000);
  });

  it('should be able to access all subdirectories', function() {
    this.subdirs.subdirectories.forEach((subdir) => {
      const fullUrl = `${this.subdirs.baseUrl}${subdir.path}`;

      cy.log(`Testing access to ${subdir.path}`);

      cy.request({
        url: fullUrl,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(subdir.statusCode);
      });

      cy.visit(fullUrl, { timeout: this.subdirs.timeout });

      cy.screenshot(`subdir-${subdir.path.replace(/\//g, '-')}`);
    });
  });
  
  it('should have Orders hung up pages', () => {
    cy.visit('/app/dashboard');
    cy.log('Testing "Orders hung up" hyperlink');
    cy.screenshot('dashboard-before-click');

    cy.get('body').then($body => {
      cy.log('Dashboard content preview:');
      cy.log($body.text().substring(0, 500) + '...');

      cy.screenshot('dashboard-content');

      const hasOrdersHungUpText = $body.text().includes('Orders hung up');
      cy.log(`"Orders hung up" text found: ${hasOrdersHungUpText}`);

      if (hasOrdersHungUpText) {
        cy.contains('Orders hung up').then($link => {
          if ($link.length > 0) {
            cy.log('Found "Orders hung up" link, clicking it...');
            cy.wrap($link).scrollIntoView().screenshot('orders-hung-up-link');
            cy.wrap($link).click({ force: true });

            cy.wait(2000);
            cy.screenshot('after-orders-hung-up-click');

            cy.url().then(url => {
              cy.log(`Current URL after clicking: ${url}`);

              cy.get('body').then($newBody => {
                cy.log('Page content after clicking:');
                cy.log($newBody.text().substring(0, 500) + '...');

                const tables = $newBody.find('table, [role="grid"], .grid, .table');
                cy.log(`Found ${tables.length} tables/grids on the page`);

                if (tables.length > 0) {
                  cy.get('table, [role="grid"], .grid, .table')
                    .first()
                    .scrollIntoView()
                    .screenshot('orders-hung-up-table');
                }
              });
            });
          }
        });
      }
    });
  });
});
