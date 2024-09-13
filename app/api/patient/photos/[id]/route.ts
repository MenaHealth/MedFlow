// app/api/patient/photos/[id]/route.js
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_VALUE!,
    },
});

const streamToBuffer = async (stream: Readable) => {
    const chunks: any[] = [];
    for await (let chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
};

export const GET = async (request: any, { params }: any) => {
    try {
        const { id } = params;

        // Fetch the file from the S3 bucket using the hash as the key
        const getObjectParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${id}.webp`,
        };

        const command = new GetObjectCommand(getObjectParams);
        const s3Response = await s3Client.send(command);

        // Convert the S3 stream to a buffer
        const fileBuffer = await streamToBuffer(s3Response.Body as Readable);

        return new Response(fileBuffer, {
            headers: {
                "Content-Type": s3Response.ContentType || "application/octet-stream",
            },
        });
    } catch (error) {
        console.error('Error fetching file from S3:', error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
