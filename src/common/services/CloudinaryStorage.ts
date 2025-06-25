/* eslint-disable no-console */
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { IStorageService } from "../types/storage";

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryStorageService implements IStorageService {
    async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
        // eslint-disable-next-line no-console
        console.log("Uploading file to Cloudinary:", fileName); // 👈 added

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                    public_id: fileName.split(".")[0],
                },
                (error, result) => {
                    console.log("Upload result:", result); // 👈 added
                    console.log("Upload error:", error); // 👈 added

                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                },
            );

            Readable.from(fileBuffer).pipe(uploadStream);
        });
    }
}
