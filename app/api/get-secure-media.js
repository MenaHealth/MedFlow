// app/api/get-secure-media.js
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export default async function handler(req, res) {
    const { key } = req.query;

    if (!key) {
        return res.status(400).json({ error: "Missing 'key' parameter" });
    }

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
}