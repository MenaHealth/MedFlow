// app/api/patient/new/route.ts
import Patient, { IPatient } from "@/models/patient";
import dbConnect from "@/utils/database";

export const POST = async (request: Request) => {
  const patientData: IPatient = await request.json();
  console.log(patientData);

  try {
    await dbConnect();

    if (!patientData.firstName || !patientData.lastName) {
      return new Response('First name and last name are required', { status: 400 });
    }

    // Create new patient
    const newPatient = new Patient(patientData);
    await newPatient.save();
    return new Response(JSON.stringify(newPatient), { status: 201 });
  } catch (error) {
    console.error('Failed to create patient:', error);
    return new Response(`Failed to create patient: ${error}`, { status: 500 });
  }
};