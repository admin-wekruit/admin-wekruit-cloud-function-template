/**
 * ============================================================================
 * FIREBASE CALLABLE CLOUD FUNCTION TEMPLATE - SINGLE DOCUMENT QUERY
 * ============================================================================
 *
 * This template demonstrates a Firebase Callable Cloud Function that fetches
 * a specific document by ID with authentication and input validation.
 *
 * KEY FEATURES:
 * - Authentication required
 * - Input parameter validation
 * - Single document retrieval
 * - Existence checking
 * - Type-safe return values
 *
 * USAGE:
 * 1. Define input/output TypeScript interfaces
 * 2. Validate authentication
 * 3. Validate input parameters from request.data
 * 4. Query Firestore for specific document
 * 5. Return structured response
 *
 * CLIENT EXAMPLE (JavaScript):
 * ```
 * import { getFunctions, httpsCallable } from 'firebase/functions';
 * const functions = getFunctions();
 * const getItem = httpsCallable(functions, 'getItemById');
 * const result = await getItem({ itemId: '123' });
 * console.log(result.data); // { found: true, data: {...} }
 * ```
 * ============================================================================
 */

import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError, logger } from "../../../util/firebaseImports";

// Define input parameter interface
interface GetItemRequest {
    itemId: string;
}

// Define output data interface
interface ItemProfile {
    id: string;
    name: string;
    description: string;
    status: string;
    createdAt: number;
    updatedAt: number;
}

// Define response interface
interface GetItemResponse {
    found: boolean;
    data: ItemProfile | null;
}

/**
 * Callable Function - Get Item By ID Template
 *
 * This function demonstrates:
 * - Required authentication
 * - Input parameter validation
 * - Single document retrieval
 * - Document existence checking
 * - Type-safe responses
 */
module.exports = onCall(async (request) => {
    try {
        // ====================================================================
        // STEP 1: AUTHENTICATION CHECK (Required)
        // ====================================================================

        if (!request.auth) {
            throw new HttpsError(
                "unauthenticated",
                "Authentication required to access this function."
            );
        }

        // Optional: Additional authorization checks
        // const requestingUserId = request.auth.uid;
        // const isAdmin = request.auth.token?.admin === true;

        logger.info("getItemById called", {
            uid: request.auth.uid,
        });

        // ====================================================================
        // STEP 2: VALIDATE INPUT PARAMETERS
        // ====================================================================

        const { itemId } = request.data as GetItemRequest;

        // Check for required parameters
        if (!itemId) {
            throw new HttpsError(
                "invalid-argument",
                "Missing required parameter: itemId"
            );
        }

        // Optional: Validate parameter format
        if (typeof itemId !== "string" || itemId.trim().length === 0) {
            throw new HttpsError(
                "invalid-argument",
                "itemId must be a non-empty string"
            );
        }

        // Optional: Check authorization (user can only access their own data)
        // if (itemId !== request.auth.uid && !isAdmin) {
        //     throw new HttpsError(
        //         "permission-denied",
        //         "You can only access your own profile."
        //     );
        // }

        logger.info("Fetching item", { itemId });

        // ====================================================================
        // STEP 3: INITIALIZE FIRESTORE
        // ====================================================================

        const db = getFirestore();

        // ====================================================================
        // STEP 4: FETCH SPECIFIC DOCUMENT
        // ====================================================================

        const docRef = db.collection("items").doc(itemId);
        const doc = await docRef.get();

        // ====================================================================
        // STEP 5: CHECK DOCUMENT EXISTENCE
        // ====================================================================

        if (!doc.exists) {
            logger.info("Item not found", { itemId });
            return {
                found: false,
                data: null,
            };
        }

        // ====================================================================
        // STEP 6: TRANSFORM AND RETURN DATA
        // ====================================================================

        const rawData = doc.data() as Omit<ItemProfile, "id">;
        const itemData: ItemProfile = {
            id: doc.id,
            ...rawData,
        };

        // Optional: Filter sensitive fields before returning
        // const publicData = {
        //     id: doc.id,
        //     name: itemData.name,
        //     status: itemData.status,
        //     // Exclude sensitive fields like email, phone, etc.
        // };

        logger.info("Item retrieved successfully", { itemId });

        return {
            found: true,
            data: itemData,
        };
    } catch (error) {
        // ====================================================================
        // STEP 7: ERROR HANDLING
        // ====================================================================

        logger.error("Error in getItemById:", {
            error: error instanceof Error ? error.message : "Unknown error",
            uid: request.auth?.uid || "anonymous",
        });

        // Re-throw HttpsError to preserve error code and message
        if (error instanceof HttpsError) {
            throw error;
        }

        // Wrap unexpected errors
        throw new HttpsError(
            "internal",
            "Error fetching item from database.",
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
 * 3. Deploy: firebase deploy --only functions:getItemById
 *
 * ============================================================================
 * CLIENT SDK USAGE EXAMPLES
 * ============================================================================
 *
 * JavaScript/TypeScript (Web):
 * ```
 * import { getFunctions, httpsCallable } from 'firebase/functions';
 * const functions = getFunctions();
 * const getItem = httpsCallable(functions, 'getItemById');
 *
 * try {
 *     const result = await getItem({ itemId: '123' });
 *
 *     if (result.data.found) {
 *         console.log('Item:', result.data.data);
 *     } else {
 *         console.log('Item not found');
 *     }
 * } catch (error) {
 *     if (error.code === 'functions/unauthenticated') {
 *         console.error('Please sign in first');
 *     } else if (error.code === 'functions/invalid-argument') {
 *         console.error('Invalid item ID provided');
 *     } else {
 *         console.error('Error:', error.message);
 *     }
 * }
 * ```
 *
 * React Hook Example:
 * ```
 * const useItem = (itemId: string) => {
 *     const [item, setItem] = useState(null);
 *     const [loading, setLoading] = useState(true);
 *     const [error, setError] = useState(null);
 *
 *     useEffect(() => {
 *         const fetchItem = async () => {
 *             try {
 *                 setLoading(true);
 *                 const getItem = httpsCallable(functions, 'getItemById');
 *                 const result = await getItem({ itemId });
 *
 *                 if (result.data.found) {
 *                     setItem(result.data.data);
 *                 }
 *             } catch (err) {
 *                 setError(err);
 *             } finally {
 *                 setLoading(false);
 *             }
 *         };
 *
 *         if (itemId) fetchItem();
 *     }, [itemId]);
 *
 *     return { item, loading, error };
 * };
 * ```
 *
 * ============================================================================
 * VALIDATION PATTERNS
 * ============================================================================
 *
 * Common validation patterns for input parameters:
 *
 * 1. Required String:
 * ```
 * if (!param || typeof param !== 'string' || param.trim().length === 0) {
 *     throw new HttpsError('invalid-argument', 'Invalid parameter');
 * }
 * ```
 *
 * 2. Email Format:
 * ```
 * const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 * if (!emailRegex.test(email)) {
 *     throw new HttpsError('invalid-argument', 'Invalid email format');
 * }
 * ```
 *
 * 3. Numeric Range:
 * ```
 * if (typeof age !== 'number' || age < 0 || age > 120) {
 *     throw new HttpsError('invalid-argument', 'Invalid age');
 * }
 * ```
 *
 * 4. Array with Elements:
 * ```
 * if (!Array.isArray(items) || items.length === 0) {
 *     throw new HttpsError('invalid-argument', 'Items must be non-empty array');
 * }
 * ```
 *
 * ============================================================================
 */
