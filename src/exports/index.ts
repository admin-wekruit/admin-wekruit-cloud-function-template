/**
 * ============================================================================
 * FIREBASE CLOUD FUNCTIONS - MAIN EXPORTS
 * ============================================================================
 *
 * This is the main entry point for all Firebase Cloud Functions.
 * Functions are organized by type:
 *
 * 1. CALLABLE FUNCTIONS (onCall):
 *    - Called directly from client SDKs
 *    - Automatic authentication handling
 *    - Type-safe request/response
 *    - Examples: getAllItems, getItemById
 *
 * 2. HTTP FUNCTIONS (http):
 *    - Traditional REST API endpoints
 *    - Handle raw HTTP requests/responses
 *    - Flexible request handling
 *    - Examples: getExampleData
 *
 * 3. TRIGGER FUNCTIONS (triggers):
 *    - Respond to Firebase events
 *    - Firestore onCreate, onUpdate, onDelete
 *    - Authentication triggers
 *    - Storage triggers
 *
 * DEPLOYMENT:
 * - All functions exported here are automatically deployed
 * - Deploy all: firebase deploy --only functions
 * - Deploy specific: firebase deploy --only functions:functionName
 *
 * ============================================================================
 */

const onCallFunctions = require("./onCall");
const httpFunctions = require("./http");
const triggers = require("./triggers");

module.exports = {
    ...onCallFunctions,
    ...httpFunctions,
    ...triggers,
};

