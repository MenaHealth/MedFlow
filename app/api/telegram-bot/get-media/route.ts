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
    try {
        const { searchParams } = new URL(req.url);
        const filePath = searchParams.get("filePath");

        if (!filePath) {
            return NextResponse.json({ error: "Missing filePath parameter" }, { status: 400 });
        }

        // Determine if `filePath` is relative or a full URL
        let key: string;
        if (filePath.startsWith("http")) {
            // Full URL: Extract path after the bucket name
            const url = new URL(filePath);
            key = decodeURIComponent(url.pathname.substring(1)); // Remove leading "/"
        } else {
            // Relative path: Use as-is
            key = decodeURIComponent(filePath);
        }

        // Generate presigned URL
        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.DO_SPACES_BUCKET!,
                Key: key,
            }),
            { expiresIn: 1800 }
        );

        return NextResponse.json({ signedUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error generating signed URL:", error.message);
        return NextResponse.json(
            { error: "Failed to generate signed URL", details: error.message },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';