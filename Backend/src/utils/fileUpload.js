import cloudinary from "../config/uploadFile.js";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            throw new Error("File path is required");
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: "Portfolio/ProfileData",
            resource_type: "auto",
        });

        // Local file delete after successful upload
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {

        // Local file delete if upload failed
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw error;
    }
};

export default uploadOnCloudinary;