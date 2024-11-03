// pages/api/get-phone-number.js
import { getPatientDetails } from 'your-database-service'; // Replace this with the actual function to fetch patient details

export default async function handler(req, res) {
    const { patientId } = req.query;

    try {
        // Fetch the patient details based on patientId
        const patient = await getPatientDetails(patientId); // This should fetch `pmhx` and `country code`

        if (patient && patient.pmhx && patient.countryCode) {
            // Construct the phone number in E.164 format
            const phoneNumber = `+${patient.countryCode}${patient.pmhx}`;
            res.status(200).json({ phoneNumber });
        } else {
            res.status(404).json({ error: 'Phone number or country code not found' });
        }
    } catch (error) {
        console.error('Error fetching phone number:', error);
        res.status(500).json({ error: 'Failed to fetch phone number' });
    }
}
