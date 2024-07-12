import Patient, { IPatient } from "@/models/patient";
import dbConnect from "@/utils/database";  // Correct import statement

export const POST = async (request: Request) => {
  const patientData: IPatient = await request.json();
  console.log(patientData);

  try {
    await dbConnect();  // Correct function call

    // The following code is commented out, but it could be uncommented and adjusted
    // if you need to handle both updating existing patients and creating new ones.

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