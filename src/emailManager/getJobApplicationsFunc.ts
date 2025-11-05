import { getFirestore } from "../util/firebaseImports";

/**
 * validateJobApplication validates the job application data.
 * @param {any} data The job application data to validate
 * @throws Error if the data is invalid
 */
function validateJobApplication(
    data: any
): asserts data is Record<string, any> {
    if (typeof data.userId !== "string") {
        throw new Error("Job application \"userId\" must be a string.");
    }
    if (typeof data.companyName !== "string") {
        throw new Error("Job application \"companyName\" must be a string.");
    }
    if (typeof data.role !== "string") {
        throw new Error("Job application \"role\" must be a string.");
    }
    // Add additional validations as needed.
}

/**
 * Fetches job applications from Firestore.
 * @param {string[]} ids - An array of job application IDs to fetch
 * @param {string} [uid] - The user ID to fetch job applications for
 * @param {string[]} [uids] - An array of user IDs to fetch job applications for
 * @return {Promise<JobApplicationsResponse>} A promise that resolves to the job applications response
 * @typedef {Object} JobApplicationsResponse
 * @property {boolean} success - Indicates if the operation was successful
 * @property {string} message - A message describing the result
 * @property {any[]} [data] - The retrieved job applications data
 * @property {string} [error] - Error message if the operation failed
 */
export const getJobApplicationsFunc = async (
    ids: string[],
    uid?: string,
    uids?: string[]
) => {
    try {
        const firestore = getFirestore();
        // Expecting an optional `ids` array in the request data.
        // For example: { ids: ["docId1", "docId2"] }
        const jobAppsData: any[] = [];
        if (!ids || (ids.length === 0 && uid && uid?.length > 0)) {
            // Scenario 1: No IDs provided — fetch all job applications.
            const snapshot = await firestore
                .collection("jobApplications")
                .where("userId", "==", uid)
                .get();
            snapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id; // attach the document ID
                try {
                    validateJobApplication(data);
                    jobAppsData.push(data);
                } catch (error) {
                    console.warn(
                        `Skipping invalid job application (ID: ${doc.id}):`,
                        error
                    );
                }
            });
        } else if (ids && ids.length > 0) {
            // Scenario 2: IDs provided — fetch each job application individually.
            const promises = ids.map((id: string) =>
                firestore.collection("jobApplications").doc(id).get()
            );
            const docs = await Promise.all(promises);
            docs.forEach((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if (data) {
                        data.id = doc.id;
                        try {
                            validateJobApplication(data);
                            jobAppsData.push(data);
                        } catch (error) {
                            console.warn(
                                `Skipping invalid job application (ID: ${doc.id}):`,
                                error
                            );
                        }
                    }
                }
            });
        } else if (uids && uids.length > 0) {
            console.log("uids:", uids);
            const query = firestore
                .collection("jobApplications")
                .where("userId", "in", uids);
            const snapshot = await query.get();

            snapshot.forEach((doc) => {
                const data = doc.data();
                console.log("data:", data);
                data.id = doc.id; // attach the document ID
                try {
                    validateJobApplication(data);
                    jobAppsData.push(data);
                } catch (error) {
                    console.warn(
                        `Skipping invalid job application (ID: ${doc.id}):`,
                        error
                    );
                }
            });
        }

        return {
            success: true,
            message: "Job applications retrieved successfully",
            data: jobAppsData,
        };
    } catch (error) {
        console.error("Error retrieving job applications:", error);
        return {
            success: false,
            message: "Error retrieving job applications",
            error: error instanceof Error ? error.message : error,
        };
    }
};
