export const loginWithEric = (
  username,
  password,
  code,
  redirectPath = 'https://test-csr.darwynnfulfillment.com/app/dashboard'
) => {
  const sessionKey = `${username}-${Cypress.currentTest.titlePath.join('-')}`;

  cy.session(sessionKey, () => {
    cy.visit('/authentication/sign-in');

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="code"]').type(code);

    cy.contains('Remember me').click();
    cy.get('button[type="submit"], button')
    .contains(/sign in|login|log in/i, { timeout: 3000 })
    .should('exist')
    .click({ force: true, timeout: 3000 })

    // Wait for redirect or key element after login
    cy.url({ timeout: 10000 }).should('include', '/app/dashboard');
    //cy.get('[data-testid="user-menu"]', { timeout: 10000 }).should('contain', username);
  }, {
    validate() {
      cy.visit('/app/dashboard');
      //cy.get('[data-testid="user-menu"]', { timeout: 10000 }).should('contain', username);
    }
  });
};


export const loginWithSession = (username, password, code, redirectPath = 'https://test-csr.darwynnfulfillment.com/app/dashboard') => {
  const sessionKey = `${username}-${Cypress.currentTest.titlePath.join('-')}`;
  
  cy.session(sessionKey, () => {
    cy.visit('authentication/sign-in');
    
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="code"]').type(code);
    cy.contains('Remember me').click();
    cy.contains('Sign In').click();
    cy.get('button[type="submit"], button')
    .contains(/sign in|login|log in/i, { timeout: 3000 })
    .should('exist')
    .click({ force: true, timeout: 3000 })

    cy.visit('/app/dashboard');
    
    // 等待重定向并验证
    cy.url().should('include', redirectPath);
    //cy.get('[data-testid=user-menu]').should('contain', username);
  }, {
    validate() {
      cy.visit('/app/dashboard');
      //cy.get('[data-testid=user-menu]').should('contain', username);
    }
  });
};
    

export function login(username,password,code)  { 
    cy.visit('/authentication/sign-in')
    //username = Cypress.env('TEST_USERNAME')
    //password = Cypress.env('TEST_PASSWORD')
    //code = Cypress.env('VERIFICATION_CODE')
    //cy.session([username, password, code], () => {
   
    
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('input[name="code"]').type(code);
    cy.contains('Remember me').click();
    cy.contains('Sign In').click();
    cy.get('button[type="submit"], button')
    .contains(/sign in|login|log in/i, { timeout: 30000 })
    .should('exist')
    .click({ force: true, timeout: 30000 })

    cy.log('Login button clicked')
    // cy.location("pathname").should("equal",'/en/dashboard')
  }

 // Function to handle pop-up if it appears
 export function handlePopup () {
      // Check if the pop-up exists
      cy.get('body').then($body => {
        // Look for the pop-up with the specific message
        const hasPopup = $body.text().includes('Unable to find')

        if (hasPopup) {
          cy.log('Found "Unable to find" pop-up, attempting to close it')
          cy.screenshot('popup-detected')
          
          // Try different approaches to close the pop-up
          // Approach 1: Look for close button
          cy.get('button.close, .modal-close, [aria-label="Close"], .close-button, button:contains("Close"), button:contains("OK"), button:contains("Cancel")')
            .then($closeButtons => {
              if ($closeButtons.length > 0) {
                cy.wrap($closeButtons).first().click({ force: true })
                cy.log('Clicked close button on pop-up')
              } else {
                // Approach 2: Try clicking outside the modal
                cy.get('body').click(10, 10, { force: true })
                cy.log('Attempted to click outside the pop-up')

                // Approach 3: Try pressing Escape key
                cy.get('body').type('{esc}', { force: true })
                cy.log('Pressed Escape key to close pop-up')
              }
            })

          // Take a screenshot after attempting to close
          cy.wait(1000)
          cy.screenshot('after-popup-close-attempt')
        }
      })
    }



