describe('Generate Random Product JSON Files', () => {
  const randomString = (prefix = '', length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return prefix + Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const generateProduct = () => {
    const sku = randomString('SKU-', 6);
    const alias = randomString('ALIAS-SKU-', 6);
    const now = new Date().toISOString();

    return {
      owner_id: "719700",
      owner_name: "Owner 1",
      oms_owner_id: "186263",
      sku: sku,
      sku_alias: alias,
      product_name: `Product ${Math.floor(Math.random() * 1000)}`,
      product_price: (Math.random() * 1000).toFixed(2),
      product_spec: "Spec 1",
      product_state_code: "CODE3",
      product_state_value: "DISCONTINUED",
      is_fragile: Math.random() > 0.5,
      is_dangerous: Math.random() > 0.5,
      is_active: false,
      category_code: "CODE2",
      brand_code: "CODE2",
      brand_name: "Brand 1",
      shelf_life_days: Math.floor(Math.random() * 300),
      package_id: {
        package_description: "Package 1",
        unit: {
          default_unit: "EACH",
          quantity: String(Math.floor(Math.random() * 20 + 1)),
          max: "20",
          sec: "15",
          min: "5",
          weight: (Math.random() * 2).toFixed(2)
        },
        qty: Math.floor(Math.random() * 10),
        cartonize_flag: false,
        serial_no_catch: false,
        length: (Math.random() * 100).toFixed(2),
        width: (Math.random() * 100).toFixed(2),
        height: (Math.random() * 100).toFixed(2),
        volume: (Math.random() * 100000).toFixed(2),
        weight: (Math.random() * 50).toFixed(2),
        sort: Math.floor(Math.random() * 10),
        is_default: true
      },
      gross_weight: (Math.random() * 50).toFixed(2),
      net_weight: (Math.random() * 45).toFixed(2),
      tare: (Math.random() * 20).toFixed(2),
      volume: (Math.random() * 100000).toFixed(2),
      sku_length: (Math.random() * 100).toFixed(2),
      sku_width: (Math.random() * 50).toFixed(2),
      sku_high: (Math.random() * 30).toFixed(2),
      is_battery: false,
      is_refrigerate: false,
      is_sync: true,
      create_time: now,
      add_user: "user1",
      add_time: now,
      edit_user: "user1",
      edit_time: now,
      is_del: false,
      HS_Code: "HS" + Math.floor(1000 + Math.random() * 9000),
      attribute1: "Attr1-1",
      attribute2: "Attr2-1",
      product_origin_country: "JP"
    };
  };

  it('Create 3 random product JSON files', () => {
    for (let i = 0; i < 3; i++) {
      const product = generateProduct();
      const fileName = `cypress/fixtures/${product.sku}.json`;

      // Optional check: if file already exists, overwrite (or you can skip with cy.task if needed)
      cy.writeFile(fileName, product).then(() => {
        cy.log(`File written: ${fileName}`);
      });
    }
  });
});