
// cypress/e2e/generateProductData.cy.js
import { faker } from '@faker-js/faker';
describe('Generate Random Product Data', () => {
  it('Creates 3 random product JSON files', () => {
    // Helper function to generate random values
    const random = {
      id: () => Math.floor(Math.random() * 1000000).toString(),
      name: () => `Product ${Math.floor(Math.random() * 1000)}`,
      sku: () => `SKU-${Math.floor(Math.random() * 1000000)}`,
      price: () => (Math.random() * 1000).toFixed(2),
      bool: () => Math.random() > 0.5,
      date: () => new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      code: () => ['CODE1', 'CODE2', 'CODE3', 'CODE4'][Math.floor(Math.random() * 4)],
      state: () => ['ACTIVE', 'INACTIVE', 'DISCONTINUED'][Math.floor(Math.random() * 3)],
      country: () => ['US', 'CN', 'JP', 'DE', 'UK'][Math.floor(Math.random() * 5)],
      number: (max) => Math.floor(Math.random() * max) + 1,
      dimension: () => (Math.random() * 100).toFixed(2),
      weight: () => (Math.random() * 50).toFixed(2)
    };

    // Generate 3 products
    for (let i = 1; i <= 3; i++) {
      const packageData = {
        'package description': `Package ${i}`,
        unit: ['EA', 'BOX', 'CASE'][Math.floor(Math.random() * 3)],
        qty: random.number(10),
        cartonize_flag: random.bool(),
        serial_no_catch: random.bool(),
        length: random.dimension(),
        width: random.dimension(),
        height: random.dimension(),
        volume: (random.dimension() * random.dimension() * random.dimension()).toFixed(2),
        weight: random.weight(),
        sort: random.number(10),
        is_default: random.bool()
      };

      const product = {
        owner_id: random.id(),
        owner_name: `Owner ${i}`,
        oms_owner_id: random.id(),
        sku: random.sku(),
        sku_alias: `ALIAS-${random.sku()}`,
        product_name: random.name(),
        product_price: random.price(),
        product_spec: `Spec ${i}`,
        product_state_code: random.code(),
        product_state_value: random.state(),
        is_fragile: random.bool(),
        is_dangerous: random.bool(),
        is_active: random.bool(),
        category_code: random.code(),
        brand_code: random.code(),
        brand_name: `Brand ${i}`,
        shelf_life_days: random.number(365),
        package_id: packageData,
        gross_weight: random.weight(),
        net_weight: random.weight(),
        tare: (random.weight() / 2).toFixed(2),
        volume: packageData.volume,
        sku_length: random.dimension(),
        sku_width: random.dimension(),
        sku_high: random.dimension(),
        is_battery: random.bool(),
        is_refrigerate: random.bool(),
        is_sync: random.bool(),
        create_time: random.date(),
        add_user: `user${i}`,
        add_time: random.date(),
        edit_user: `user${i}`,
        edit_time: random.date(),
        is_del: random.bool(),
        HS_Code: `HS${random.number(9999)}`,
        attribute1: `Attr1-${i}`,
        attribute2: `Attr2-${i}`,
        product_origin_country: random.country()
      };

      // Write to JSON file
      const filename = `product_${i}_${Date.now()}.json`;
      cy.writeFile(`cypress/fixtures/${filename}`, product);
      cy.log(`Generated product file: ${filename}`);
    }
  });
});