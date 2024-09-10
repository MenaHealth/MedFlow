// app/api/patient-form/new/route.js
import PatientForm, { IPatientForm } from "@/models/patient_form";
import dbConnect from "@/utils/database";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: Request) => {
    try {
        const patientFormData: IPatientForm = await request.json();
        console.log('Received patient form data:', patientFormData);

        await dbConnect();

        const newPatientForm = new PatientForm({
            ...patientFormData,
            patientId: uuidv4(),  // Generate a unique patient ID
        });

        await newPatientForm.save();
        console.log('Patient form created successfully:', newPatientForm);

        return new Response(JSON.stringify(newPatientForm), { status: 201 });
    } catch (error: any) {
        console.error('Error creating patient form:', error);
        return new Response(`Failed to create patient form: ${error.message}`, { status: 500 });
    }
};