import { Router } from "express";

import AuthUser from "../../controllers/auth/auth.controller.js";
import AuthOAuth from "../../controllers/auth/oauth.controller.js";

import userIdentify from "../../middlewares/auth.middleware.js";

const authRouter = Router();


// ==================== Local Auth ====================

authRouter.post("/register", AuthUser.registerUserController);
authRouter.post("/login", AuthUser.loginUserController);
authRouter.post("/logout", AuthUser.logoutUserController);

authRouter.get(
    "/profile",
    userIdentify,
    AuthUser.getUserProfileController
);

authRouter.get(
    "/getme",
    userIdentify,
    AuthUser.getMeUserController
);


// ==================== Email Verification ====================

authRouter.post(
    "/verify-email",
    AuthUser.verifyEmailController
);

authRouter.post(
    "/resend-verification-email",
    userIdentify,
    AuthUser.resendVerificationEmailController
);


// ==================== Forgot Password ====================

authRouter.post(
    "/forgot-password",
    AuthUser.forgotPasswordController
);

authRouter.post(
    "/verify-otp",
    AuthUser.verifyResetOTPController
);

authRouter.post(
    "/reset-password",
    AuthUser.resetPasswordController
);


// ==================== Google OAuth ====================

authRouter.get(
    "/google",
    AuthOAuth.googleAuthController
);

authRouter.get(
    "/google/callback",
    AuthOAuth.googleLoginController
);

// ==================== Github OAuth ====================

authRouter.get(
    "/github",
    AuthOAuth.githubAuthController
);

authRouter.get(
    "/github/callback",
    AuthOAuth.githubCallbackController
);


export default authRouter;