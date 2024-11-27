// app/api/patient/new/route.ts



import Patient, { IPatient } from "@/models/patient";
import dbConnect from "@/utils/database";
import addTelegramContact from "@/components/addTelegramContact";

export const POST = async (request: Request) => {
  try {
    console.log("[POST /api/patient/new] Received request to create a new patient");

    const patientData: Partial<IPatient> = await request.json();
    console.log("[POST /api/patient/new] Parsed patient data:", JSON.stringify(patientData, null, 2));

    if (!patientData) {
      console.error("[POST /api/patient/new] No patient data provided in the request.");
      return new Response("Invalid patient data", { status: 400 });
    }

    await dbConnect();
    console.log("[POST /api/patient/new] Connected to the database.");

    console.log("[POST /api/patient/new] Attempting to add Telegram contact...");
    let telegramInfo: { userId: string; accessHash: string | undefined };
    try {
      telegramInfo = await addTelegramContact(patientData);
      console.log("[POST /api/patient/new] Telegram contact added successfully:", JSON.stringify(telegramInfo, null, 2));
    } catch (telegramError) {
      console.error("[POST /api/patient/new] Error adding Telegram contact:", telegramError);

      // Type assertion to treat telegramError as an Error instance
      const errorMessage = (telegramError as Error).message;

      return new Response(
          JSON.stringify({
            error: "Telegram account not found",
            message: "We couldn't find a Telegram account associated with the provided phone number. Please make sure you have a Telegram account with this number before signing up.",
            debug: {
              error: errorMessage,
              patientData: patientData.phone,
            },
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
      );
    }

    console.log("[POST /api/patient/new] Preparing new patient data for saving...");
    const newPatient = new Patient({
      ...patientData,
      telegramChatId: telegramInfo.userId,
      telegramAccessHash: telegramInfo.accessHash,
      notes: patientData.notes || [],
    });

    console.log("[POST /api/patient/new] New patient data to save:", JSON.stringify(newPatient, null, 2));
    await newPatient.save();
    console.log("[POST /api/patient/new] Patient saved successfully:", JSON.stringify(newPatient, null, 2));

    return new Response(JSON.stringify(newPatient), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[POST /api/patient/new] Error creating patient:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const debugData = error instanceof Error ? error.stack : error;

    console.error("[POST /api/patient/new] Debug Info:", debugData);

    return new Response(
        JSON.stringify({
          error: "Failed to create patient",
          message: errorMessage,
          debug: debugData,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
    );
  }
};