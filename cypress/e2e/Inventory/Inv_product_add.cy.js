import { login, handlePopup, submitLoginForm, verifySuccessfulLogin } from '../../support/founctions';

describe('Darwynn Inventory Navigation Test', () => {

before(() => {
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
 it('Fill in the SKU product table~~~', function() {
    
    cy.fixture('SKU-12CC7K.json').then((productData) => {
      //  Click the "Add" button
      cy.visit('/app/inventory/products');
      cy.contains('button', 'Add').click();
      
      
      cy.get('input[name="sku"]').type(productData.sku);

      //Category code 
      const combobox = '[name="categoryCode"][role="combobox"]';

      cy.get(combobox).click().type('Appliances');
      cy.contains('.MuiAutocomplete-option', 'Appliances', { timeout: 8000 })
                  .should('be.visible')
                  .click();

      // Input SKUAlias
      cy.get('input[name="skuAlias"]').type(productData.sku_alias);


     //Check shelf life flag
      cy.contains('label', 'Shelf Life Flag')  // 找到label
                 .parent()               // 根据实际DOM结构调整选择器
                 .find('[role="combobox"]') // 找到combobox
                 .click();               // 点击展开下拉选项

      cy.contains('.MuiAutocomplete-option', 'NO', { timeout: 8000 })
                  .should('be.visible')
                  .click();
     //Input product name and HS code and Product COO
      cy.get('input[name="productName"]').type(productData.product_name);
      cy.get('input[name="hsCode"]').type(productData.HS_Code);
      cy.contains('label', 'Product Origin Country')  
                 .parent()               
                 .find('[role="combobox"]') 
                 .click();               

      cy.contains('.MuiAutocomplete-option', 'CANADA - CA', { timeout: 8000 })
                  .should('be.visible')
                  .click();

      //Input Proudct statecode
      const combobox2 = '[name="productStateCode"][role="combobox"]';

      cy.get(combobox2).click().type('Solid');
      cy.contains('.MuiAutocomplete-option', 'Solid', { timeout: 8000 })
                  .should('be.visible')
                  .click();

       
//Validate the Price
  cy.get('input[name="productPrice"][type="number"]')
      .focus()
      .type('{downarrow}') // 相当于点击上箭头
      .clear()
      .type('0');
  cy.contains('The Product Cost must be greater than or equal to 0.01').should('be.visible');
  cy.get('input[name="productPrice"][type="number"]')
      .clear()
      .type(productData.product_price) //输入json file中的价格

  cy.contains('label', 'Fragile')  
              .parent()               
              .find('[role="combobox"]') 
              .click();               

  cy.contains('.MuiAutocomplete-option', 'NO', { timeout: 8000 })
              .should('be.visible')
              .click();

  cy.contains('label', 'Dangerous')  
              .parent()               
              .find('[role="combobox"]') 
              .click();               

  cy.contains('.MuiAutocomplete-option', 'NO', { timeout: 8000 })
              .should('be.visible')
              .click();


  cy.contains('label', 'Battery Included')  
              .parent()               
              .find('[role="combobox"]') 
              .click();               

  cy.contains('.MuiAutocomplete-option', 'YES', { timeout: 8000 })
              .should('be.visible')
              .click();


  cy.contains('label', 'Requires Refrigeration')  
              .parent()               
              .find('[role="combobox"]') 
              .click();               

  cy.contains('.MuiAutocomplete-option', 'YES', { timeout: 8000 })
              .should('be.visible')
              .click();




/*cy.contains('label', 'Synchronization')
  .closest('.MuiGrid-root')
  .find('input[role="combobox"]')
  .clear()
  .type('YES'); // 输入 YES 触发下拉菜单

cy.contains('.MuiAutocomplete-option', 'YES', { timeout: 3000 })
  .should('be.visible')
  .click(); // 点击选项*/




   cy.get('input[name="attribute1"]').type(productData.attribute1);
   cy.get('input[name="attribute2"]').type(productData.attribute2);
   //cy.get('input[name="productSpec"]').type(productData.product_spec);
   //cy.contains('label', 'productSpec') // 找到 label 元素
  //.closest('.MuiGrid-root') // 找到包含 input 的外层容器
  //.find('input') // 找到真正的输入框
  //.clear() // 清除原值（如果有）
  //.type('YES'); // 输入值

  //Go to next page to fill in package information
  cy.contains('button', 'Next').click();
 // Waiting for new page upload with text "Package info"
  cy.contains('Add Package Info', { timeout: 5000 }).should('be.visible');

  cy.get('input[name="packageDesc"]').type(productData.package_id.package_description);

  cy.contains('label', 'Default Unit')  
              .parent()               
              .find('[role="combobox"]') 
              .click();               

  cy.contains('.MuiAutocomplete-option', productData.package_id.unit.default_unit, { timeout: 8000 })
              .should('be.visible')
              .click();


              
const valuesToFill = [productData.package_id.unit.max, productData.package_id.unit.sec, productData.package_id.unit.min, productData.package_id.unit.weight]; // 每个空格填不同内容
let filledCount = 0;

cy.get('[data-rowindex="0"]').within(() => {
  // 
  cy.get('button').eq(0).click();

  cy.get('input').each(($el) => {
    if (filledCount >= valuesToFill.length) {
      return false; // 
    }

    cy.wrap($el).invoke('val').then(val => {
      if (!val) {
        cy.wrap($el).clear().type(valuesToFill[filledCount]);
        filledCount++;
      }
    });
  });

  // 
  cy.then(() => {
    if (filledCount === valuesToFill.length) {
      cy.get('button').eq(0).click(); // 
    }
  });
});



// Input a case test
cy.get('[data-rowindex="1"]').within(() => {
  cy.get('button').eq(0).click();

  cy.get('input').should('have.length.at.least', 5); // 确保输入框加载完

  cy.get('input').eq(0).should('be.visible').click().clear().type('10');
  cy.get('input').eq(1).clear().type('100');
  cy.get('input').eq(2).clear().type('80');
  cy.get('input').eq(3).clear().type('60');
  cy.get('input').eq(4).clear().type('5');

  cy.get('button').eq(0).click();
});

});


  //packageDesc
  //Default Unit

    });

  });

