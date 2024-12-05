// app/api/telegram-bot/get-media/route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get("filePath");

    if (!filePath) {
        return NextResponse.json({ error: "Missing file path" }, { status: 400 });
    }

    try {
        // Construct the DigitalOcean Spaces CDN file URL
        const mediaUrl = `${process.env.DO_SPACES_CDN_ENDPOINT}/${filePath}`;

        // Print the URL the request will be sent to
        console.log(`Requesting media from URL: ${mediaUrl}`);

        // Fetch the file from the CDN
        const response = await axios.get(mediaUrl, {
            responseType: "arraybuffer", // Fetch binary data
        });

        // Return the proxied response to the client
        return new NextResponse(response.data, {
            headers: {
                "Content-Type": response.headers["content-type"], // Preserve original Content-Type
                "Cache-Control": "public, max-age=3600", // Optional caching
            },
        });
    } catch (error: any) {
        // Handle and log the error
        console.error("Error fetching media from DigitalOcean:", {
            message: error.message,
            status: error.response?.status || "Unknown",
            data: error.response?.data || "No data returned",
        });
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
    }
}