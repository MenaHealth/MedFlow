// app/api/patient/assign.js
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { patientId, doctor } = req.body;

    console.log('Received request body:', req.body); // Log request body

    if (!patientId || !doctor) {
      console.log('Missing patientId or doctor');
      return res.status(400).json({ error: 'Missing patientId or doctor name' });
    }

    try {
      // Log to ensure we are attempting to connect to the DB
      console.log('Attempting to connect to MongoDB...');

      const client = await connectToDatabase();
      const db = client.db('med_flow'); // Use the correct database name

      console.log('Successfully connected to MongoDB');

      const objectId = new ObjectId(patientId);

      // Attempt the MongoDB query and log the result
      console.log(`Updating patient with _id ${objectId}, assigning doctor: ${doctor}`);
      
      const result = await db.collection('patients').findOneAndUpdate(
        { _id: objectId },
        { $set: { doctor: doctor, status: 'In Progress' } },
        { returnDocument: 'after' }
      );

      console.log('MongoDB query result:', result);

      if (!result.value) {
        console.log('Patient not found');
        return res.status(404).json({ error: 'Patient not found' });
      }

      console.log('Patient successfully updated:', result.value);
      res.status(200).json(result.value);
    } catch (error) {
      console.error('Error assigning case:', error);
      res.status(500).json({ error: 'Failed to assign doctor', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
