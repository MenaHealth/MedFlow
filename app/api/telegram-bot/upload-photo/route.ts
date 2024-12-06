// app/api/telegram-bot/upload-photo/route.ts
// app/api/telegram-bot/upload-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";


export async function POST(req: NextRequest) {
    try {
        // Parse the incoming form data
        const formData = await req.formData();
        const file = formData.get("file") as File;

        // Validate that the file exists
        if (!file) {
            console.error("[ERROR] No file provided in the request.");
            return NextResponse.json({ error: "File is missing" }, { status: 400 });
        }

        console.log("[DEBUG] File received:", {
            name: file.name,
            type: file.type,
            size: file.size,
        });

        // Determine the upload folder based on the environment
        const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
        const timestamp = new Date().toISOString();
        const fileName = `${folder}/images/${timestamp}-${file.name}`;

        // Convert file to a buffer
        const fileBuffer = new Uint8Array(await file.arrayBuffer());

        // Create S3-compatible upload parameters
        const uploadParams = {
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type || "application/octet-stream",
            ACL: "public-read", // Ensure file is publicly accessible
        };

        // Make the PUT request to S3 using Axios
        const s3Url = `https://${process.env.DO_SPACES_BUCKET!}.${process.env.DO_SPACES_ENDPOINT!}`;
        const s3UploadEndpoint = `${s3Url}/${fileName}`;

        try {
            await axios.put(s3UploadEndpoint, fileBuffer, {
                headers: {
                    "Content-Type": file.type || "application/octet-stream",
                    "x-amz-acl": "public-read", // Set public read access
                },
            });
        } catch (axiosError: any) {
            console.error("[ERROR] Axios upload to S3 failed:", axiosError.response || axiosError.message);
            throw new Error("Failed to upload file to S3");
        }

        // Generate the public CDN URL for the uploaded file
        const fileUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${fileName}`;
        console.log("[INFO] File successfully uploaded to:", fileUrl);

        // Return the CDN URL as a JSON response
        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error: any) {
        console.error("[ERROR] Upload-photo route failed:", {
            message: error.message,
            stack: error.stack,
        });

        // Return a detailed error response
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}