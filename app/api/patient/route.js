import Patient from "@/models/patient";
import dbConnect from "@/utils/database";

export const GET = async (request) => {
  try {
    await dbConnect();

    // Retrieve account type and user ID from headers or session
    const { accountType, id: userId } = request.headers;

    let query = {};

    // Filter patients based on the account type
    if (accountType === "Evac") {
      query = { coordinatorId: userId }; // Evac users only see their patients
    }

    // Fetch patients with the relevant query
    const patients = await Patient.find(query).populate("coordinatorId");

    console.log("[Debug] Patients fetched from DB:", JSON.stringify(patients, null, 2));

    return new Response(JSON.stringify(patients), { status: 200 });
  } catch (error) {
    console.error("[Error] Failed to fetch all patients:", error.message);
    return new Response(`Failed to fetch all patients: ${error}`, { status: 500 });
  }
};

export const PATCH = async (request) => {
  try {
    const payload = await request.json();
    console.log("[Debug] Incoming PATCH payload:", JSON.stringify(payload, null, 2));

    const {
      _id,
      firstName,
      lastName,
      phone,
      telegramAccessHash,
      telegramChatId,
      dob,
      country,
      city,
      language,
      genderPreference,
      chiefComplaint,
      email,
      priority,
      specialty,
      hospital,
      assignedDocId,
      coordinatorId,
      status,
      triagedBy,
      notes,
      dashboardNotes,
      doctor,
    } = payload;

    await dbConnect();

    console.log("[Debug] Looking for patient with ID:", _id);
    const existingPatient = await Patient.findById(_id);

    if (!existingPatient) {
      console.error("[Error] Patient not found:", _id);
      return new Response("Patient not found", { status: 404 });
    }

    console.log("[Debug] Existing patient before update:", JSON.stringify(existingPatient, null, 2));

    // Update fields conditionally
    existingPatient.firstName = firstName ?? existingPatient.firstName;
    existingPatient.lastName = lastName ?? existingPatient.lastName;
    existingPatient.coordinatorId = coordinatorId ?? existingPatient.coordinatorId; // Coordinator ID
    existingPatient.phone = phone ?? existingPatient.phone;
    existingPatient.telegramAccessHash = telegramAccessHash ?? existingPatient.telegramAccessHash;
    existingPatient.dob = dob ?? existingPatient.dob;
    existingPatient.telegramChatId = telegramChatId ?? existingPatient.telegramChatId;
    existingPatient.country = country ?? existingPatient.country;
    existingPatient.city = city ?? existingPatient.city;
    existingPatient.language = language ?? existingPatient.language;
    existingPatient.genderPreference = genderPreference ?? existingPatient.genderPreference;
    existingPatient.chiefComplaint = chiefComplaint ?? existingPatient.chiefComplaint;
    existingPatient.email = email ?? existingPatient.email;
    existingPatient.priority = priority ?? existingPatient.priority;
    existingPatient.specialty = specialty ?? existingPatient.specialty;
    existingPatient.hospital = hospital ?? existingPatient.hospital;
    existingPatient.status = status ?? existingPatient.status;
    existingPatient.triagedBy = triagedBy ?? existingPatient.triagedBy;
    existingPatient.notes = notes ?? existingPatient.notes;
    existingPatient.doctor = doctor ?? existingPatient.doctor;
    existingPatient.dashboardNotes = dashboardNotes ?? existingPatient.dashboardNotes;

    if (assignedDocId) {
      existingPatient.assignedDocId = assignedDocId === "unassign" ? null : assignedDocId;
      await existingPatient.populate("assignedDocId");
    }
    if (coordinatorId) {
      existingPatient.coordinatorId = coordinatorId === "unassign" ? null : coordinatorId;
      await existingPatient.populate("coordinatorId");
    }

    console.log("[Debug] Updated patient before saving:", JSON.stringify(existingPatient, null, 2));

    try {
      await existingPatient.save();
      console.log("[Debug] Patient successfully saved:", existingPatient._id);
    } catch (e) {
      console.error("[Error] Error saving patient:", e.message);
    }

    return new Response(JSON.stringify(existingPatient), { status: 200 });
  } catch (error) {
    console.error("[Error] Error updating patient:", error.message);
    return new Response(`Error Updating Patient: ${error}`, { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    const payload = await request.json();
    console.log("[Debug] Incoming POST payload:", JSON.stringify(payload, null, 2));

    await dbConnect();

    const {
      firstName,
      lastName,
      dob,
      language,
      chiefComplaint,
      city,
      country,
      priority,
      specialty,
      status,
      coordinatorId, // Evac users' ID
      assignedDocId, // Doctors' ID
    } = payload;

    const patientData = {
      firstName,
      lastName,
      dob,
      language,
      chiefComplaint,
      city,
      country,
      priority,
      specialty,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (coordinatorId) {
      patientData.coordinatorId = coordinatorId;
    }

    if (assignedDocId) {
      patientData.assignedDocId = assignedDocId;
    }

    const newPatient = await Patient.create(patientData);

    console.log("[Debug] New patient created:", JSON.stringify(newPatient, null, 2));

    return new Response(
      JSON.stringify({ message: "Patient created successfully!", patient: newPatient }),
      { status: 201 }
    );
  } catch (error) {
    console.error("[Error] Failed to create patient:", error.message);
    return new Response(
      JSON.stringify({
        message: "Failed to create patient.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
