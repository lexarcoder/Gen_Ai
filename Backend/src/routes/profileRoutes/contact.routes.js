import express from "express";
const contactRouter = express.Router();
import ContactController from "../../controllers/contact.controller.js";
import identifyUser from "../../middlewares/auth.middleware.js";

// POST /api/contact
contactRouter.post("/contact", identifyUser, ContactController.contactController);


export default contactRouter