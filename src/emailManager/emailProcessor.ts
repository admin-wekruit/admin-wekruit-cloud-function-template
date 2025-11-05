import { getFirestore } from "../util/firebaseImports";
import { emailAnalyzer } from "./emailAnalyzer";
import { ApplicationStatus, JobApplication, TimelineItem } from "./types";
import {
    getLLMResponse,
    processChatResponse,
    processPromptWithVariables,
} from "../exports/helpers/LLMReponse";
import { JobTitleSimilarityPrompt } from "./prompts";
import { LLMMessage } from "../types";
// import { emailBloomFilter } from "./emailBloomFilter";

export const emailProcessor = async (
    subject: string,
    from: string,
    emailContent: string,
    messageId: string,
    uid: string,
    userEmail: string
) => {
    try {
        // Analyze the email to extract job application info.
        // const filterResult = await emailBloomFilter(
        //     subject,
        //     from,
        //     emailContent
        // );
        const result = await emailAnalyzer(subject, from, emailContent);
        console.log(
            `Email analysis result for ${messageId}: ${JSON.stringify(result)}`
        );

        // Exit early if the email is not relevant to job application updates.
        if (
            result.category !== "JobApplicationUpdate" &&
            !result.category?.includes("JobApplicationUpdate")
        ) {
            console.log(
                "Email not categorized as JobApplicationUpdate. No action required."
            );
            return {
                success: true,
                message: "Email did not trigger a job application update.",
            };
        }
        console.log("email analysis result", result);

        const appStatus = result.applicationStatus as ApplicationStatus;
        const db = getFirestore();
        const jobApplicationsRef = db.collection("jobApplications");

        // Set up a tolerance window for date matching.
        const toleranceDays = 1;
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString();
        const startDate = new Date(
            currentDate.getTime() - toleranceDays * 24 * 60 * 60 * 1000
        );
        const endDate = new Date(
            currentDate.getTime() + toleranceDays * 24 * 60 * 60 * 1000
        );
        // Build query for an exact match based on userId, company, role, location, and dateApplied.
        let exactQuery = jobApplicationsRef
            .where("userId", "==", uid)
            .where("companyName", "==", result.companyName)
            .where("applicantInfo.email", "==", userEmail)
            .where("role", "==", result.role)
            .where("location", "==", result.location) // Corrected: using result.location
            .where("dateApplied", ">=", startDate.toISOString())
            .orderBy("dateApplied", "desc");

        if (result.jobId) {
            exactQuery = exactQuery.where("jobId", "==", result.jobId);
        }

        const exactSnapshot = await exactQuery.get();

        // Helper function to update an existing job application.
        const updateJobApplication = async (
            doc: FirebaseFirestore.QueryDocumentSnapshot
        ) => {
            const existingData = doc.data();
            const timeline: TimelineItem[] = Array.isArray(
                existingData.timeline
            ) ?
                existingData.timeline :
                [];

            const updatePayload: Partial<JobApplication> = {
                timeline: [
                    ...timeline,
                    { date: currentDateString, status: appStatus },
                ],
                status: appStatus,
            };

            // Update the correct date field based on the status.
            if (appStatus === "interview") {
                updatePayload.dateInterview = currentDateString;
            } else if (appStatus === "actions") {
                updatePayload.dateAction = currentDateString;
            } else if (appStatus === "rejected") {
                updatePayload.dateRejected = currentDateString;
            } else if (appStatus === "offer") {
                updatePayload.dateOffer = currentDateString;
            }
            await doc.ref.set(updatePayload, { merge: true });
        };

        // No exact match found.
        if (exactSnapshot.empty) {
            if (appStatus === "applied") {
                // Create a new job application.
                console.log("Creating a new job application.");
                const newJobApp: JobApplication = {
                    userId: uid,
                    jobId: result.jobId || "",
                    applicantInfo: {
                        name: "placeholder",
                        phoneNumber: "placeholder",
                        email: userEmail,
                        cvUrl: "placeholder",
                    },
                    companyName: result.companyName || "",
                    companyLogo: "placeholder",
                    role: result.role || "",
                    location: result.location || "",
                    status: appStatus,
                    isInternship: result.is_internship === "true",
                    dateApplied: currentDateString,
                    timeline: [{ date: currentDateString, status: appStatus }],
                };

                await jobApplicationsRef.add(newJobApp);
                console.log("New job application created.");
                return {
                    success: true,
                    message: "New job application created.",
                };
            } else {
                // No exact match for update (e.g. interview invitation).
                console.warn(
                    "New status email received but no matching application found."
                );

                // Look for any applications in the last 6 months.
                const sixMonthsAgo = new Date(
                    currentDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000
                );
                console.log("uid", uid);
                console.log("companyName", result.companyName);
                console.log("sixMonthsAgo", sixMonthsAgo);
                console.log("endDate", endDate);
                const interviewQuery = jobApplicationsRef
                    .where("userId", "==", uid)
                    .where("companyName", "==", result.companyName)
                    .where("applicantInfo.email", "==", userEmail)
                    .where("dateApplied", ">=", sixMonthsAgo.toISOString())
                    .where("dateApplied", "<=", endDate.toISOString());
                const interviewSnapshot = await interviewQuery.get();
                console.log("Interview query result:", interviewSnapshot.docs);

                if (interviewSnapshot.empty) {
                    return {
                        success: false,
                        message:
                            "Received an interview email for a job you never applied to.",
                    };
                }
                // **** Process similar / unsure apps ****
                let unsureApplications: FirebaseFirestore.QueryDocumentSnapshot<
                    FirebaseFirestore.DocumentData,
                    FirebaseFirestore.DocumentData
                >[] = [];
                // if unknown job title, find all applications for the same company
                if (!result.role || result.role === "n/a") {
                    unsureApplications = interviewSnapshot.docs.filter(
                        (doc) =>
                            doc.data().status !== "rejected" &&
                            doc.data().status !== "offer"
                    );
                } else {
                    // Use LLM to rank job titles from the matching applications.
                    const jobTitles = interviewSnapshot.docs.map((doc) =>
                        doc.data().role.trim().toLowerCase()
                    );
                    const jobTitlesString = jobTitles.join(", ");
                    const jobTitleSimilarityPrompt = processPromptWithVariables(
                        JobTitleSimilarityPrompt,
                        {
                            JOB_TITLES_LIST: jobTitlesString,
                            TARGET_JOB_TITLE: result.role || "n/a",
                        }
                    );

                    const llmInput: LLMMessage[] = [
                        { role: "user", content: jobTitleSimilarityPrompt },
                    ];
                    const emailProcessLLMResponse = await getLLMResponse(
                        llmInput,
                        false,
                        "claude-3-5-sonnet-20241022"
                    );
                    const rankedRawResult =
                        processChatResponse(
                            emailProcessLLMResponse,
                            "ranked_list",
                            true
                        ) || "";
                    const rankedList = rankedRawResult
                        .split(",")
                        .map((item) => item.trim().toLowerCase());

                    // Filter applications whose role appears in the ranked list.
                    const matchedJobApplications =
                        interviewSnapshot.docs.filter(
                            (doc) =>
                                (rankedList.includes(
                                    doc.data().role.trim().toLowerCase()
                                ) &&
                                    doc.data().status !== "rejected") ||
                                doc.data().status !== "offer"
                        );
                    unsureApplications = matchedJobApplications;
                }
                // Batch-update all matched applications.
                const batch = db.batch();
                console.log("Unsure applications:", unsureApplications);
                unsureApplications.forEach((doc) => {
                    const data = doc.data();
                    const timeline: TimelineItem[] = Array.isArray(
                        data.timeline
                    ) ?
                        data.timeline :
                        [];
                    const updatePayload: Partial<JobApplication> = {
                        timeline: [
                            ...timeline,
                            { date: currentDateString, status: appStatus },
                        ],
                        status: appStatus,
                        unsured: true,
                    };

                    if (appStatus === "interview") {
                        updatePayload.dateInterview = currentDateString;
                    } else if (appStatus === "actions") {
                        updatePayload.dateAction = currentDateString;
                    } else if (appStatus === "rejected") {
                        updatePayload.dateRejected = currentDateString;
                    } else if (appStatus === "offer") {
                        updatePayload.dateOffer = currentDateString;
                    }
                    batch.update(jobApplicationsRef.doc(doc.id), updatePayload);
                });
                await batch.commit();
                console.log("Interview date updated for job application(s).");
                return {
                    success: true,
                    message: "Interview date updated for job application.",
                };
            }
        } else {
            // At least one exact match was found.
            // If multiple matches exist, use the first one.
            const docToUpdate = exactSnapshot.docs[0];
            await updateJobApplication(docToUpdate);
            console.log("Exact match found and updated.", {
                docId: docToUpdate.id,
            });
            return {
                success: true,
                message: "Application updated (exact match).",
            };
        }
    } catch (error) {
        console.error("Error processing email:", error);
        return { success: false, message: "Error processing email." };
    }
};
