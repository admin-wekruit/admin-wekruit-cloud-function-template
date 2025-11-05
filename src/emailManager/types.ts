export interface GmailUser {
    email: string;
    refreshToken: string;
    accessToken: string;
    tokenExpiry: Date;
    historyId: string;
    watchExpiration: Date;
    needsReauth: boolean;
    alreadyInit?: boolean;
    scopes?: string[];
}

export interface ApplicantInfo {
    name: string;
    phoneNumber: string;
    email: string;
    cvUrl: string;
}

export type ApplicationStatus =
    | "applied"
    | "interview"
    | "actions"
    | "rejected"
    | "offer";

export interface TimelineItem {
    date: string;
    status: ApplicationStatus;
}

export interface JobApplication {
    id?: string;
    userId: string;
    jobId?: string;
    applicantInfo: ApplicantInfo;
    companyName: string;
    companyLogo: string;
    role: string;
    jobDescription?: string;
    dateApplied: string;
    dateInterview?: string;
    dateAction?: string;
    dateOffer?: string;
    timeline: TimelineItem[];
    dateRejected?: string;
    status: ApplicationStatus;
    isInternship: boolean;
    location?: string;
    salary?: string;
    notes?: string;
    referred?: boolean;
    unsured?: boolean;
}
