// app/api/patient/photos/[hash].js

import dbConnect from "@/utils/database";
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
});

export const POST = async (req, res) => {
    console.log('API route called');

    try {
        await dbConnect();
        console.log('Database connected');

        const { files } = req.body;
        if (!files || !Array.isArray(files)) {
            throw new Error('Files are missing or not an array');
        }

        // Upload logic
        const uploadPromises = files.map((file) => {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `uploads/${file.hash}.webp`,
                Body: file,
                ContentType: 'image/webp',
            };

            return s3.upload(params).promise();
        });

        const uploadResults = await Promise.all(uploadPromises);
        console.log('Upload successful:', uploadResults);

        res.status(200).json({ success: true, uploadResults });
    } catch (error) {
        console.error('Upload failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};