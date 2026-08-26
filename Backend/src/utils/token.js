import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "7d";

const getSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env");
    }

    return process.env.JWT_SECRET;
};

// Create JWT token
export const createToken = (userId) => {
    return jwt.sign(
        { userId },
        getSecret(),
        {
            expiresIn: JWT_EXPIRES_IN,
        }
    );
};

// Save token in browser cookie
export const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

// Get/verify token
export const verifyToken = (token) => {
    if (!token) {
        throw new Error("Token is required");
    }

    return jwt.verify(token, getSecret());
};