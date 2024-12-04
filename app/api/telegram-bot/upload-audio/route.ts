// app/api/telegram-bot/upload-audio/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
        const audioFile = formData.get('file') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'Audio file is missing' }, { status: 400 });
        }

        const fileName = `${Date.now()}-${audioFile.name}`;
        const arrayBuffer = await audioFile.arrayBuffer();
        const uploadParams = {
            Bucket: process.env.AWS_S3_AUDIO_BUCKET!,
            Key: `doctor-audio-notes/${fileName}`,
            Body: new Uint8Array(arrayBuffer), // Convert ArrayBuffer to Uint8Array
            ContentType: audioFile.type,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        const fileUrl = `https://${process.env.AWS_S3_AUDIO_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/doctor-audio-notes/${fileName}`;
        return NextResponse.json({ fileUrl }, { status: 200 });
    } catch (error) {
        console.error('Error uploading audio file:', error);
        return NextResponse.json({ error: 'Failed to upload audio file' }, { status: 500 });
    }
};