import Patient from "@/models/prompt";
import { connectToDB } from "@/utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const patients = await Patient.find({ assignedTo: params.id }).populate("creator")

        return new Response(JSON.stringify(patients), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch patients for user", { status: 500 })
    }
} 