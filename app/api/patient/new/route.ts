// app/api/patient/new/route.ts
import Patient, { IPatient } from "@/models/patient";
import dbConnect from "@/utils/database";

export const POST = async (request: Request) => {
  try {
    const patientData: IPatient = await request.json();

    if (!patientData) {
      return new Response('Invalid patient data', { status: 400 });
    }

    await dbConnect();

    // Ensure that notes2 is initialized as an empty array if not already present
    const newPatient = new Patient({
      ...patientData,
      notes: patientData.notes || [],  // Default to an empty array if notes2 are undefined
    });

    await newPatient.save();

    return new Response(JSON.stringify(newPatient), { status: 201 });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return new Response(`Failed to create patient: ${error.message}`, { status: 500 });
  }
};