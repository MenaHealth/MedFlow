// app/api/telegram-bot/get-media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
    region: process.env.DO_SPACES_REGION || "fra1",
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let mediaUrl = searchParams.get("mediaUrl") || searchParams.get("filePath");

    if (!mediaUrl) {
        console.error("Missing media URL or file path in request.");
        return NextResponse.json({ error: "Missing media URL or file path" }, { status: 400 });
    }

    try {
        mediaUrl = decodeURIComponent(decodeURIComponent(mediaUrl));

        if (mediaUrl.includes("/api/telegram-bot/get-media")) {
            const innerParams = new URL(mediaUrl).searchParams;
            mediaUrl = innerParams.get("mediaUrl") || innerParams.get("filePath") || "";
            mediaUrl = decodeURIComponent(mediaUrl);
        }

        console.log("Decoded mediaUrl:", mediaUrl);

        const urlParts = new URL(mediaUrl);
        const key = urlParts.pathname.slice(1);

        console.log("Extracted Key:", key);

        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.DO_SPACES_BUCKET!,
                Key: key,
            }),
            { expiresIn: 600 }
        );

        console.log("Generated signed URL:", signedUrl);

        return NextResponse.json({ signedUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error generating signed URL:", {
            message: error.message,
            stack: error.stack,
            mediaUrl: mediaUrl,
        });
        return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
    }
}

