// app/api/telegram-bot/get-media/route.ts

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    try {
        // Parse query parameters to get the file path
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get('filePath');

        if (!filePath) {
            return NextResponse.json({ error: 'File path is required' }, { status: 400 });
        }

        // Check user authentication/authorization logic here
        const token = request.headers.get('Authorization');
        if (!token || token !== 'your-verification-token') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Proxy the request to DigitalOcean CDN
        const cdnUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${filePath}`;
        const response = await axios.get(cdnUrl, { responseType: 'arraybuffer' });

        return new NextResponse(response.data, {
            headers: {
                'Content-Type': response.headers['content-type'],
                'Content-Disposition': response.headers['content-disposition'] || '',
            },
        });
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}