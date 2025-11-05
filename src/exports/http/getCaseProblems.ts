/**
 * ============================================================================
 * FIREBASE HTTP CLOUD FUNCTION TEMPLATE
 * ============================================================================
 *
 * This template demonstrates the structure of a Firebase Cloud Function v2
 * that responds to HTTP requests.
 *
 * USAGE:
 * 1. Import required Firebase Functions and Admin SDK modules
 * 2. Define your function using onRequest() wrapper
 * 3. Handle request parameters (query params, body, headers)
 * 4. Perform business logic (database operations, external APIs, etc.)
 * 5. Return properly formatted responses with appropriate status codes
 * 6. Always wrap logic in try-catch for error handling
 *
 * ENDPOINT EXAMPLE:
 * https://us-central1-your-project.cloudfunctions.net/getExampleData?id=123&filter=active
 * ============================================================================
 */

import { onRequest } from "firebase-functions/v2/https";
import { getDatabase } from "firebase-admin/database";

// Define TypeScript interface for type safety (optional but recommended)
interface ExampleItem {
    id: string;
    name: string;
    status: string;
    createdAt: number;
}

/**
 * HTTP Cloud Function - Example Template
 *
 * This function demonstrates:
 * - Query parameter parsing
 * - Database read operations
 * - Data filtering and validation
 * - Proper response formatting
 * - Error handling patterns
 */
module.exports = onRequest(async (request, response) => {
    try {
        // ====================================================================
        // STEP 1: EXTRACT AND VALIDATE REQUEST PARAMETERS
        // ====================================================================

        // Extract query parameters from URL
        // Example: ?id=123&filter=active
        const itemId = request.query.id as string | undefined;
        const filterStatus = (request.query.filter as string) || "all";

        // Extract request body (for POST requests)
        // const bodyData = request.body;

        // Extract headers (for authentication, etc.)
        // const authToken = request.headers.authorization;

        console.log("Request received:", {
            itemId,
            filterStatus,
            method: request.method,
        });

        // Optional: Validate request method
        if (request.method !== "GET") {
            response.status(405).send({
                success: false,
                message: "Method not allowed. Use GET request.",
            });
            return;
        }

        // ====================================================================
        // STEP 2: INITIALIZE DATABASE CONNECTION
        // ====================================================================

        const db = getDatabase();

        // ====================================================================
        // STEP 3: PERFORM DATABASE OPERATIONS
        // ====================================================================

        let items: ExampleItem[] = [];

        if (itemId) {
            // Scenario A: Fetch specific item by ID
            const snapshot = await db.ref(`items/${itemId}`).once("value");

            if (!snapshot.exists()) {
                response.status(404).send({
                    success: false,
                    message: `Item with ID ${itemId} not found`,
                });
                return;
            }

            items = [snapshot.val()];
        } else {
            // Scenario B: Fetch all items
            const snapshot = await db.ref("items").once("value");

            if (!snapshot.exists()) {
                response.status(200).send({
                    success: true,
                    message: "No items found",
                    data: [],
                });
                return;
            }

            // Convert Firebase object to array
            const allItems = snapshot.val();
            items = Object.keys(allItems).map((key) => ({
                id: key,
                ...allItems[key],
            }));
        }

        // ====================================================================
        // STEP 4: FILTER AND TRANSFORM DATA
        // ====================================================================

        // Apply filters based on query parameters
        let filteredItems = items;

        if (filterStatus !== "all") {
            filteredItems = items.filter(
                (item) => item.status === filterStatus
            );
        }

        // Optional: Transform data (remove sensitive fields, format dates, etc.)
        const transformedItems = filteredItems.map((item) => ({
            id: item.id,
            name: item.name,
            status: item.status,
            createdAt: new Date(item.createdAt).toISOString(),
        }));

        // ====================================================================
        // STEP 5: SEND SUCCESS RESPONSE
        // ====================================================================

        console.log(`Successfully retrieved ${transformedItems.length} items`);

        response.status(200).send({
            success: true,
            message: "Data retrieved successfully",
            data: transformedItems,
            count: transformedItems.length,
        });
    } catch (error) {
        // ====================================================================
        // STEP 6: HANDLE ERRORS GRACEFULLY
        // ====================================================================

        console.error("Error in cloud function:", error);

        response.status(500).send({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

/**
 * ============================================================================
 * DEPLOYMENT INSTRUCTIONS
 * ============================================================================
 *
 * 1. Ensure this function is exported in src/exports/http/index.ts
 * 2. Build the TypeScript code: npm run build
 * 3. Deploy to Firebase: firebase deploy --only functions:getExampleData
 *
 * ============================================================================
 * TESTING
 * ============================================================================
 *
 * Test the deployed function with:
 *
 * curl "https://us-central1-your-project.cloudfunctions.net/getExampleData"
 * curl "https://us-central1-your-project.cloudfunctions.net/getExampleData?id=123"
 * curl "https://us-central1-your-project.cloudfunctions.net/getExampleData?filter=active"
 *
 * ============================================================================
 * COMMON RESPONSE STATUS CODES
 * ============================================================================
 *
 * 200 - OK (Success)
 * 201 - Created (Resource created successfully)
 * 400 - Bad Request (Invalid input)
 * 401 - Unauthorized (Authentication required)
 * 403 - Forbidden (Insufficient permissions)
 * 404 - Not Found (Resource doesn't exist)
 * 405 - Method Not Allowed (Wrong HTTP method)
 * 500 - Internal Server Error (Server-side error)
 *
 * ============================================================================
 */
