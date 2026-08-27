import { google } from "googleapis";

import googleOAuth2Client from "../../config/Auth/google.config.js";
import githubOAuth2Client from "../../config/Auth/github.config.js";
import UserModel from "../../models/auth/user.model.js";

import {
    createToken,
    setTokenCookie,
} from "../../utils/token.js";


// ==================== Google Login ====================
async function googleAuthController(req, res) {
    try {
        const scopes = [
            "openid",
            "email",
            "profile",
        ];

        const authUrl = googleOAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            prompt: "select_account",
        });

        console.log("Google OAuth URL:", authUrl);

        return res.redirect(authUrl);

    } catch (error) {
        console.error("Google OAuth Start Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to start Google login",
        });
    }
}

// ==================== Google Callback ====================
async function googleLoginController(req, res) {
    try {
        const { code } = req.query;

        // Check authorization code
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Google authorization code is missing",
            });
        }


        // ==================== Get Google Tokens ====================

        const { tokens } = await googleOAuth2Client.getToken(code);

        googleOAuth2Client.setCredentials(tokens);


        // ==================== Get Google User ====================

        const oauth2 = google.oauth2({
            auth: googleOAuth2Client,
            version: "v2",
        });

        const { data: googleUser } = await oauth2.userinfo.get();

        const {
            id: googleId,
            email,
            name,
            verified_email,
        } = googleUser;


        // Check Google user data
        if (!googleId || !email) {
            return res.status(400).json({
                success: false,
                message: "Unable to get Google account information",
            });
        }


        const userEmail = email.toLowerCase();


        // ==================== Find User ====================

        let user = await UserModel.findOne({
            email: userEmail,
        });


        // ==================== New Google User ====================

        if (!user) {
            user = await UserModel.create({
                username: name || userEmail.split("@")[0],
                email: userEmail,
                verified: verified_email === true,
                googleId,
                authProvider: "google",
            });
        }


        // ==================== Existing User ====================

        else {

            // Link Google account if not already linked
            if (!user.googleId) {
                user.googleId = googleId;
            }

            // Mark email as verified
            if (verified_email === true) {
                user.verified = true;
            }

            await user.save();
        }


        // ==================== Create JWT ====================

        const token = createToken(user._id);


        // ==================== Set Cookie ====================

        setTokenCookie(res, token);


        // ==================== Success ====================

        return res.status(200).json({
            success: true,
            message: "Google login successful",

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Google Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Google login failed",
        });
    }
}

// ==================== GitHub OAuth Start ====================
async function githubAuthController(req, res) {
    try {
        const params = new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID,
            redirect_uri: process.env.GITHUB_CALLBACK_URL,
            scope: "read:user user:email",
        });

        const githubAuthUrl =
            `https://github.com/login/oauth/authorize?${params.toString()}`;

        return res.redirect(githubAuthUrl);

    } catch (error) {
        console.error("GitHub OAuth Start Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to start GitHub login",
        });
    }
}


// ==================== GitHub Callback ====================
async function githubCallbackController(req, res) {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "GitHub authorization code is missing",
            });
        }


        // ==================== Get GitHub Access Token ====================

        const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "POST",

                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                }),
            }
        );

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.access_token) {
            console.error("GitHub Token Error:", tokenData);

            return res.status(401).json({
                success: false,
                message: "Failed to get GitHub access token",
            });
        }


        // ==================== Get GitHub User ====================

        const userResponse = await fetch(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const githubUser = await userResponse.json();

        if (!userResponse.ok) {
            return res.status(401).json({
                success: false,
                message: "Failed to get GitHub user",
            });
        }


        // ==================== Get GitHub Email ====================

        const emailResponse = await fetch(
            "https://api.github.com/user/emails",
            {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const githubEmails = await emailResponse.json();

        if (!emailResponse.ok) {
            return res.status(401).json({
                success: false,
                message: "Failed to get GitHub email",
            });
        }

        const primaryEmail = githubEmails.find(
            (email) => email.primary && email.verified
        );

        if (!primaryEmail) {
            return res.status(400).json({
                success: false,
                message: "No verified email found on GitHub",
            });
        }


        // ==================== Find Existing User ====================

        const userEmail = primaryEmail.email.toLowerCase();

        let user = await UserModel.findOne({
            email: userEmail,
        });


        // ==================== Create New GitHub User ====================

        if (!user) {
            user = await UserModel.create({
                username: githubUser.name || githubUser.login,
                email: userEmail,
                verified: true,
                githubId: String(githubUser.id),
                authProvider: "github",
            });
        }


        // ==================== Existing User ====================

        else {
            // Link GitHub account
            if (!user.githubId) {
                user.githubId = String(githubUser.id);
            }

            // GitHub verified email
            user.verified = true;

            await user.save();
        }


        // ==================== Create JWT ====================

        const token = createToken(user._id);


        // ==================== Set Cookie ====================

        setTokenCookie(res, token);


        // ==================== Success ====================

        return res.status(200).json({
            success: true,
            message: "GitHub login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("GitHub Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "GitHub login failed",
        });
    }
}




// ==================== Export ====================
export default {
    googleAuthController,
    googleLoginController, 
    githubAuthController,
    githubCallbackController,
};