import { onCall, HttpsError, logger } from "../../util/firebaseImports";
import { getAssemblyAIToken } from "../../service/assemblyAI";

module.exports = onCall(async (request) => {
    // Handle start interview TODO: Handle request.auth
    // TODO: Handle changing interview to history??
    try {
        const token = await getAssemblyAIToken();
        return {
            token,
        };
    } catch (error) {
        // Log a detailed error message
        logger.error("Error updating user status to interviewing:", {
            error: error instanceof Error ? error.message : "Unknown error",
        });
        throw new HttpsError(
            "internal",
            "Error updating user status to interviewing",
            error
        );
    }
});
