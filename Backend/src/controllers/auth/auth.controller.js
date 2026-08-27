import userModel from "../../models/auth/user.model.js"
import { hashPassword, comparePassword } from "../../utils/password.js";
import { createToken, verifyToken, setTokenCookie } from "../../utils/token.js";
import BlackListModel from "../../models/auth/userblacklist.model.js";
import ProfileModel from "../../models/auth/userProfile.model.js";
import { sendMail } from "../../services/mail/mail.service.js"




// ***** Register User *****
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await hashPassword(password);
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
        });
        const token = createToken(user._id);
        setTokenCookie(res, token);
        const emailVerificationToken = createToken(user._id);

        await sendMail({
            to: email,
            subject: "Welcome to LexarAI ChatBot 🤖",
            html: `
            <div div style = "max-width:600px;margin:40px auto;padding:40px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Arial,Helvetica,sans-serif;color:#374151;line-height:1.7;" >
            <h1 style="margin:0;font-size:28px;color:#111827;">
            Welcome to <span style="color:#2563eb;">LexarCoder</span> 🚀
            </h1>
            <p style="margin:24px 0 0;">
            Hi <strong>${user.username}</strong>,
            </p>
            <p style="margin:16px 0;">
            Thank you for creating your LexarCoder account. To activate your account and access all features, please verify your email address.
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
            Welcome to LexarCoder
            Hi ${user.username},
            Thank you for creating your LexarCoder account.
            Please verify your email address to activate your account and access all features.
            Verify your email:${process.env.CLIENT_URL}/auth/verify-email?token=${emailVerificationToken}
            This verification link will remain valid for 7 days.
            If you didn't create this account, you can safely ignore this email.
             Regards,
            LexarCoder Team
                `
        });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message,
        });
    }
};

// ******* User Login*****
async function loginUserController(req, res) {
    try {
        const { loginId, password } = req.body;

        const user = await userModel
            .findOne({
                $or: [
                    { email: loginId },
                    { username: loginId },
                ],
            })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid login ID or password",
            });
        }
        if (user.authProvider === "google" || !user.password) {
            return res.status(400).json({
                success: false,
                message: "This account uses Google Login. Please login with Google.",
            });
        }

        const isPasswordCorrect = await comparePassword(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid login ID or password",
            });
        }

        const token = createToken(user._id);

        setTokenCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

// ******* User Logout *******
async function logoutUserController(req, res) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token not found",
            });
        }

        // 1. blacklist first
        await BlackListModel.create({ token });

        // 2. clear cookie properly
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });



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

// ******* User Get-me *******
async function getMeUserController(req, res) {
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

        const profile = await ProfileModel.findOne({
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

// ******* User Get-me Profile*******
async function getUserProfileController(req, res) {
    try {
        const userId = req.user.id;

        const {
            firstName,
            lastName,
            contact,
            gender,
            dob,
            bio,
            country,
            state,
            district,
            pincode,
        } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let profile = await ProfileModel.findOne({
            user: userId,
        });

        if (!profile) {
            profile = await ProfileModel.create({
                user: userId,
                email: user.email,
                firstName,
                lastName,
                contact,
                gender,
                dob,
                bio,
                country,
                state,
                district,
                pincode,
            });

            return res.status(201).json({
                success: true,
                message: "Profile Created Successfully",
                profile,
            });
        }

        if (firstName !== undefined) profile.firstName = firstName;
        if (lastName !== undefined) profile.lastName = lastName;
        if (contact !== undefined) profile.contact = contact;
        if (gender !== undefined) profile.gender = gender;
        if (dob !== undefined) profile.dob = dob;
        if (bio !== undefined) profile.bio = bio;
        if (country !== undefined) profile.country = country;
        if (state !== undefined) profile.state = state;
        if (district !== undefined) profile.district = district;
        if (pincode !== undefined) profile.pincode = pincode;

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            profile,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


// ******* User Email Verification Controller *******
async function verifyEmailController(req, res) {
    try {
        const { token } = req.securedCookies || req.cookies || req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Verification token is required",
            });
        }

        const decoded = verifyToken(token);

        const user = await userModel.findById(decoded.userId);

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

        return res.redirect(
            `${process.env.CLIENT_URL}/auth/verify-email`
        );

    } catch (error) {
        console.error("Email Verification Error:", error);

        return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
            err: error.message,
        });
    }
}


