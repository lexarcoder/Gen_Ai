import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/Database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1);
    }
};


startServer();