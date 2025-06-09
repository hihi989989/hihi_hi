const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://test-csr.darwynnfulfillment.com',
    pageLoadTimeout: 180000, // 3 minutes
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    viewportWidth: 1280,
    viewportHeight: 800,
    chromeWebSecurity: false,
    retries: {
      runMode: 2,
      openMode: 1
    }
  },
})
