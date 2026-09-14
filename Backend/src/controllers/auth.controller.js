import userModel from "../model/authModel/user.model.js";
import blackListModel from "../model/authModel/userBlacklist.model.js";
import { sendMail } from "../services/mail.service.js";
import profileModel from "../model/profileModel/userProfile.model.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import googleOAuth2Client from "../config/Auth/google.config.js";
import {
    createToken,
    setTokenCookie,
    clearTokenCookie,
} from "../utils/token.js";

// ==================== User Registration ====================

async function registerController(req, res) {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    existingUser.email === email
                        ? "Email already exists"
                        : "Username already exists",
            });
        }

        // ==================== Create User ====================

        const newUser = await userModel.create({
            username,
            email,
            password,
        });

        // ==================== Email Verification Token ====================

        const emailVerificationToken = createToken({
            id: newUser._id,
        });

        // ==================== Login Token ====================

        const token = createToken(newUser._id);

        // ==================== Save Login Token in Cookie ====================

        setTokenCookie(res, token);

        // ==================== Send Verification Email ====================

        await sendMail({
            to: email,
            subject: "Welcome to LexarAI 🤖",

            html: `
                <div style="max-width:600px;margin:40px auto;padding:40px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Arial,Helvetica,sans-serif;color:#374151;line-height:1.7;">

                    <h1 style="margin:0;font-size:28px;color:#111827;">
                        Welcome to <span style="color:#2563eb;">LexarAI</span> 🚀
                    </h1>

                    <p style="margin:24px 0 0;">
                        Hi <strong>${newUser.username}</strong>,
                    </p>

                    <p style="margin:16px 0;">
                        Thank you for creating your LexarAI  account.
                        To activate your account and access all features,
                        please verify your email address.
                    </p>

                    <div style="text-align:center;margin:32px 0;">

                        <a
                            href="${process.env.CLIENT_URL}/auth/verify-email?token=${emailVerificationToken}"
                            style="display:inline-block;padding:14px 28px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;"
                        >
                            Verify Email
                        </a>

                    </div>

                    <p style="margin:0;color:#6b7280;font-size:14px;">
                        This verification link will remain valid for
                        <strong>7 days</strong>.
                    </p>

                    <p style="margin-top:16px;color:#6b7280;font-size:14px;">
                        If you didn't create this account,
                        you can safely ignore this email.
                    </p>

                    <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">

                    <p style="margin:0;color:#6b7280;font-size:14px;">
                        Regards,<br>
                        <strong style="color:#111827;">
                            LexarCoder Team
                        </strong>
                    </p>

                </div>
            `,

            text: `
Welcome to LexarAI 🤖

Hi ${newUser.username},

Thank you for creating your LexarAI  account.

Please verify your email address to activate your account and access all features.

Verify your email:

${process.env.CLIENT_URL}/auth/verify-email?token=${emailVerificationToken}

This verification link will remain valid for 7 days.

If you didn't create this account, you can safely ignore this email.

Regards,

LexarCoder Team
            `,
        });

        // ==================== Response ====================

        return res.status(201).json({
            success: true,
            message: "User registered successfully",

            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.error("Error registering user:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// ==================== User Login ====================
async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Login ID and Password are required",
            });
        }

        const login = email.trim().toLowerCase();

        const existingUser = await userModel
            .findOne({
              email,
            })
            .select("+password");

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await existingUser.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = createToken(existingUser._id);
        setTokenCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// ==================== User Get-Me ====================
async function getMEUserController(req, res) {
    try {
        const user = await userModel
            .findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profile = await profileModel.findOne({
            user: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
            profile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// ==================== User Logout ====================
async function logoutController(req, res) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not found",
            });
        }

        await blackListModel.create({ token });
        clearTokenCookie(res);

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// ==================== User Email Verification ====================
async function VerifyEmail(req, res) {
    const { token } = req.query;

    try {
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid token",
                err: "User not found",
            });
        }

        if (user.verified) {
            return res.send("<h2>Email already verified.</h2>");
        }

        user.verified = true;
        await user.save();

        return res.redirect(`${process.env.CLIENT_URL}/auth/verify-email`);
    } catch (error) {
        console.error("Email Verification Error:", error);

        return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
            err: error.message,
        });
    }
}

