// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//     {
//         username: {
//             type: String,
//             required: [true, "Username is required"],
//             trim: true,
//             minlength: 3,
//             maxlength: 30,
//             unique: [true, "Username already exists"],
//         },

//         email: {
//             type: String,
//             required: [true, "Email is required"],
//             lowercase: true,
//             trim: true,
//             unique: [true, "Email already exists"],
//             match: [
//                 /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//             ],
//         },

//         password: {
//             type: String,
//             required: [true, "Password is required"],
//             minlength: 6,
//             select: false,
//         },
//         verified: {
//             type: Boolean,
//             default: false,
//         },
//         resetPasswordOTP: {
//             type: String,
//             default: null,
//         },

//         resetPasswordOTPExpires: {
//             type: Date,
//             default: null,
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const UserModel = mongoose.model("User", userSchema);

// export default UserModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: 3,
            maxlength: 30,
            unique: [true, "Username already exists"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
            unique: [true, "Email already exists"],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email",
            ],
        },

        // local register ke liye required
        // Google user ke liye optional
        password: {
            type: String,
            minlength: 6,
            select: false,
            required: function () {
                return this.authProvider === "local";
            },
        },

        verified: {
            type: Boolean,
            default: false,
        },

        // Google Login
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        authProvider: {
            type: String,
            enum: ["local", "google", "github", "linkedin"],
            default: "local",
        },

        // Forgot Password
        resetPasswordOTP: {
            type: String,
            default: null,
        },

        resetPasswordOTPExpires: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;