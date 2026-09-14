import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: function () {
                return this.authProvider === "local";
            },
            trim: true,
            lowercase: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username must be at most 30 characters"],
            set: (value) =>
                value.trim().toLowerCase().replace(/\s+/g, ""),
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [emailRegex, "Please provide a valid email"],
        },

        profileImg: {
            type: String,
            default: "",
        },

        // ==================== Auth Provider ====================

        authProvider: {
            type: String,
            enum: ["local", "google", "github", "linkedin"],
            default: "local",
        },

        // ==================== Password ====================

        // Password is required ONLY for local users
        password: {
            type: String,
            required: function () {
                return this.authProvider === "local";
            },
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },

        // ==================== OAuth IDs ====================

        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },

        githubId: {
            type: String,
            unique: true,
            sparse: true,
        },

        linkedinId: {
            type: String,
            unique: true,
            sparse: true,
        },

        // ==================== Email Verification ====================

        verified: {
            type: Boolean,
            default: false,
        },

        // ==================== Forgot Password ====================

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

// ==================== Hash Password ====================

userSchema.pre("save", async function () {
    // OAuth users don't have a password
    if (!this.isModified("password") || !this.password) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

// ==================== Compare Password ====================

userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) {
        return false;
    }

    return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;