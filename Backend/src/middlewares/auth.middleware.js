import userModel from "../models/auth/user.model.js";
import userBlackList from "../models/auth/userblacklist.model.js"
import jwt from "jsonwebtoken"

async function identifyUser(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const isBlackList = await userBlackList.findOne({
            token,
        });

        if (isBlackList) {
            return res.status(401).json({
                success: false,
                message: "User Blacklisted",
            });
        }

        const user = await userModel
            .findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token or expired session",
        });
    }
}

export default identifyUser;