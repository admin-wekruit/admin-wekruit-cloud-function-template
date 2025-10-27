/**
 * Validation Helper Functions
 * 
 * Common validation functions used across Cloud Functions.
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, message: string }
 */
function isValidPassword(password) {
    if (!password || password.length < 6) {
        return {
            valid: false,
            message: "Password must be at least 6 characters",
        };
    }

    // Add more validation rules here
    // Example: require uppercase, lowercase, number, special char

    return { valid: true, message: "Password is valid" };
}

/**
 * Validate required fields in request data
 * @param {object} data - Request data
 * @param {string[]} requiredFields - Array of required field names
 * @returns {object} { valid: boolean, missingFields: string[] }
 */
function validateRequiredFields(data, requiredFields) {
    const missingFields = [];

    for (const field of requiredFields) {
        if (!data[field]) {
            missingFields.push(field);
        }
    }

    return {
        valid: missingFields.length === 0,
        missingFields,
    };
}

module.exports = {
    isValidEmail,
    isValidPassword,
    validateRequiredFields,
};

