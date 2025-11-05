/**
 * ============================================================================
 * FIREBASE CALLABLE CLOUD FUNCTION TEMPLATE - COLLECTION QUERY
 * ============================================================================
 *
 * This template demonstrates a Firebase Callable Cloud Function that fetches
 * all documents from a Firestore collection.
 *
 * CALLABLE vs HTTP FUNCTIONS:
 * - Callable functions are invoked from client SDKs (not direct HTTP)
 * - Automatically handle authentication context
 * - Return data directly (not HTTP responses)
 * - Built-in error handling with typed errors
 *
 * USAGE:
 * 1. Import Firebase Functions v2 callable and Firestore
 * 2. Define function using onCall() wrapper
 * 3. Access authentication via request.auth
 * 4. Return data directly (no response.send needed)
 * 5. Throw HttpsError for error handling
 *
 * CLIENT EXAMPLE (JavaScript):
 * ```
 * import { getFunctions, httpsCallable } from 'firebase/functions';
 * const functions = getFunctions();
 * const getAllItems = httpsCallable(functions, 'getAllItems');
 * const result = await getAllItems();
 * console.log(result.data); // { success: true, data: [...] }
 * ```
 * ============================================================================
 */

import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError, logger } from "../../../util/firebaseImports";

// Define TypeScript interface for returned data structure
interface ItemData {
    id: string;
    name: string;
    status: string;
    createdAt: number;
    // Add more fields as needed
}

/**
 * Callable Function - Get All Items Template
 *
 * This function demonstrates:
 * - Authentication checking
 * - Firestore collection queries
 * - Document data transformation
 * - Proper error handling for callable functions
 */
module.exports = onCall(async (request) => {
    try {
        // ====================================================================
        // STEP 1: AUTHENTICATION CHECK (Optional but recommended)
        // ====================================================================

        // Uncomment to require authentication
        // if (!request.auth) {
        //     throw new HttpsError("unauthenticated", "Must be authenticated.");
        // }

        // Optional: Check for specific user roles/claims
        // const isAdmin = request.auth?.token?.admin === true;
        // if (!isAdmin) {
        //     throw new HttpsError(
        //         "permission-denied",
        //         "Only admins can access this function."
        //     );
        // }

        logger.info("getAllItems called", {
            uid: request.auth?.uid || "anonymous",
        });

        // ====================================================================
        // STEP 2: INITIALIZE FIRESTORE
        // ====================================================================

        const db = getFirestore();

        // ====================================================================
        // STEP 3: QUERY COLLECTION
        // ====================================================================

        // Fetch all documents from the collection
        const itemsSnapshot = await db.collection("items").get();

        // Optional: Add query filters
        // const itemsSnapshot = await db.collection("items")
        //     .where("status", "==", "active")
        //     .orderBy("createdAt", "desc")
        //     .limit(100)
        //     .get();

        // Check if collection is empty
        if (itemsSnapshot.empty) {
            logger.info("No items found in collection");
            return { success: true, data: [], count: 0 };
        }

        // ====================================================================
        // STEP 4: TRANSFORM DOCUMENTS TO ARRAY
        // ====================================================================

        const items: Array<ItemData> = [];

        itemsSnapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                ...(doc.data() as Omit<ItemData, "id">),
            });
        });

        // Optional: Filter or transform data
        // const publicItems = items.map(item => ({
        //     id: item.id,
        //     name: item.name,
        //     status: item.status,
        //     // Exclude sensitive fields
        // }));

        // ====================================================================
        // STEP 5: RETURN SUCCESS RESPONSE
        // ====================================================================

        logger.info(`Successfully retrieved ${items.length} items`);

        return {
            success: true,
            data: items,
            count: items.length,
        };
    } catch (error) {
        // ====================================================================
        // STEP 6: ERROR HANDLING
        // ====================================================================

        logger.error("Error in getAllItems:", {
            error: error instanceof Error ? error.message : "Unknown error",
            uid: request.auth?.uid || "anonymous",
        });

        // If it's already an HttpsError, re-throw it
        if (error instanceof HttpsError) {
            throw error;
        }

        // Otherwise, wrap it in an HttpsError
        throw new HttpsError(
            "internal",
            "Error fetching items from database.",
            error
        );
    }
});

/**
 * ============================================================================
 * DEPLOYMENT INSTRUCTIONS
 * ============================================================================
 *
 * 1. Ensure this function is exported in src/exports/onCall/user/index.ts
 * 2. Build: npm run build
 * 3. Deploy: firebase deploy --only functions:getAllItems
 *
 * ============================================================================
 * CLIENT SDK USAGE EXAMPLES
 * ============================================================================
 *
 * JavaScript/TypeScript (Web):
 * ```
 * import { getFunctions, httpsCallable } from 'firebase/functions';
 * const functions = getFunctions();
 * const getAllItems = httpsCallable(functions, 'getAllItems');
 *
 * try {
 *     const result = await getAllItems();
 *     console.log(result.data.data); // Array of items
 * } catch (error) {
 *     console.error('Error:', error.code, error.message);
 * }
 * ```
 *
 * React Example:
 * ```
 * const [items, setItems] = useState([]);
 *
 * useEffect(() => {
 *     const fetchItems = async () => {
 *         const getAllItems = httpsCallable(functions, 'getAllItems');
 *         const result = await getAllItems();
 *         setItems(result.data.data);
 *     };
 *     fetchItems();
 * }, []);
 * ```
 *
 * ============================================================================
 * ERROR CODES FOR CALLABLE FUNCTIONS
 * ============================================================================
 *
 * - unauthenticated: User must be authenticated
 * - permission-denied: User lacks required permissions
 * - invalid-argument: Missing or invalid arguments
 * - not-found: Resource not found
 * - already-exists: Resource already exists
 * - resource-exhausted: Quota exceeded
 * - failed-precondition: Operation rejected (e.g., wrong state)
 * - aborted: Operation aborted (usually due to concurrency)
 * - out-of-range: Value out of valid range
 * - unimplemented: Operation not implemented
 * - internal: Internal server error
 * - unavailable: Service temporarily unavailable
 * - data-loss: Unrecoverable data loss or corruption
 *
 * ============================================================================
 */
