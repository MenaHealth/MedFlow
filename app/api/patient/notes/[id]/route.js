// File: app/api/patient/notes/[id]/route.js
import { ObjectId } from 'mongodb';
import { connectToDB } from "@/utils/database"; // Use your existing database connection utility

export async function GET(req, res) {
    console.log(`Fetching notes for ID: ${req.query.id}`);

    try {
        const db = await connectToDB(); // Connect to the database
        const patientId = req.query.id;
        const patient = await db.collection('patients').findOne({ _id: ObjectId(patientId) }, { projection: { notes: 1 } });

        if (!patient) {
            res.status(404).json({ message: 'Patient not found' });
        } else {
            res.status(200).json(patient.notes || []);
        }
    } catch (error) {
        console.error('Failed to fetch notes:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export async function POST(req, res) {
    console.log(`Adding note for ID: ${req.query.id}`);

    try {
        const db = await connectToDB();
        const patientId = req.query.id;
        const { note } = req.body;

        const response = await db.collection('patients').updateOne(
            { _id: ObjectId(patientId) },
            { $push: { notes: note } }
        );

        if (response.modifiedCount === 1) {
            res.status(200).json({ message: 'Note added successfully' });
        } else {
            res.status(404).json({ message: 'Patient not found' });
        }
    } catch (error) {
        console.error('Failed to add note:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}