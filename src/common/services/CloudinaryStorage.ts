/* eslint-disable no-console */
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { FileStorage, FileData } from "../types/storage"; // adjust if needed

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryStorageService implements FileStorage {
    async upload({ filename, fileData }: FileData): Promise<string> {
        // eslint-disable-next-line no-console
        console.log("Uploading file to Cloudinary:", filename);

        const buffer =
            fileData instanceof Buffer ? fileData : Buffer.from(fileData);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "products",
                    public_id: filename.split(".")[0],
                },
                (error, result) => {
                    console.log("Upload result:", result);
                    console.log("Upload error:", error);

                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                },
            );

            Readable.from(buffer).pipe(uploadStream);
        });
    }

    delete(filename: string): void {
        void cloudinary.uploader.destroy(
            `products/${filename}`,
            (error, result) => {
                if (error) {
                    console.error("Cloudinary delete error:", error);
                } else {
                    console.log("Cloudinary delete result:", result);
                }
            },
        );
    }

    getObjectUri(filename: string): string {
        return cloudinary.url(`products/${filename}`, {
            secure: true,
        });
    }
}
