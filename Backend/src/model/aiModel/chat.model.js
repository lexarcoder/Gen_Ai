import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: "New Chat",
            trim: true
        },

        user: { type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
         },

    },
    { timestamps: true },
);

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;
