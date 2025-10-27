/**
 * Login Cloud Function
 * 
 * STUDENT TODO: Implement login logic
 * 
 * This function should:
 * 1. Validate the username and password
 * 2. Check credentials against database (or mock data for now)
 * 3. Return success with user data if valid
 * 4. Return error if invalid
 */

const functions = require("firebase-functions");
const { validateRequiredFields } = require("../helper/validator");
const { successResponse, errorResponse } = require("../helper/response");

/**
 * Login endpoint
 * 
 * Expected request body:
 * {
 *   username: string,
 *   password: string
 * }
 * 
 * Response format:
 * {
 *   success: boolean,
 *   message: string,
 *   user?: { id, username, email },
 *   token?: string,
 *   error?: string
 * }
 */
exports.default = functions.https.onRequest(async (req, res) => {
    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight request
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    // Only allow POST requests
    if (req.method !== "POST") {
        res.status(405).json(errorResponse("Method not allowed", 405));
        return;
    }

    try {
        const { username, password } = req.body;

        // ==============================================================
        // STUDENT TODO #1: Validate required fields
        // ==============================================================
        // Use the validateRequiredFields helper to check if username and password exist
        // Hint: const validation = validateRequiredFields(req.body, ["username", "password"]);
        // If validation.valid is false, return an error response

        // YOUR CODE HERE:
        const validation = validateRequiredFields(req.body, ["username", "password"]);
        if (!validation.valid) {
            res.status(400).json(
                errorResponse(`Missing required fields: ${validation.missingFields.join(", ")}`)
            );
            return;
        }

        // ==============================================================
        // STUDENT TODO #2: Implement authentication logic
        // ==============================================================
        // For now, use mock data. Later, you can connect to a real database.
        // 
        // Mock users for testing:
        const mockUsers = {
            "john": { id: "1", username: "john", email: "john@example.com", password: "password123" },
            "jane": { id: "2", username: "jane", email: "jane@example.com", password: "secret456" },
            "student": { id: "3", username: "student", email: "student@wekruit.com", password: "wekruit2024" },
        };

        // YOUR CODE HERE:
        // 1. Check if username exists in mockUsers
        // 2. Check if password matches
        // 3. If valid, return success with user data
        // 4. If invalid, return error

        const user = mockUsers[username];

        if (!user) {
            res.status(401).json(errorResponse("Invalid username or password", 401));
            return;
        }

        if (user.password !== password) {
            res.status(401).json(errorResponse("Invalid username or password", 401));
            return;
        }

        // ==============================================================
        // STUDENT TODO #3: Generate authentication token
        // ==============================================================
        // In a real application, you would generate a JWT token here.
        // For now, we'll use a simple mock token.
        // 
        // Optional: Research JWT (jsonwebtoken package) and implement it!

        // YOUR CODE HERE:
        const token = `mock-token-${user.id}-${Date.now()}`;

        // ==============================================================
        // Success! Return user data (without password)
        // ==============================================================
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(200).json(
            successResponse(
                {
                    user: userWithoutPassword,
                    token,
                },
                "Login successful"
            )
        );
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json(errorResponse("Internal server error", 500));
    }
});

