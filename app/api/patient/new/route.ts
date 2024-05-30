import Patient, { IPatient } from "@/models/patient";
import { connectToDB } from "@/utils/database";

export const POST = async (request: Request) => {
    const patientData: IPatient = await request.json();
  
    try {
      await connectToDB();
      const newPatient = new Patient(patientData);
      await newPatient.save();
      return new Response(JSON.stringify(newPatient), { status: 201 });
    } catch (error) {
      return new Response(`Failed to create a new patient: ${error}`, { status: 500 });
    }
  };