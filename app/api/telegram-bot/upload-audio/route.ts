// app/api/telegram-bot/upload-audio/route.ts
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
            console.error(`[ERROR] Missing audio file in formData`);
            return NextResponse.json({ error: "Audio file is missing" }, { status: 400 });
        }

        const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
        const timestamp = new Date().toISOString();
        const fileName = `${folder}/audio/${timestamp}-${file.name}`;
        const fileBuffer = new Uint8Array(await file.arrayBuffer());

        const uploadParams = {
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type || "application/octet-stream",
            ACL: ObjectCannedACL.public_read, // Use the enum value instead of a string
        };

        const uploadCommand = new PutObjectCommand(uploadParams);
        await spacesClient.send(uploadCommand);

        const fileUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${fileName}`;
        console.log(`[INFO] Audio uploaded to: ${fileUrl}`);

        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error uploading audio file to DigitalOcean Spaces:", {
            message: error.message,
            stack: error.stack,
        });

        console.log(`[DEBUG] Environment variables:`, {
            DO_SPACES_ENDPOINT: process.env.DO_SPACES_ENDPOINT,
            DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
            DO_SPACES_CDN_ENDPOINT: process.env.DO_SPACES_CDN_ENDPOINT,
        });

        return NextResponse.json({ error: "Failed to upload audio file" }, { status: 500 });
    }
}