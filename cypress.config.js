const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://test-csr.darwynnfulfillment.com',
    setupNodeEvents(on, config) {
      return config;
    },
  },
});



