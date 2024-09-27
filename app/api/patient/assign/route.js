import dbConnect from "@/utils/database";
import { ObjectId } from 'mongodb';

export async function POST(req, res) {
  const { patientId, doctor, status } = await req.json();

  // Log the incoming request data
  console.log("Received request with data:", { patientId, doctor, status });

  try {
    // Validate the patientId
    if (!ObjectId.isValid(patientId)) {
      console.log("Invalid patient ID:", patientId);
      return new Response(JSON.stringify({ message: 'Invalid patient ID format.' }), { status: 400 });
    }

    // Connect to the database
    const { db } = await connectToDB();

    // Update the patient with the new doctor and status
    const result = await db.collection('patients').updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          status: status,
          firstName: doctor.firstName,  
          lastName: doctor.lastName,    
          specialty: specialty
        }
      }
    );
    

    console.log("MongoDB update result:", result);

    if (result.modifiedCount === 1) {
      console.log("Case assigned successfully");
      return new Response(JSON.stringify({ message: 'Case assigned successfully!' }), { status: 200 });
    } else {
      console.log("Failed to assign case");
      return new Response(JSON.stringify({ message: 'Failed to assign case.' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error assigning case:', error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), { status: 500 });
  }
}
