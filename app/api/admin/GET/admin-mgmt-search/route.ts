// app/api/admin/GET/admin-mgmt-search/route.ts

import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/admin";
import { initializeDatabase, verifyAdminToken } from "@/utils/adminAPI";

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        // Use `.get()` to retrieve the 'search' query parameter
        const search = request.nextUrl.searchParams.get("search");
        const query = search
            ? { email: { $regex: new RegExp(search, "i") } }
            : {};

        const admins = await Admin.find(query).populate("userId", "firstName lastName email");
        if (!admins || admins.length === 0) {
            return NextResponse.json({ message: "No admins found" }, { status: 404 });
        }

        return NextResponse.json({ admins }, { status: 200 });
    } catch (error) {
        console.error("Error fetching admins:", error);
        return NextResponse.json({ message: "Failed to fetch admins" }, { status: 500 });
    }
}