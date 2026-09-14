import "dotenv/config";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import AuthRouter from "./routes/authRoutes/auth.routes.js";
import contactRoute from "./routes/profileRoutes/contact.routes.js";
import ProfileRouter from "./routes/profileRoutes/profile.routes.js";

const app = express();

// Global middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

// Route handlers
app.use("/auth", AuthRouter);
app.use("/auth", contactRoute);
app.use("/auth", ProfileRouter);



export default app;