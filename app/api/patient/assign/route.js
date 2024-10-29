// app/api/patient/assign/route.ts
import dbConnect from "@/utils/database";
import { ObjectId } from 'mongodb';

export async function PATCH(req, res) {
  const { patientId, doctor, status, priority, medOrders, rxOrders } = await req.json();

  try {
    // Validate patientId
    if (!ObjectId.isValid(patientId)) {
      return new Response(JSON.stringify({ message: 'Invalid patient ID format.' }), { status: 400 });
    }

    // Connect to the database
    const { db } = await dbConnect();

    // Prepare update fields
    const updateFields = {
      status,
      priority,
      ...(doctor && { "doctor.firstName": doctor.firstName, "doctor.lastName": doctor.lastName })
    };

    // Conditionally add medOrders if they are present and valid
    if (medOrders) {
      medOrders.forEach((order, index) => {
        if (order.content.doctorSpecialty) {
          updateFields[`medOrders.${index}.content.doctorSpecialty`] = order.content.doctorSpecialty;
        }
        // Add other content fields here as needed...
      });
    }

    // Conditionally add rxOrders if present and valid
    if (rxOrders) {
      rxOrders.forEach((order, index) => {
        if (order.content.patientName) {
          updateFields[`rxOrders.${index}.content.patientName`] = order.content.patientName;
        }
        // Add other content fields here as needed...
      });
    }

    // Update the patient document
    const result = await db.collection('patients').updateOne(
        { _id: new ObjectId(patientId) },
        { $set: updateFields }
    );

    if (result.modifiedCount === 1) {
      return new Response(JSON.stringify({ message: 'Patient updated successfully!' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Failed to update patient.' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error updating patient:', error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), { status: 500 });
  }
}