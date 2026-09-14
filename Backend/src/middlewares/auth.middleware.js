import userModel from "../model/authModel/user.model.js";
import userBlacklist from "../model/authModel/userBlacklist.model.js";
import jwt from "jsonwebtoken";

// ==================== Identify User ====================

const identifyUser = async (req, res, next) => {
    try {
        // Get token from browser cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Check if token is blacklisted
        const isBlackList = await userBlacklist.findOne({
            token,
        });

        if (isBlackList) {
            return res.status(401).json({
                success: false,
                message: "User Blacklisted",
            });
        }

        // Find user using userId from JWT payload
        const user = await userModel
            .findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Attach user to request
        req.user = user;

        // Continue to controller
        next();

    } catch (error) {
        console.error("Identify User Error:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid token or expired session",
        });
    }
};

export default identifyUser;