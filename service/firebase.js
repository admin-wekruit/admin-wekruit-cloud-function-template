/**
 * Firebase Admin Service
 * 
 * Initializes Firebase Admin SDK for use in Cloud Functions.
 * This allows access to Firestore, Authentication, and other Firebase services.
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
    admin.initializeApp();
}

// Export Firebase services
const db = admin.firestore();
const auth = admin.auth();

module.exports = {
    admin,
    db,
    auth,
};

