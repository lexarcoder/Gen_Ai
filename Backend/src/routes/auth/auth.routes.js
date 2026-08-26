import {Router} from "express";
import AuthUser from "../../controllers/auth/auth.controller.js";
const authRouter = Router();
import userIdentify from "../../middlewares/auth.middleware.js";


authRouter.post("/register", AuthUser.registerUserController);
authRouter.post("/login", AuthUser.loginUserController);
authRouter.post("/logout", AuthUser.logoutUserController);
authRouter.get("/profile", userIdentify, AuthUser.getUserProfileController);
authRouter.get("/getme", userIdentify, AuthUser.getMeUserController);
authRouter.post("/verify-email", AuthUser.verifyEmailController);
authRouter.post("/resend-verification-email", userIdentify, AuthUser.resendVerificationEmailController);


export default authRouter;
