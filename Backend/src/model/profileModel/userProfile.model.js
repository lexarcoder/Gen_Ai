import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        profileImg: {
            type: String,
            default: "",
        },

        firstName: {
            type: String,
            default: "",
            trim: true,
        },

        lastName: {
            type: String,
            default: "",
            trim: true,
        },

        contact: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            required: true,
        },

        Verified: {
            type: Boolean,
            default: false,
        },

        role: {
            type: String,
            default: "",
        },

        gender: {
            type: String,
            default: "",
        },

        dob: {
            type: Date,
        },

        bio: {
            type: String,
            default: "",
        },

        country: {
            type: String,
            default: "",
        },

        state: {
            type: String,
            default: "",
        },

        district: {
            type: String,
            default: "",
        },

        pincode: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const userProfile = mongoose.model("UserProfile", profileSchema);

export default userProfile;