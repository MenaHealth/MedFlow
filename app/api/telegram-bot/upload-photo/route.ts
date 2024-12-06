// app/api/telegram-bot/upload-photo/route.ts
// app/api/telegram-bot/upload-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

const spacesClient = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT!,
    region: process.env.DO_SPACES_REGION!,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            console.error(`[ERROR] Missing image file in formData`);
            return NextResponse.json({ error: "File is missing" }, { status: 400 });
        }

        // Logging file details
        console.log(`[DEBUG] Received file:`, {
            name: file.name,
            type: file.type,
            size: file.size,
        });

        // Determine the folder based on the environment
        const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
        const timestamp = new Date().toISOString();
        const fileName = `${folder}/images/${timestamp}-${file.name}`;

        // Convert the file to a buffer
        const fileBuffer = new Uint8Array(await file.arrayBuffer());

        // Define the upload parameters
        const uploadParams = {
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type || "application/octet-stream",
            ACL: ObjectCannedACL.public_read, // Use enum for correct typing
        };

        // Upload the file to DigitalOcean Spaces
        const uploadCommand = new PutObjectCommand(uploadParams);
        await spacesClient.send(uploadCommand);

        // Generate the CDN URL for the uploaded file
        const fileUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${fileName}`;
        console.log(`[INFO] Image uploaded to: ${fileUrl}`);

        // Respond with the file URL
        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error uploading image file to DigitalOcean Spaces:", {
            message: error.message,
            stack: error.stack,
        });

        // Log environment variables for debugging purposes
        console.log(`[DEBUG] Environment variables:`, {
            DO_SPACES_ENDPOINT: process.env.DO_SPACES_ENDPOINT,
            DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
            DO_SPACES_CDN_ENDPOINT: process.env.DO_SPACES_CDN_ENDPOINT,
        });

        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}