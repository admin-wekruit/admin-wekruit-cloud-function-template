/**
 * ============================================================================
 * HTTP FUNCTIONS - INDEX
 * ============================================================================
 *
 * This file exports all HTTP-triggered cloud functions.
 * Each function is a template demonstrating best practices for Firebase
 * HTTP Cloud Functions.
 *
 * FUNCTION TEMPLATES INCLUDED:
 * 1. getExampleData - Fetch data from Realtime Database with query params
 *
 * ============================================================================
 */

const getExampleData = require("./getCaseProblems");

module.exports = {
    getExampleData,
};