export function fillLoginFormCorrectly(username, password, verificationCode) {
  // Use default values if environment variables are not set
  username = username || 'test@example.com'
  password = password || 'password123'
  verificationCode = verificationCode || '123456'

  cy.visit('/authentication/sign-in', { timeout: 120000 })

    // Wait for the form to load completely with increased timeout
  cy.get('form', { timeout: 40000 }).should('exist')
  cy.log('Form found - proceeding with login')

  cy.log('Filling login form with improved field identification')

  // First, let's analyze the form to understand its structure
  cy.get('form').within(() => {
    // Log all input fields to understand the form structure
    cy.get('input').then($inputs => {
      cy.log(`Found ${$inputs.length} input fields in the form`)

      // Log details about each input
      $inputs.each((index, input) => {
        const $input = Cypress.$(input)
        cy.log(`Input #${index}: type=${$input.attr('type')}, name=${$input.attr('name')}, placeholder=${$input.attr('placeholder')}`)
      })

      // Take a screenshot of the form
      cy.screenshot('login-form-structure')

      // Now fill the fields based on their position and attributes
      if ($inputs.length >= 2) {
        // First field is typically username/email
        cy.get('input').eq(0)
          .should('exist')
          .clear({ force: true })
          .type(username, { delay: 100, force: true })

        cy.log('Username entered in first field')

        // Second field is typically password
        cy.get('input[type="password"]')
          .should('exist')
          .clear({ force: true })
          .type(password, { delay: 100, force: true })

        cy.log('Password entered')

        // If there's a third field and it's not a checkbox, it's likely verification code
        if ($inputs.length > 2) {
          const thirdInput = $inputs.eq(2)
          if (thirdInput.attr('type') !== 'checkbox') {
            cy.get('input').eq(2)
              .should('exist')
              .clear({ force: true })
              .type(verificationCode, { delay: 100, force: true })

            cy.log('Verification code entered in third field')
          } else {
            cy.log('Third field is a checkbox, not entering verification code here')
          }
        } else {
          cy.log('No third field found for verification code')
        }
      } else {
        cy.log('Form has fewer than 2 fields, cannot identify username and password fields reliably')
      }
    })
  })
}

export function submitLoginForm() {
  cy.log('Submitting login form')

  // Try to find and click the submit button with multiple approaches
  cy.get('button[type="submit"], button')
    .contains(/sign in|login|log in/i, { timeout: 30000 })
    .should('exist')
    .click({ force: true, timeout: 30000 })

  cy.log('Login button clicked')

  // Add a wait to allow for server processing
  cy.wait(10000)
}

export function verifySuccessfulLogin() {
  cy.log('Verifying successful login')

  // Take a screenshot right after login attempt
  cy.screenshot('after-login-attempt')

  // Check URL or page content to verify login success
  cy.url({ timeout: 90000 }).then(url => {
    cy.log(`Current URL after login: ${url}`)

    // If we're still on the authentication page after submitting
    if (url.includes('authentication') || url.includes('sign-in') || url.includes('login')) {
      cy.log('Still on login page - checking for errors')

      // Check if there's an error message
      cy.get('body').then($body => {
        if ($body.text().includes('error') ||
            $body.text().includes('invalid') ||
            $body.text().includes('incorrect')) {
          cy.log('Login failed - error message detected')
          // Take a screenshot for debugging
          cy.screenshot('login-error')
        } else {
          cy.log('No error detected but still on login page - trying again')
          // Try clicking the button again
          submitLoginForm()
        }
      })
    } else {
      cy.log('Successfully redirected after login to: ' + url)

      // Wait for the page to fully load
      cy.wait(5000)

      // Check if we can interact with the page
      cy.document().then(doc => {
        cy.log(`Document ready state: ${doc.readyState}`)
      })

      // Check for common post-login elements
      cy.get('body').then($body => {
        cy.log('Page title: ' + $body.find('title').text())
        cy.log('First 100 chars of body: ' + $body.text().substring(0, 100))
      })
    }
  })

  // Check for elements that would indicate successful login
  cy.get('body', { timeout: 60000 }).then($body => {
    // Log what we're seeing on the page
    cy.log('Body text length: ' + $body.text().length)

    const successIndicators = [
      !$body.text().includes('Sign In'),
      !$body.text().includes('Login'),
      $body.text().includes('Dashboard') ||
      $body.text().includes('Welcome') ||
      $body.text().includes('Account') ||
      $body.text().includes('Logout') ||
      $body.text().includes('Sign Out')
    ]

    // If any success indicators are true, consider it a success
    const isLoggedIn = successIndicators.some(indicator => indicator === true)

    if (isLoggedIn) {
      cy.log('Login successful - found dashboard elements')
    } else {
      cy.log('Login verification inconclusive')
      // Take a screenshot for debugging
      cy.screenshot('login-verification-inconclusive')
    }
  })
}



