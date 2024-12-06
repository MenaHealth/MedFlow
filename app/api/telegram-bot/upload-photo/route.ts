// app/api/telegram-bot/upload-photo/route.ts
// app/api/telegram-bot/upload-photo/route.ts
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

        console.log("DO_SPACES_KEY:"+process.env.DO_SPACES_KEY);
        console.log("DO_SPACES_SECRET:"+process.env.DO_SPACES_SECRET);
        console.log("DO_SPACES_BUCKET:"+process.env.DO_SPACES_BUCKET);
        console.log("DO_SPACES_REGION:"+process.env.DO_SPACES_REGION);
        console.log("DO_SPACES_ENDPOINT:"+process.env.DO_SPACES_ENDPOINT);
        console.log("NODE_ENV:"+process.env.NODE_ENV);


        if (!file) {
            console.error("[ERROR] No file provided in the request.");
            return NextResponse.json({ error: "File is missing" }, { status: 400 });
        }

        console.log("[DEBUG] File received:", {
            name: file.name,
            type: file.type,
            size: file.size,
        });

        const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
        const timestamp = new Date().toISOString();
        const fileName = `${folder}/images/${timestamp}-${file.name}`;

        const fileBuffer = await file.arrayBuffer();

        const uploadParams = {
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: fileName,
            Body: Buffer.from(fileBuffer),
            ContentType: file.type,
            ACL: "private" as ObjectCannedACL,
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
        } catch (s3Error: any) {
            console.error("[ERROR] S3 upload failed:", s3Error.message);
            throw new Error("Failed to upload file to S3");
        }

        // Generate a signed URL valid for 1 hour
        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.DO_SPACES_BUCKET!,
                Key: fileName,
            }),
            { expiresIn: 3600 } // URL valid for 1 hour
        );

        console.log("[INFO] File successfully uploaded and signed URL generated:", signedUrl);

        return NextResponse.json({ filePath: fileName, signedUrl }, { status: 200 });
    } catch (error: any) {
        console.error("[ERROR] Upload-photo route failed:", {
            message: error.message,
            stack: error.stack,
        });

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

