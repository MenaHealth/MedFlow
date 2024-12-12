// app/api/telegram-bot/upload-photo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import heic2any from "heic2any";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
        const file = formData.get("file") as File | null;
        const telegramChatId = formData.get("telegramChatId") as string;

        if (!file || !telegramChatId) {
            return NextResponse.json(
                { error: "File or Telegram Chat ID is missing" },
                { status: 400 }
            );
        }

        if (!(file instanceof Blob)) {
            return NextResponse.json(
                { error: "Uploaded file is not valid" },
                { status: 400 }
            );
        }

        // Retrieve file buffer and content type
        const fileBuffer = await file.arrayBuffer();
        let convertedBuffer = Buffer.from(fileBuffer);
        let fileType = file.type;

        // Check if the file is an HEIC image and convert to JPG
        if (fileType === "image/heic" || fileType === "image/heif") {
            try {
                console.log("[INFO] Converting HEIC to JPG...");
                const converted = await heic2any({
                    blob: new Blob([fileBuffer]),
                    toType: "image/jpeg",
                });
                convertedBuffer = Buffer.from(await (converted as Blob).arrayBuffer());
                fileType = "image/jpeg";
                console.log("[INFO] HEIC conversion successful!");
            } catch (conversionError) {
                console.error("[ERROR] Failed to convert HEIC to JPG:", conversionError);
                return NextResponse.json(
                    { error: "Failed to convert HEIC to JPG" },
                    { status: 500 }
                );
            }
        }

        // Retrieve user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized access. Please log in." },
                { status: 401 }
            );
        }

        const { firstName, lastName, accountType } = session.user;
        const senderInfo = `${accountType}-${firstName}-${lastName}`.trim().replace(/\s+/g, "_");

        // Generate file path: images/{TelegramID}/{timestamp}-{accountType}-{firstName}-{lastName}.jpg
        const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
        const timestamp = new Date().toISOString().replace(/:/g, "-");
        const sanitizedChatId = telegramChatId.replace(/[^a-zA-Z0-9_-]/g, "");
        const fileName = `${timestamp}-${senderInfo}.jpg`; // Use JPG extension
        const filePath = `${folder}/images/${sanitizedChatId}/${fileName}`;

        // Upload the converted or original image
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.DO_SPACES_BUCKET!,
                Key: filePath,
                Body: convertedBuffer,
                ContentType: fileType,
                ACL: "private",
            })
        );

        // Generate a signed URL
        const signedUrl = await getSignedUrl(
            s3Client,
            new GetObjectCommand({
                Bucket: process.env.DO_SPACES_BUCKET!,
                Key: filePath,
            }),
            { expiresIn: 3600 }
        );

        return NextResponse.json({ filePath, signedUrl }, { status: 200 });
    } catch (error: any) {
        console.error("Error in upload-photo route:", error.message);
        return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
    }
}