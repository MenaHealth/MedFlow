// api/patient/[id]/triage-note.js
import dbConnect from '@/utils/database';
import TriageNote from '@/models/Note';

export default async function handler(req, res) {
    const { method } = req;
    const { id } = req.query;

    await dbConnect();

    if (method === 'PATCH') {
        try {
            const { note } = req.body;
            const updatedNote = await TriageNote.findByIdAndUpdate(
                id,
                { note },
                { new: true, upsert: true }
            );

            res.status(200).json(updatedNote);
        } catch (error) {
            res.status(500).json({ message: 'Error updating triage note', error });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}