// ==================== Resend Verification Email ====================
async function resendVerificationEmailController(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified.",
            });
        }

        const emailVerificationToken = createToken({ id: user._id });

        await sendMail({
            to: user.email,
            subject: "Verify Your Email - LexarAI 🤖",
            html: `
                <div style="max-width:600px;margin:40px auto;padding:40px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Arial,Helvetica,sans-serif;color:#374151;line-height:1.7;">
                    <h1 style="margin:0;font-size:28px;color:#111827;">
                        Welcome to <span style="color:#2563eb;">LexarAI</span> 🚀
                    </h1>
                    <p style="margin:24px 0 0;">
                        Hi <strong>${user.username}</strong>,
                    </p>
                    <p style="margin:16px 0;">
                        Thank you for creating your LexarAI  account. To activate your account and access all features, please verify your email address.
                    </p>
                    <div style="text-align:center;margin:32px 0;">
                        <a href="${process.env.CLIENT_URL}/auth/verify-email?token=${emailVerificationToken}"
                            style="display:inline-block;padding:14px 28px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">
                            Verify Email
                        </a>
                    </div>
                    <p style="margin:0;color:#6b7280;font-size:14px;">
                        This verification link will remain valid for <strong>7 days</strong>.
                    </p>
                    <p style="margin-top:16px;color:#6b7280;font-size:14px;">
                        If you didn't create this account, you can safely ignore this email.
                    </p>
                    <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:14px;">
                        Regards,<br>
                        <strong style="color:#111827;">LexarCoder Team</strong>
                    </p>
                </div>
            `,
            text: `
Welcome to LexarAI 

Hi ${user.username},

Thank you for creating your LexarAI  account.

Please verify your email address to activate your account and access all features.

Verify your email:
${process.env.CLIENT_URL}/auth/verify-email?token=${emailVerificationToken}

This verification link will remain valid for 7 days.

If you didn't create this account, you can safely ignore this email.

Regards,
LexarCoder Team
            `,
        });

        return res.status(200).json({
            success: true,
            message: "Verification email sent successfully.",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// ==================== User Forgot Password ====================
async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpires = Date.now() + 5 * 60 * 1000;

        await user.save();

        await sendMail({
            to: user.email,
            subject: "Password Reset OTP - LexarAI 🤖",
            html: `
                <div style="max-width:600px;margin:40px auto;padding:40px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Arial,Helvetica,sans-serif;color:#374151;line-height:1.7;">
                    <h1 style="margin:0;font-size:28px;color:#111827;">
                        Password Reset <span style="color:#2563eb;">LexarAI</span> 🔐
                    </h1>
                    <p style="margin:24px 0 0;">
                        Hi <strong>${user.username}</strong>,
                    </p>
                    <p style="margin:16px 0;">
                        We received a request to reset the password for your LexarAI account.
                        Use the OTP below to verify your identity and continue with the password reset.
                    </p>
                    <div style="text-align:center;margin:32px 0;">
                        <div style="display:inline-block;padding:16px 28px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:8px;">
                            <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#2563eb;">
                                ${otp}
                            </span>
                        </div>
                    </div>
                    <p style="margin:0;color:#6b7280;font-size:14px;">
                        This OTP will remain valid for <strong>5 minutes</strong>.
                    </p>
                    <p style="margin-top:16px;color:#6b7280;font-size:14px;">
                        If you didn't request a password reset, you can safely ignore this email.
                    </p>
                    <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;">
                    <p style="margin:0;color:#6b7280;font-size:14px;">
                        Regards,<br>
                        <strong style="color:#111827;">LexarCoder Team</strong>
                    </p>
                </div>
            `,
            text: `
Password Reset OTP - LexarAI 

Hi ${user.username},

We received a request to reset the password for your LexarAI  account.

Your password reset OTP is: ${otp}

This OTP will remain valid for 5 minutes.

If you didn't request a password reset, you can safely ignore this email.

Regards,
LexarCoder Team
            `,
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email",
        });
    } catch (error) {
        console.error("Error sending OTP:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// ==================== Verify Password Reset OTP ====================
async function verifyResetOTPController(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
            return res.status(400).json({
                success: false,
                message: "No OTP request found. Please request a new OTP.",
            });
        }

        if (user.resetPasswordOTPExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP.",
            });
        }

        if (user.resetPasswordOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }


        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. You can now reset your password.",
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// ==================== User Reset Password ====================
async function resetPasswordController(req, res) {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and new password are required",
            });
        }

        const user = await userModel.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (
            !user.resetPasswordOTP ||
            !user.resetPasswordOTPExpires ||
            user.resetPasswordOTPExpires < Date.now()
        ) {
            return res.status(400).json({
                success: false,
                message: "OTP verification required",
            });
        }

        // Don't hash here.
        // userSchema.pre("save") will hash it automatically.
        user.password = newPassword;

        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

