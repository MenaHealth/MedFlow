// app/api/telegram-bot/upload-photo/route.ts
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
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "File is missing" }, { status: 400 });
        }

        const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
        const fileName = `${folder}/images/${Date.now()}-${file.name}`;

        // Convert the file to a buffer
        const fileBuffer = new Uint8Array(await file.arrayBuffer());

        const uploadParams = {
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type,
            ACL: ObjectCannedACL.public_read, // Use the enum instead of string
        };

        // Upload the file to DigitalOcean Spaces
        const command = new PutObjectCommand(uploadParams);
        await spacesClient.send(command);

        // Generate the CDN URL for the uploaded file
        const fileUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${fileName}`;
        console.log(`[INFO] Image uploaded to: ${fileUrl}`);

        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error uploading file to DigitalOcean Spaces:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}