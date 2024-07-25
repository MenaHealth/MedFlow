// app/api/patient/new/route.ts
import Patient, { IPatient } from "@/models/patient";
import { connectToDB } from "@/utils/database";

export const POST = async (request: Request) => {
  const patientData: IPatient = await request.json();
  console.log(patientData);

  try {
    await connectToDB();

    // Uncomment this section if you want to check for an existing patient and update it.
    // let existingPatient = await Patient.findById(patientData._id);

    // if (existingPatient) {
    //   // Update existing patient
    //   patientData.age = parseInt(patientData.age as any);
    //   patientData.surgeryDate = new Date(patientData.surgeryDate as any);
    //   patientData.medx = patientData.medx ? patientData.medx.map((med: any) => {
    //     return {
    //       medName: med.medName,
    //       medDosage: med.medDosage,
    //       medFrequency: med.medFrequency,
    //     };
    //   }) : [];
    //   existingPatient.set(patientData);
      
    //   // Update other properties as needed
    //   await existingPatient.save();
    //   return new Response(JSON.stringify(existingPatient), { status: 200 });
    // } else {
      // Create new patient
      const newPatient = new Patient(patientData);
      await newPatient.save();
      return new Response(JSON.stringify(newPatient), { status: 201 });
    // }
  } catch (error) {
    return new Response(`Failed to create patient: ${error}`, { status: 500 });
  }
};