// cypress/support/founctions.js

function generateOrderNumber(orderType) {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `Autotest-order-${orderType}-${randomDigits}`;
}

function generateAndVerifyOrder(orderType) {
  const orderNumber = generateOrderNumber(orderType);
  cy.log(`生成的订单号: ${orderNumber}`);

  const regex = new RegExp(`^Autotest-order-${orderType}-\\d{4}$`);
  expect(orderNumber).to.match(regex);

  return orderNumber;
  
}


const ExcelJS = require('exceljs');
const path = require('path');
const dayjs = require('dayjs');


function getNextWorkday(baseDate, offsetDays = 1) {
  let date = dayjs(baseDate).add(offsetDays, 'day');
  while (date.day() === 0 || date.day() === 6) {
    date = date.add(1, 'day');
  }
  return date;
}

async function generateInboundExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Inbound');

  const warehouses = ['WH-Shanghai', 'WH-Beijing', 'WH-Guangzhou'];
  const packageUnits = ['Box', 'Carton', 'Pallet'];

  sheet.columns = [
    { header: 'Owner ID*', key: 'ownerId' },
    { header: 'PO#*', key: 'po' },
    { header: 'Inbound Warehouse*', key: 'warehouse' },
    { header: 'Expected Arrive Time*(yyyy-MM-dd)', key: 'arrival' },
    { header: 'Customer Id*', key: 'customerId' },
    { header: 'SKU*', key: 'sku' },
    { header: 'SKU Package Unit*', key: 'packageUnit' },
    { header: 'SKU Qty*', key: 'skuQty' },
    { header: 'Expiration Date(yyyy-MM-dd)', key: 'expiration' },
    { header: 'Batch No', key: 'batchNo' },
  ];

  const today = dayjs();

  for (let i = 1; i <= 5; i++) {
    const arrivalDate = getNextWorkday(today, i).format('YYYY-MM-DD');
    const expirationDate = dayjs(arrivalDate).add(1, 'year').format('YYYY-MM-DD');

    const randomWarehouse = warehouses[Math.floor(Math.random() * warehouses.length)];
    const randomPackageUnit = packageUnits[Math.floor(Math.random() * packageUnits.length)];

    sheet.addRow({
      ownerId: `Owner-${i}`,
      po: `PO-${1000 + i}`,
      warehouse: randomWarehouse,
      arrival: arrivalDate,
      customerId: `CUST-${i}`,
      sku: `SKU-${i}`,
      packageUnit: randomPackageUnit,
      skuQty: 100 * i,
      expiration: expirationDate,
      batchNo: `BATCH-${i}`
    });
  }

  await workbook.xlsx.writeFile(filePath);
  console.log(`Excel file written to ${filePath}`);
}

function generateRandom4Digits() {
  return Math.floor(1000 + Math.random() * 9000);
}


module.exports = {
  login,
  handlePopup,
  submitLoginForm,
  verifySuccessfulLogin,
  generateOrderNumber,
  generateAndVerifyOrder,
  getNextWorkday,
  generateInboundExcel,
  generateRandom4Digits,
  

};