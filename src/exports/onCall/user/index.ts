/**
 * ============================================================================
 * USER CALLABLE FUNCTIONS - INDEX
 * ============================================================================
 *
 * This file exports all callable functions related to user operations.
 * Each function is a template demonstrating best practices for Firebase
 * Cloud Functions.
 *
 * FUNCTION TEMPLATES INCLUDED:
 * 1. getAllItems - Fetch all documents from a collection
 * 2. getItemById - Fetch a single document with input validation
 *
 * ============================================================================
 */

const getAllItems = require("./getAllUsers");
const getItemById = require("./getUserProfile");

module.exports = {
    getAllItems,
    getItemById,
};
