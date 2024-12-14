// app/api/admin/POST/admin-mgmt-add/route.ts

import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/admin";
import User from "@/models/user";
import { initializeDatabase, verifyAdminToken } from "@/utils/adminAPI";

export async function POST(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        const { userId } = await request.json();
        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const existingAdmin = await Admin.findOne({ userId });
        if (existingAdmin) {
            return NextResponse.json({ message: "User is already an admin" }, { status: 400 });
        }

        const newAdmin = new Admin({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
        await newAdmin.save();

        return NextResponse.json({ message: "Admin added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding admin:", error);
        return NextResponse.json({ message: "Failed to add admin" }, { status: 500 });
    }
}