import { google } from "googleapis";
// ==================== Google OAuth Environment ====================

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
} = process.env;


// ==================== Environment Validation ====================

if (!GOOGLE_CLIENT_ID) {
    throw new Error(
        "GOOGLE_CLIENT_ID is not set. Please add GOOGLE_CLIENT_ID to your .env file."
    );
}

if (!GOOGLE_CLIENT_SECRET) {
    throw new Error(
        "GOOGLE_CLIENT_SECRET is not set. Please add GOOGLE_CLIENT_SECRET to your .env file."
    );
}

if (!GOOGLE_CALLBACK_URL) {
    throw new Error(
        "GOOGLE_CALLBACK_URL is not set. Please add GOOGLE_CALLBACK_URL to your .env file."
    );
}


// ==================== Google OAuth Client ====================

const googleOAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL
);

export default googleOAuth2Client;