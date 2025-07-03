// cypress/e2e/generateProductData.cy.js
import { faker } from '@faker-js/faker';

describe('Dynamic Product Data Generator', () => {
  it('Generates random product data JSON', () => {
    // Configuration
    const config = {
      minOrders: 3,
      maxOrders: 10,
      minProductsPerOrder: 1,
      maxProductsPerOrder: 5,
      outputFile: 'cypress/fixtures/dynamic_products.json'
    };

    // Helper functions
    const randomInt = (min, max) => faker.number.int({ min, max });
    const randomDate = (start, end) => faker.date.between({ from: start, to: end }).toISOString().split('T')[0];
    const randomFutureDate = (days = 30) => randomDate(new Date(), new Date(Date.now() + days * 24 * 60 * 60 * 1000));

    // Product data generators
    const generateBatchNumber = (productName) => {
      const prefix = productName.split(' ').map(w => w[0]).join('').toUpperCase();
      return `${prefix}-${faker.string.numeric(4)}-${faker.string.alphanumeric(3).toUpperCase()}`;
    };

    const generateProduct = () => {
      const productName = faker.commerce.productName() + ' ' + randomInt(100, 2000) + faker.science.unit().symbol;
      return {
        product_name: productName,
        quantity: randomInt(10, 1000),
        batch_no: generateBatchNumber(productName),
        batch_production_date: randomDate(new Date(2023, 0, 1), new Date()),
        batch_expiry_date: randomFutureDate(365 * 2) // 2 years in future
      };
    };

    const generateOrder = () => ({
      order_no: `ORD-${new Date().getFullYear()}-${faker.string.numeric(5)}`,
      expect_date: randomFutureDate(),
      warehouse: `WH-${faker.location.state({ abbreviated: true })}-${faker.string.numeric(2)}`,
      carrier_id: `${faker.airline.airline().iataCode}${faker.string.numeric(5)}`,
      customer_id: `CUST-${faker.string.alphanumeric(8).toUpperCase()}`,
      products: Array.from({ length: randomInt(config.minProductsPerOrder, config.maxProductsPerOrder) }, generateProduct)
    });

    // Generate the complete dataset
    const productData = {
      generated_at: new Date().toISOString(),
      orders: Array.from({ length: randomInt(config.minOrders, config.maxOrders) }, generateOrder)
    };

    // Write to file and validate
    cy.writeFile(config.outputFile, productData);
    cy.log('Generated product data:', JSON.stringify(productData, null, 2));

    // Verify the file was created correctly
    cy.readFile(config.outputFile).then((data) => {
      expect(data.orders).to.be.an('array').and.not.to.be.empty;
      data.orders.forEach(order => {
        expect(order).to.include.keys('order_no', 'expect_date', 'warehouse', 'carrier_id', 'customer_id', 'products');
        expect(order.products).to.be.an('array').and.not.to.be.empty;
        
        order.products.forEach(product => {
          expect(product).to.include.keys(
            'product_name', 'quantity', 'batch_no', 
            'batch_production_date', 'batch_expiry_date'
          );
          expect(new Date(product.batch_expiry_date)).to.be.greaterThan(new Date(product.batch_production_date));
        });
      });
    });
  });
});