// app/api/telegram-bot/upload-audio/route.ts

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

const spacesClient = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const audioFile = formData.get("file") as File;
        const chatId = formData.get("chatId") as string;

        if (!audioFile || !chatId) {
            return NextResponse.json({ error: "Audio file or chatId is missing" }, { status: 400 });
        }

        const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
        const uploadTimestamp = new Date().toISOString(); // ISO format for consistent naming
        const filePath = `${folder}/audio/${chatId}/${uploadTimestamp}.ogg`;

        // Convert the file to a buffer
        const fileBuffer = new Uint8Array(await audioFile.arrayBuffer());

        const uploadParams = {
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: filePath,
            Body: fileBuffer,
            ContentType: audioFile.type, // Use the actual MIME type
            ACL: ObjectCannedACL.public_read,
        };

        // Upload the file to DigitalOcean Spaces
        const command = new PutObjectCommand(uploadParams);
        await spacesClient.send(command);

        // Generate the CDN URL for the uploaded file
        const fileUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${filePath}`;
        console.log(`[INFO] Audio uploaded to: ${fileUrl}`);

        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error uploading audio file to DigitalOcean Spaces:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json({ error: "Failed to upload audio file" }, { status: 500 });
    }
}