// app/api/telegram-bot/upload-photo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_VALUE!,
    },
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'File is missing' }, { status: 400 });
        }

        const fileName = `${Date.now()}-${file.name}`;
        const uploadParams = {
            Bucket: process.env.AWS_S3_IMAGE_BUCKET!,
            Key: fileName,
            Body: new Uint8Array(await file.arrayBuffer()), // Convert ArrayBuffer to Uint8Array
            ContentType: file.type,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_S3_IMAGE_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}