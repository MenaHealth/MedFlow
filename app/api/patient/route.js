// app/api/patient/route.ts
import Patient from "@/models/patient";
import dbConnect from "@/utils/database";

export const GET = async (request, { params }) => {
    try {
        await dbConnect();

        // Fetch all patients
        const patients = await Patient.find();

        console.log("[Debug] Patients fetched from DB:", JSON.stringify(patients, null, 2));

        // Return the response
        return new Response(JSON.stringify(patients), { status: 200 });
    } catch (error) {
        console.error("[Error] Failed to fetch all patients:", error.message);
        return new Response(`Failed to fetch all patients: ${error}`, { status: 500 });
    }
};

export const PATCH = async (request, { params }) => {
    try {
        const payload = await request.json();
        console.log("[Debug] Incoming PATCH payload:", JSON.stringify(payload, null, 2));

        const {
            _id,
            files,
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
            doctor
        } = payload;

        await dbConnect();

        console.log("[Debug] Looking for patient with ID:", _id);
        const existingPatient = await Patient.findById(_id);

        if (!existingPatient) {
            console.error("[Error] Patient not found:", _id);
            return new Response("Patient not found", { status: 404 });
        }

        console.log("[Debug] Existing patient before update:", JSON.stringify(existingPatient, null, 2));

        existingPatient.files = files ?? existingPatient.files;
        existingPatient.firstName = firstName ?? existingPatient.firstName;
        existingPatient.lastName = lastName ?? existingPatient.lastName;
        existingPatient.phone = phone ?? existingPatient.phone;
        existingPatient.telegramAccessHash = telegramAccessHash ?? existingPatient.telegramAccessHash;
        existingPatient.telegramChatId = telegramChatId ?? existingPatient.telegramChatId;
        existingPatient.dob = dob ?? existingPatient.dob;
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

export const POST = async (request, { params }) => {
    try {
        const payload = await request.json();
        console.log("[Debug] Incoming POST payload:", JSON.stringify(payload, null, 2));

        await dbConnect();

        const { assignedDocId, clinics } = payload;

        const patientData = await Patient.find({ assignedDocId })
            .populate("coordinatorId")
            .populate("assignedDocId");

        console.log("[Debug] Patient data fetched for assignedDocId:", assignedDocId);
        console.log("[Debug] Patient data:", JSON.stringify(patientData, null, 2));

        const clinicCounts = {};
        for (let clinic of clinics) {
            const countQuery = { assignedClinic: clinic, assignedDocId: null };
            const count = await Patient.countDocuments(countQuery);
            clinicCounts[clinic] = count;
        }
        console.log("[Debug] Clinic counts:", clinicCounts);

        return new Response(JSON.stringify({ patientData, clinicCounts }), { status: 200 });
    } catch (error) {
        console.error("[Error] Failed to fetch patients:", error.message);
        return new Response(`Failed to fetch patients: ${error}`, { status: 500 });
    }
};