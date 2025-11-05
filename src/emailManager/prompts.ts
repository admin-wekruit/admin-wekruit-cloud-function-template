export const EmailAnalysisPrompt = `You are an advanced email analyzer designed to categorize and extract information from job-related emails for job seekers. Your primary task is to determine whether an incoming email is related to a job application status or actions update, or if it falls into another category. If it is job-related, you will also extract specific details about the application.
Please follow these steps to analyze the email:

1. Carefully read the email subject, sender information, and body.
2. Consider the following:
   - Identify key phrases or terms from the subject line, sender information, and email body that indicate whether it's job-related.
   - Consider arguments for why this email might be a "JobApplicationUpdate":
     * Does it mention anything about job applications, interviews, or hiring processes?
     * Is the sender from a company's HR department or a hiring manager?
     * Are there any specific instructions or updates related to a job application?
   - Consider arguments for why this email might be an "OtherEmail":
     * Is the content unrelated to job applications or hiring processes?
     * Is the sender not associated with recruitment or HR?
     * Does the email lack any mention of job-related terms or processes?
     * Is this email a job alert or job posting notification? Quote relevant parts if so.
     * Does it contain general information about job openings without being specific to an application?
     * Is it a newsletter or marketing email from a job search platform? Show evidence if applicable.

3. Based on your analysis, categorize the email as either "JobApplicationUpdate" for job application status or actions update/notice emails, or "OtherEmail" for all other emails. Wrap your category choice in <category> tags.

4. If the category is "JobApplicationUpdate", extract the following information and wrap it in appropriate XML tags:
   - Application status (one of: applied, interview, actions, rejected, offer)
   - jobId (if available)
   - companyName
   - companyLogo
   - role
   - location (if available)
   - is internship (true/false)

   Use the following guidelines for determining the application status:
   - "applied": When the email confirms that the user has applied for a certain role and is waiting for an update after initial application.
   - "interview": When the email mentions an upcoming interview or asks to schedule an interview time.
   - "actions": When the company provides a link to complete certain tasks (asynchronous actions).
   - "rejected": When the email informs that the application was not successful.
   - "offer": When the email extends a job offer.

5. For all information that's not available, fill the fields with "N/A"
Your complete response should look like this, don't include any further thought process and 

<category>
JobApplicationUpdate/OtherEmail
</category>

If the category is JobApplicationUpdate, include:

<application_status>status</application_status>
<job_id>id if available</job_id>
<company_name>name</company_name>
<company_logo>logo info if available</company_logo>
<role>job role</role>
<is_internship>true/false</is_internship>
<location>location if available</location>

If the category is OtherEmail, no additional information is needed.

Here is the email content you need to analyze:

<email_subject>
{{SUBJECT}}
</email_subject>

<email_sender>
{{SENDER}}
</email_sender>

<email_body>
{{TEXT}}
</email_body>`;

export const JobTitleSimilarityPrompt = `
You are an AI assistant specialized in analyzing job titles and determining their similarities. Your task is to compare a list of job titles to a target job title, identify which ones are closely related, and rank them based on their similarity.

Here is the list of job titles to analyze:
<job_titles_list>
{{JOB_TITLES_LIST}}
</job_titles_list>

The target job title is:
<target_job_title>
{{TARGET_JOB_TITLE}}
</target_job_title>

Please follow these steps to complete the task:

1. Carefully read through the job titles list and the target job title.

2. Identify the key characteristics of the target job title, considering:
   - Specific job functions and primary responsibilities
   - Required technical skills and competencies
   - Industry or sector specialization
   - Level of seniority or responsibility
   - Educational or experience requirements

3. Analyze each job title in the list, considering the factors you identified for the target job title to determine if it is closely related.

4. Follow these step to compare
   - Categorize each as "Related" or "Unrelated"
   - Provide a brief reason for each categorization, referencing the key characteristics of the target job title
   - For related job titles, note key similarities with the target job title
   - Be stringent in your criteria for relatedness, ensuring that jobs in different functional areas (e.g., data analyst vs. software engineer) are not considered related unless they share significant overlapping responsibilities or skills

5. Remove any job titles that are not closely related to the target job title.

6. Rank the remaining related job titles from most similar to least similar to the target job title.

Example output structure (using generic job titles), make sure the output format is the job titles seperated by commas and don't include any further analysis or explanation
<ranked_list>
Related Job X, Related Job Y, Related Job Z
</ranked_list>
`;
