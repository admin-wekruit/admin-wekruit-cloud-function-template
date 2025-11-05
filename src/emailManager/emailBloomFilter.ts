// import { LLMMessage } from "../types";
// import {
//     getLLMResponse,
//     processChatResponse,
//     processPromptWithVariables,
// } from "../exports/helpers/LLMReponse";
// import { EmailAnalysisPrompt } from "./prompts";

// export const emailBloomFilter = async (
//     subject: string,
//     sender: string,
//     text: string
// ) => {
//         const emailExtractPrompt = processPromptWithVariables(EmailAnalysisPrompt, {
//             SUBJECT: subject,
//             SENDER: sender,
//             TEXT: text,
//         });

//         const llmInput: LLMMessage[] = [
//             {
//                 role: "user",
//                 content: emailExtractPrompt,
//             },
//         ];
//         console.log("LLM input for response evaluation:", llmInput);
//         const emailProcessLLMResponse = await getLLMResponse(
//             llmInput,
//             true,
//             "gpt-4o-mini"
//         );
//         console.log("Email analysis response:", emailProcessLLMResponse);
//         const processedResponse = processChatResponse(
//             emailProcessLLMResponse,
//             "category"
//         );
// }
