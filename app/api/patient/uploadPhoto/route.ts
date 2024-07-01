import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// Configure AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_VALUE!,
    },
});

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replaceAll(' ', '_');

        console.log('Uploading file:', filename);
        console.log('Region:', process.env.AWS_REGION);
        console.log('Bucket:', process.env.AWS_BUCKET_NAME);

        const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: `uploads/${filename}`,
        Body: buffer,
        ContentType: file.type,
        };

        const upload = new Upload({
        client: s3Client,
        params: uploadParams,
        });

        await upload.done();

        return NextResponse.json({ message: 'File uploaded successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
    }
};

export const handler = {
    POST,
    onError: (err: any, req: NextRequest, res: NextResponse) => {
        const error = err as Error;
        console.error('Handler error:', error.stack);
        return NextResponse.json({ error: error.message }, { status: 500 });
    },
    onNoMatch: (req: NextRequest, res: NextResponse) => {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    },
};
