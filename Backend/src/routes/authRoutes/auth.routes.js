import express from "express"
const AuthRouter = express.Router()
import AuthController from "../../controllers/auth.controller.js"
import identifyUser from "../../middlewares/auth.middleware.js"
import { registerValidator, loginValidator } from "../../validator/auth.validator.js"


// ******* User Register *******
AuthRouter.post("/register",
    registerValidator,
    AuthController.registerController)


// ******* User Login *******
AuthRouter.post("/login",
    loginValidator,
    AuthController.loginController)


// ******* User Loout *******
AuthRouter.get("/logout",
    AuthController.logoutController)


// ******* User get-me *******
AuthRouter.get("/get-me",
    identifyUser,
    AuthController.getMEUserController)


// ******* User email verify  *******
AuthRouter.post("/verify-email",
    AuthController.VerifyEmail);

AuthRouter.post("/resend-verification-email",
    identifyUser,
    AuthController.resendVerificationEmailController);


// ==================== Forgot Password ====================

AuthRouter.post(
    "/forgot-password",
    AuthController.forgotPasswordController
);

AuthRouter.post(
    "/verify-otp",
    AuthController.verifyResetOTPController
);

AuthRouter.post(
    "/reset-password",
    AuthController.resetPasswordController
);



// ==================== Google OAuth ====================

AuthRouter.get(
    "/google",
    AuthController.googleAuthController
);

AuthRouter.get(
    "/google/callback",
    AuthController.googleLoginController
);

// ==================== Github OAuth ====================

AuthRouter.get(
    "/github",
    AuthController.githubAuthController
);

AuthRouter.get(
    "/github/callback",
    AuthController.githubLoginController
);


export default AuthRouter