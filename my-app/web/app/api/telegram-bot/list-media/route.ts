// app/api/telegram-bot/list-media/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

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
        const folderPath = searchParams.get("folderPath");

        if (!folderPath) {
            return NextResponse.json({ error: "Missing folderPath parameter" }, { status: 400 });
        }

        // List all objects in the specified folder
        const data = await s3Client.send(new ListObjectsV2Command({
            Bucket: process.env.DO_SPACES_BUCKET!,
            Prefix: folderPath,
        }));

        const files = data.Contents?.map(obj => obj.Key) ?? [];
        return NextResponse.json({ files }, { status: 200 });
    } catch (error: any) {
        console.error("Error listing media:", error.message);
        return NextResponse.json({ error: "Failed to list media" }, { status: 500 });
    }
}