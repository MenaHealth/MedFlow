// app/api/admin/GET/search-users/route.ts

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { initializeDatabase, verifyAdminToken } from "@/utils/adminAPI";

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: "Email query is required" }, { status: 400 });
        }

        const users = await User.find({
            email: { $regex: email, $options: 'i' },
            authorized: true
        }).limit(10).select('_id email firstName lastName');

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Error searching users:", error);
        return NextResponse.json({ message: "Failed to search users" }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';