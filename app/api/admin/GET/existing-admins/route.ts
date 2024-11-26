import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/admin";
import { initializeDatabase, verifyAdminToken } from "@/utils/adminAPI";

export async function GET(request: NextRequest) {
    try {
        await initializeDatabase();

        const decoded = await verifyAdminToken(request);
        if (!decoded) {
            console.log("Unauthorized access attempted");
            return NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
        }

        console.log("Authorized admin token decoded:", decoded);

        // Fetch and populate userId
        const admins = await Admin.find().populate("userId", "firstName lastName email");
        console.log("Raw admins data fetched from database:", admins);

        // Flatten userId fields into the root of each admin
        const flattenedAdmins = admins.map((admin) => {
            const flattenedAdmin = {
                _id: admin._id,
                userId: admin.userId?._id || admin.userId, // Ensure we handle both populated and unpopulated cases
                firstName: admin.firstName || admin.firstName || null,
                lastName: admin.lastName || admin.lastName || null,
                email: admin.email || admin.email || null,
                adminStartDate: admin.adminStartDate,
            };
            console.log("Processed admin:", flattenedAdmin);
            return flattenedAdmin;
        });

        console.log("Flattened admins data to be returned:", flattenedAdmins);

        return NextResponse.json({ admins: flattenedAdmins }, { status: 200 });
    } catch (error) {
        console.error("Error fetching admins:", error);
        return NextResponse.json({ message: "Failed to fetch admins" }, { status: 500 });
    }
}