// ******* User Resend Verification Email Controller *******
async function resendVerificationEmailController(req, res) {
    try {

        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Already Verified
        if (user.verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified.",
            });
        }

        // Generate New Verification Token
        const emailVerificationToken = createToken(user._id);
        // Send Email
        await sendMail({
            to: user.email,
            subject: "Verify Your Email - LexarAI Chatbot 🤖",
            html: `
            <div div style = "max-width:600px;margin:40px auto;padding:40px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Arial,Helvetica,sans-serif;color:#374151;line-height:1.7;" >
            <h1 style="margin:0;font-size:28px;color:#111827;">
            Welcome to <span style="color:#2563eb;">LexarCoder</span> 🚀
            </h1>
            <p style="margin:24px 0 0;">
            Hi <strong>${user.username}</strong>,
            </p>
            <p style="margin:16px 0;">
            Thank you for creating your LexarCoder account. To activate your account and access all features, please verify your email address.
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
            Welcome to LexarCoder
            Hi ${user.username},
            Thank you for creating your LexarCoder account.
            Please verify your email address to activate your account and access all features.
            Verify your email:${process.env.CLIENT_URL}/auth/verify-email?token=${emailVerificationToken}
            This verification link will remain valid for 7 days.
            If you didn't create this account, you can safely ignore this email.
             Regards,
            LexarCoder Team
                `
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


// ******** User Password Forget ********

async function  forgotPasswordController(req, res){
try {
    const { email } = req.body;

    if(!email){
        return res.status(400).json({
            success: false,
            message: "Email is required",
        });
    }
    const user = await userModel.findOne({ email });
    if(!user){
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
        to: email,
        subject: "Password Reset OTP - LexarAI ChatBot 🔐",
        html: `
        <div style="max-width:600px;margin:40px auto;padding:40px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;font-family:Arial,Helvetica,sans-serif;color:#374151;line-height:1.7;">

            <h1 style="margin:0;font-size:28px;color:#111827;">
                Password Reset <span style="color:#2563eb;">LexarCoder</span> 🔐
            </h1>

            <p style="margin:24px 0 0;">
                Hi <strong>${user.username}</strong>,
            </p>

            <p style="margin:16px 0;">
                We received a request to reset the password for your LexarCoder account.
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
        Password Reset OTP - LexarCoder

        Hi ${user.username},

        We received a request to reset the password for your LexarCoder account.

        Your password reset OTP is: ${otp}

        This OTP will remain valid for 5 minutes.

        If you didn't request a password reset, you can safely ignore this email.

        Regards,
        LexarCoder Team
    `
    });

    return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email",
    });


 
} catch (error) {
    console.error("Error sending OTP:", error);
    res.state(500).json({
        success: false,
        message: "Internal server error",
    }); 
}
};

// ******** Verify Password Reset OTP ********

async function verifyResetOTPController(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        if(!user.resetPasswordOTP || !user.resetPasswordOTPExpires){

            return res.status(400).json({
                success: false,
                message: "No OTP request found. Please request a new OTP.",
            });
        }

        if(!user.resetPasswordOTPExpires || user.resetPasswordOTPExpires < Date.now()){
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP.",
            });
        }


        if(user.resetPasswordOTP !== otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }

        res.status(200).json({
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

// ******** User Reset OTP ********

async function resetPasswordController(req, res) {
    try {

        const {email , newPassword} = req.body;
        if(!email || !newPassword){ 
            return res.status(400).json({
                success: false,
                message: "Email and new password are required",
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpires = null;

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

export default {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeUserController,
    getUserProfileController,
    verifyEmailController,
    resendVerificationEmailController,
    forgotPasswordController,
    verifyResetOTPController,
    resetPasswordController
};