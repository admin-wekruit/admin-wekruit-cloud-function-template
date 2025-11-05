import { LLMMessage } from "../types";
import {
    getLLMResponse,
    processChatResponse,
    processPromptWithVariables,
} from "../exports/helpers/LLMReponse";
import { EmailAnalysisPrompt } from "./prompts";

export const emailAnalyzer = async (
    subject: string,
    sender: string,
    text: string
) => {
    const emailExtractPrompt = processPromptWithVariables(EmailAnalysisPrompt, {
        SUBJECT: subject,
        SENDER: sender,
        TEXT: text,
    });

    const llmInput: LLMMessage[] = [
        {
            role: "user",
            content: emailExtractPrompt,
        },
    ];
    console.log("LLM input for response evaluation:", llmInput);
    const emailProcessLLMResponse = await getLLMResponse(
        llmInput,
        true,
        "gpt-4o-mini"
    );
    console.log("Email analysis response:", emailProcessLLMResponse);
    const processedResponse = processChatResponse(
        emailProcessLLMResponse,
        "category"
    );
    if (processedResponse === "JobApplicationUpdate") {
        const applicationStatus = processChatResponse(
            emailProcessLLMResponse,
            "application_status",
            true
        );
        const tempJobId = processChatResponse(
            emailProcessLLMResponse,
            "job_id"
        );
        const jobId = tempJobId && tempJobId !== "N/A" ? tempJobId : "N/A";
        const applicantName = processChatResponse(
            emailProcessLLMResponse,
            "applicant_name",
            true
        );
        const applicantPhone = processChatResponse(
            emailProcessLLMResponse,
            "applicant_phone",
            true
        );
        const applicantEmail = processChatResponse(
            emailProcessLLMResponse,
            "applicant_email",
            true
        );
        const companyName = processChatResponse(
            emailProcessLLMResponse,
            "company_name",
            true
        );
        const role = processChatResponse(emailProcessLLMResponse, "role", true);
        const location =
            processChatResponse(emailProcessLLMResponse, "location", true) ||
            "N/A";
        const is_internship = processChatResponse(
            emailProcessLLMResponse,
            "is_internship",
            true
        );

        return {
            category: processedResponse,
            applicationStatus,
            jobId,
            applicantName,
            applicantPhone,
            applicantEmail,
            companyName,
            role,
            location,
            is_internship,
        };
    } else {
        return {
            category: processedResponse,
        };
    }
};
