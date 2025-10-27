/**
 * Get User Profile Cloud Function
 * 
 * STUDENT TODO: Implement user profile retrieval
 * 
 * This function should:
 * 1. Validate the userId parameter
 * 2. Fetch user data from database (or mock data)
 * 3. Return user profile information
 */

const functions = require("firebase-functions");
const { successResponse, errorResponse } = require("../helper/response");

/**
 * Get User Profile endpoint
 * 
 * Expected request body:
 * {
 *   userId: string
 * }
 * 
 * Response format:
 * {
 *   success: boolean,
 *   message: string,
 *   profile?: { id, username, email, createdAt },
 *   error?: string
 * }
 */
exports.default = functions.https.onRequest(async (req, res) => {
    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight request
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    try {
        const { userId } = req.method === "GET" ? req.query : req.body;

        // ==============================================================
        // STUDENT TODO: Implement user profile retrieval
        // ==============================================================
        // 1. Validate userId exists
        // 2. Fetch user from database (use mock data for now)
        // 3. Return user profile

        if (!userId) {
            res.status(400).json(errorResponse("userId is required"));
            return;
        }

        // Mock user profiles
        const mockProfiles = {
            "1": {
                id: "1",
                username: "john",
                email: "john@example.com",
                createdAt: "2024-01-01T00:00:00Z",
            },
            "2": {
                id: "2",
                username: "jane",
                email: "jane@example.com",
                createdAt: "2024-01-15T00:00:00Z",
            },
            "3": {
                id: "3",
                username: "student",
                email: "student@wekruit.com",
                createdAt: "2024-10-01T00:00:00Z",
            },
        };

        // YOUR CODE HERE: Implement the logic
        const profile = mockProfiles[userId];

        if (!profile) {
            res.status(404).json(errorResponse("User not found", 404));
            return;
        }

        res.status(200).json(
            successResponse({ profile }, "Profile retrieved successfully")
        );
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json(errorResponse("Internal server error", 500));
    }
});

