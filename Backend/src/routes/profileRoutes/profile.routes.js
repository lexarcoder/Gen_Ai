import express from "express" 
const ProfileRouter = express.Router()
import identifyUser from "../../middlewares/auth.middleware.js"
import ProfileController from "../../controllers/profile.controller.js"
import upload from "../../middlewares/multer.middleware.js"


// ****** User UserProfile   *******
ProfileRouter.post("/profile", identifyUser, upload.single("profileImg"), ProfileController.getUserProfileController)

export default ProfileRouter