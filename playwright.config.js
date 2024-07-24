module.exports = {
  use: {
    // Use the environment variable or default to 30 seconds
    timeout: process.env.PLAYWRIGHT_TEST_TIMEOUT ? parseInt(process.env.PLAYWRIGHT_TEST_TIMEOUT, 10) : 30000,
  },
  // Add any other necessary Playwright configurations here
};
