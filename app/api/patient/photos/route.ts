// app/api/patient/photos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromArrayBuffer } from '@smithy/util-buffer-from';

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_VALUE!,
    },
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const encryptedFiles = Array.from(formData.getAll('file') as unknown as FileList);

        const uploadPromises = encryptedFiles.map(async (encryptedFile: File) => {
            const buffer = await encryptedFile.arrayBuffer();

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: `uploads/${encryptedFile.name}`,
                Body: fromArrayBuffer(buffer),
                ContentType: encryptedFile.type,
            };

            const command = new PutObjectCommand(params);
            await s3Client.send(command);
        });

        await Promise.all(uploadPromises);

        return NextResponse.json({ message: 'Files uploaded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error uploading files:', error);
        return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
    }
}