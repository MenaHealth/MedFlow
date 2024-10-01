// app/api/patient/new/route.ts
import Patient, { IPatient } from "@/models/patient";
import dbConnect from "@/utils/database";

export const POST = async (request: Request) => {
  try {
    const patientData: IPatient = await request.json();
    console.log('Received patient data:', patientData);

    if (!patientData) {
      return new Response('Invalid patient data', { status: 400 });
    }

    await dbConnect();

    const newPatient = new Patient(patientData);

    await newPatient.save();
    console.log('Patient created successfully:', newPatient);

    return new Response(JSON.stringify(newPatient), { status: 201 });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return new Response(`Failed to create patient: ${error.message}`, { status: 500 });
  }
};