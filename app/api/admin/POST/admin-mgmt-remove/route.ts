// app/api/admin/POST/admin-mgmt-remove/route.ts

import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/admin";
import { initializeDatabase, verifyAdminToken } from "@/utils/adminAPI";

export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        const { adminId } = await request.json();
        if (!adminId) {
            return NextResponse.json({ message: "Admin ID is required" }, { status: 400 });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return NextResponse.json({ message: "Admin not found" }, { status: 404 });
        }

        await Admin.deleteOne({ _id: adminId });

        return NextResponse.json({ message: "Admin removed successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error removing admin:", error);
        return NextResponse.json({ message: "Failed to remove admin" }, { status: 500 });
    }
}