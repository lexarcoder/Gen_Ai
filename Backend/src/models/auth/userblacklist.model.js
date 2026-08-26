
import mongoose from "mongoose"

const blackListSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, "Token is required for blacklisting"],
            unique: true,
            index: true,
            trim: true,
        },

        reason: {
            type: String,
            default: "logout",
            enum: ["logout", "manual", "security", "expired"],
        },

        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);


blackListSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlackListModel = mongoose.model("BlackList", blackListSchema);

export default BlackListModel