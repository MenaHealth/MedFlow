// app/api/telegram-bot/upload-audio/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ObjectCannedACL } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
    region: process.env.DO_SPACES_REGION || "fra1",
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
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${folder}/audio/${timestamp}-${file.name}`;

        const fileBuffer = await file.arrayBuffer();

        const uploadParams = {
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: fileName,
            Body: Buffer.from(fileBuffer),
            ContentType: file.type || "audio/ogg",
            ACL: "private" as ObjectCannedACL,
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
        } catch (s3Error: any) {
            throw new Error("Failed to upload file to S3");
        }


        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.DO_SPACES_BUCKET!,
                Key: fileName,
            }),
            { expiresIn: 300 } // 5 min
        );
        console.log("Signed URL:", signedUrl);



        return NextResponse.json({ filePath: fileName, signedUrl }, { status: 200 });
    } catch (error: any) {
        console.error("[ERROR] Upload-audio route failed:", {
            message: error.message,
            stack: error.stack,
        });

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

