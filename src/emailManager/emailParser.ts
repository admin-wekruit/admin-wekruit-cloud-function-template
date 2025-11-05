// Define types for clarity (simplified Gmail API message part structure)
export interface MessagePart {
    mimeType: string;
    filename?: string;
    body?: {
        data?: string; // Base64url encoded content (if this part has data)
        size?: number;
    };
    parts?: MessagePart[]; // Child parts if this is a multipart container
}

/**
 * Decode a base64url string (from Gmail API) to a UTF-8 string.
 * Decodes a base64url encoded string from the Gmail API into a UTF-8 string.
 * Handles the URL-safe variant of base64 encoding used by Gmail API by replacing
 * URL-safe characters back to standard base64 characters before decoding.
 *
 * @param {string} data - The base64url encoded string to decode
 * @return {string} The decoded UTF-8 string, or empty string if decoding fails
 * @throws {Error} Will not throw, but logs warning if decoding fails
 *
 */
function decodeBase64Url(data: string): string {
    // Gmail uses URL-safe Base64: replace '-' and '_' back to standard '+' and '/'
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    // Decode the base64 string into a UTF-8 decoded string
    try {
        // atob is available in browser; Buffer.from in Node
        if (typeof atob === "function") {
            return atob(base64);
        } else {
            return Buffer.from(base64, "base64").toString("utf-8");
        }
    } catch (e) {
        console.warn("Failed to decode base64 string", e);
        return "";
    }
}

/**
 * Convert an HTML string to plain text by removing tags.
 * This is a simple implementation; for complex HTML, consider using a library.
 * @param {string} html - The HTML string to convert to plain text
 * @return {string} The plain text version of the HTML content
 */
function htmlToPlainText(html: string): string {
    // Remove style and script content
    html = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    // Replace line breaks and paragraph tags with newlines for readability
    html = html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n");
    // Remove all remaining HTML tags
    const text = html.replace(/<[^>]+>/g, "");
    // Decode common HTML entities (optional: use a library for full coverage)
    return text
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, "\"")
        .replace(/&#39;/gi, "'");
}

/**
 * Recursively extract all text content from a Gmail API MessagePart.
 * @param {MessagePart} part - The message part to extract text from
 * @return {string} The extracted text content from the message part
 */
function extractTextFromPart(part: MessagePart): string {
    const mimeType = part.mimeType || "";
    if (mimeType.startsWith("multipart/")) {
        // Multipart container: traverse each child part
        let accumulatedText = "";
        if (part.parts) {
            for (const subPart of part.parts) {
                accumulatedText += extractTextFromPart(subPart) + "\n";
            }
        }
        return accumulatedText;
    } else if (mimeType === "text/plain") {
        // Plain text part: decode and return the text
        const data = part.body?.data || "";
        const decoded = decodeBase64Url(data);
        return decoded.trim();
    } else if (mimeType === "text/html") {
        // HTML part: decode, convert to text, and return
        const data = part.body?.data || "";
        const decodedHtml = decodeBase64Url(data);
        const plainText = htmlToPlainText(decodedHtml);
        return plainText.trim();
    } else if (mimeType === "message/rfc822") {
        // Embedded email (forwarded email as attachment)
        if (part.parts && part.parts.length) {
            // If Gmail API already parsed it into parts, recurse
            let innerText = "";
            for (const subPart of part.parts) {
                innerText += extractTextFromPart(subPart) + "\n";
            }
            return innerText;
        } else {
            // If no parsed parts, try decoding the entire attached email (it will be an EML file)
            const data = part.body?.data || "";
            const decodedEmail = decodeBase64Url(data);
            // Optionally, we could parse `decodedEmail` as raw MIME by feeding it into this function again
            // if we had a parser, but for simplicity, treat it as plain text:
            return decodedEmail.trim();
        }
    } else {
        // Non-text part (image, application, etc.) – ignore in text extraction
        return "";
    }
}

/**
 * Extracts all text content from an email message (Gmail API message format).
 * @param {Object} message - The Gmail API message object
 * @param {MessagePart} message.payload - The message payload containing the content
 * @return {string} The combined text content from all parts of the email, trimmed of extra whitespace
 */
export function extractEmailContent(message: { payload: MessagePart }): string {
    if (!message.payload) return "";
    const fullText = extractTextFromPart(message.payload);
    // Clean up extra newlines and return
    return fullText.trim();
}
