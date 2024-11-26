// app/api/patient/new/route.ts
import Patient, { IPatient } from "@/models/patient";
import dbConnect from "@/utils/database";
import addTelegramContact from "@/components/addTelegramContact";

export const POST = async (request: Request) => {
  try {
    const patientData = await request.json();

    if (!patientData) {
      return new Response("Invalid patient data", { status: 400 });
    }

    await dbConnect();

    // Add the patient as a Telegram contact and fetch their Telegram info
    const telegramInfo = await addTelegramContact(patientData);

    const newPatient = new Patient({
      ...patientData,
      telegramChatId: telegramInfo.userId, // Save Telegram user_id
      telegramAccessHash: telegramInfo.accessHash, // Save Telegram access_hash
      notes: patientData.notes || [],
    });

    await newPatient.save();

    return new Response(JSON.stringify(newPatient), { status: 201 });
  } catch (error) {
    console.error("Error creating patient:", error);

    if (error instanceof Error) {
      return new Response(`Failed to create patient: ${error.message}`, { status: 500 });
    }
    return new Response("Failed to create patient due to an unknown error.", { status: 500 });
  }
};