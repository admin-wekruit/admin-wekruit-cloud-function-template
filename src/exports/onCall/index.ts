const getAssemblyAIToken = require("./getAssemblyAIToken");

const interviewFunctions = require("./interview");
const interviewRecordingFunctions = require("./interviewRecording");
const emailTrackerFunctions = require("./emailTracker");
const partnersFunctions = require("./partners");
const userFunctions = require("./user");
const reportFunctions = require("./report");
const caseFunctions = require("./case");
const caseInterviewFunctions = require("./caseInterview");
const paypalFunctions = require("./paypal");
const plansFunctions = require("./plans");
const candidateFunctions = require("./candidate");
const retellCandidateManagementDashboardFunctions = require("./retellCandidateManagementDashboard");
const behavioralReportFunctions = require("./bqReport");

module.exports = {
    getAssemblyAIToken,
    ...interviewRecordingFunctions,
    ...interviewFunctions,
    ...emailTrackerFunctions,
    ...partnersFunctions,
    ...userFunctions,
    ...reportFunctions,
    ...caseFunctions,
    ...caseInterviewFunctions,
    ...paypalFunctions,
    ...plansFunctions,
    ...candidateFunctions,
    ...retellCandidateManagementDashboardFunctions,
    ...behavioralReportFunctions,
};