// ==================== Google OAuth ====================

async function googleAuthController(req, res) {
    try {
        const scopes = ["openid", "email", "profile"];

        const authUrl = googleOAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            prompt: "select_account",
        });

        return res.redirect(authUrl);
    } catch (error) {
        console.error("Google OAuth Start Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to start Google login",
        });
    }
}


async function googleLoginController(req, res) {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Google authorization code is missing",
            });
        }

        // Get Google access token
        const { tokens } = await googleOAuth2Client.getToken(code);

        if (!tokens?.access_token) {
            return res.status(401).json({
                success: false,
                message: "Unable to get Google access token",
            });
        }

        googleOAuth2Client.setCredentials(tokens);

        // Get Google user information
        const oauth2 = google.oauth2({
            auth: googleOAuth2Client,
            version: "v2",
        });

        const { data: googleUser } = await oauth2.userinfo.get();

        const {
            id: googleId,
            email,
            name,
            picture,
            verified_email,
        } = googleUser;



        if (!googleId || !email) {
            return res.status(400).json({
                success: false,
                message: "Unable to get Google account information",
            });
        }

        const userEmail = email.toLowerCase();

        // Find user
        let user = await userModel.findOne({
            email: userEmail,
        });

        // Create new user
        if (!user) {
            user = await userModel.create({
                username: name || userEmail.split("@")[0],
                email: userEmail,
                profileImg: picture || "",
                verified: verified_email === true,
                googleId: String(googleId),
                authProvider: "google",
            });
        }


        // Update existing user
        else {
            if (!user.googleId) {
                user.googleId = String(googleId);
            }

            if (picture) {
                user.profileImg = picture;
            }

            if (verified_email === true) {
                user.verified = true;
            }

            if (!user.authProvider) {
                user.authProvider = "google";
            }

            await user.save();
        }


        // Create JWT
        const token = createToken(user._id);

        // Save JWT in cookie
        setTokenCookie(res, token);

        // Redirect frontend
        return res.redirect(process.env.CLIENT_URL);

    }
    catch (error) {
        console.error("Google Login Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// ==================== GitHub OAuth ====================

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


async function githubLoginController(req, res) {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "GitHub authorization code is missing",
            });
        }

        // Exchange code for access token
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

        const accessToken = tokenData.access_token;

        // Get GitHub profile
        const userResponse = await fetch(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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

        // Get GitHub emails
        const emailResponse = await fetch(
            "https://api.github.com/user/emails",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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

        // Find primary verified email
        const primaryEmail = githubEmails.find(
            (email) => email.primary && email.verified
        );

        if (!primaryEmail) {
            return res.status(400).json({
                success: false,
                message: "No verified email found on GitHub",
            });
        }

        const userEmail = primaryEmail.email.toLowerCase();

        // Find user
        let user = await userModel.findOne({
            email: userEmail,
        });

        // Create new user
        if (!user) {
            user = await userModel.create({
                username: githubUser.name || githubUser.login,
                email: userEmail,
                profileImg: githubUser.avatar_url || "",
                verified: true,
                githubId: String(githubUser.id),
                authProvider: "github",
            });
        }

        // Update existing user
        else {
            if (!user.githubId) {
                user.githubId = String(githubUser.id);
            }

            if (githubUser.avatar_url) {
                user.profileImg = githubUser.avatar_url;
            }

            user.verified = true;

            if (!user.authProvider) {
                user.authProvider = "github";
            }

            await user.save();
        }

        // Create JWT
        const token = createToken(user._id);

        // Save JWT in cookie
        setTokenCookie(res, token);

        // Redirect frontend
        return res.redirect(process.env.CLIENT_URL);

    } catch (error) {
        console.error("GitHub Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "GitHub login failed",
        });
    }
}

export default {
    registerController,
    loginController,
    logoutController,
    resendVerificationEmailController,
    getMEUserController,
    VerifyEmail,
    googleAuthController,
    googleLoginController,
    githubAuthController,
    githubLoginController,
    forgotPasswordController,
    verifyResetOTPController,
    resetPasswordController,
};