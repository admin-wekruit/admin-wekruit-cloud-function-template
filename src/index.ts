const admin = require("firebase-admin");

admin.initializeApp();

// Only load exports after Firebase is initialized
const exportFunctions = require("./exports");

// Export all functions
module.exports = { ...exportFunctions };
