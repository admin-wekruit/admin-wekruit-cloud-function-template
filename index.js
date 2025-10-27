/**
 * Week 4 Backend - Cloud Functions Entry Point
 * 
 * This file exports all Cloud Functions for deployment.
 * Each function is defined in its own file in the exports/ folder.
 */

// Import all functions from exports folder
const login = require("./exports/login");
const getUserProfile = require("./exports/getUserProfile");

// Export functions for Firebase
exports.login = login.default;
exports.getUserProfile = getUserProfile.default;

