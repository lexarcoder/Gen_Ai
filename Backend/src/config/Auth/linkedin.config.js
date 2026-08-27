const {
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET,
    LINKEDIN_CALLBACK_URL,
} = process.env;


// ==================== Environment Validation ====================

if (!LINKEDIN_CLIENT_ID) {
    throw new Error(
        "LINKEDIN_CLIENT_ID is not set. Please add LINKEDIN_CLIENT_ID to your .env file."
    );
}

if (!LINKEDIN_CLIENT_SECRET) {
    throw new Error(
        "LINKEDIN_CLIENT_SECRET is not set. Please add LINKEDIN_CLIENT_SECRET to your .env file."
    );
}

if (!LINKEDIN_CALLBACK_URL) {
    throw new Error(
        "LINKEDIN_CALLBACK_URL is not set. Please add LINKEDIN_CALLBACK_URL to your .env file."
    );
}


// ==================== LinkedIn OAuth Config ====================

const linkedinOAuthConfig = {
    clientId: LINKEDIN_CLIENT_ID,
    clientSecret: LINKEDIN_CLIENT_SECRET,
    callbackURL: LINKEDIN_CALLBACK_URL,
};

export default linkedinOAuthConfig;