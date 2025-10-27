/**
 * Response Helper Functions
 * 
 * Standardized response formats for Cloud Functions.
 */

/**
 * Success response
 * @param {object} data - Data to return
 * @param {string} message - Success message
 * @returns {object} Standardized success response
 */
function successResponse(data, message = "Success") {
    return {
        success: true,
        message,
        data,
    };
}

/**
 * Error response
 * @param {string} error - Error message
 * @param {number} code - HTTP status code (optional)
 * @returns {object} Standardized error response
 */
function errorResponse(error, code = 400) {
    return {
        success: false,
        error,
        code,
    };
}

module.exports = {
    successResponse,
    errorResponse,
};

