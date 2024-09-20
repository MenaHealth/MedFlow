"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import PatientSubmenu from '../../components/PatientSubmenu';  // Ensure you import the PatientSubmenu

const RXForm: React.FC = () => {
    const [rxData, setRxData] = useState({
        fullName: '',
        phoneNumber: '',
        age: '',
        address: '',
        patientIDNumber: '',
        referringDr: '',
        prescribingDr: '',
        diagnosis: '',
        medicationsNeeded: '',
        pharmacyLocation: '',
    });

    const [medicalrequestNote, setmedicalrequestNote] = useState({
        date: '',
        drInCharge: '',
        specialty: '',
        patientName: '',
        patientPhoneNumber: '',
        patientAddress: '',
        diagnosis: '',
        medications: '',
        dosage: '',
        frequency: '',
    });

    const pharmacies = [
        'Egypt',
        'Gaza',
    ];

    const [notesList, setNotesList] = useState<any[]>([]); // Add a type for notes, if available
    const [templateType, setTemplateType] = useState('rxform'); // Default to rxform
    const [showTemplateButtons, setShowTemplateButtons] = useState(false);
    const [noteContent, setNoteContent] = useState('');

    const fetchNote = useCallback(async (noteId: string) => {
        try {
            const response = await fetch(`/api/patient/notes/${rxData.patientIDNumber}?noteId=${noteId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const note = await response.json();
            setNoteContent(note.content);
        } catch (error) {
            console.error('Failed to fetch note:', error);
        }
    }, [rxData.patientIDNumber]);

    useEffect(() => {
        fetchNote(rxData.patientIDNumber);
    }, [rxData.patientIDNumber, fetchNote]);

    const publishNote = async () => {
        let noteContent = '';
        let noteTitle = '';

        if (templateType === 'rxform') {
            noteContent = `
                RX Form Note
                Full Name: ${rxData.fullName}
                Phone Number: ${rxData.phoneNumber}
                Age: ${rxData.age}
                Address: ${rxData.address}
                Patient ID: ${rxData.patientIDNumber}
                Referring Dr: ${rxData.referringDr}
                Prescribing Dr: ${rxData.prescribingDr}
                Diagnosis: ${rxData.diagnosis}
                Medications Needed: ${rxData.medicationsNeeded}
                Pharmacy Location: ${rxData.pharmacyLocation}
            `;
            noteTitle = 'RX Form';
        } else {
            noteContent = `
                Medical Request Note
                Date: ${medicalrequestNote.date}
                Dr In Charge: ${medicalrequestNote.drInCharge}
                Specialty: ${medicalrequestNote.specialty}
                Patient Name: ${medicalrequestNote.patientName}
                Patient Phone Number: ${medicalrequestNote.patientPhoneNumber}
                Patient Address: ${medicalrequestNote.patientAddress}
                Diagnosis: ${medicalrequestNote.diagnosis}
                Medications Needed: ${medicalrequestNote.medications}
                Dosage: ${medicalrequestNote.dosage}
                Frequency: ${medicalrequestNote.frequency}
            `;
            noteTitle = 'Medical Request';
        }

        if (noteContent.trim()) {
            try {
                const response = await fetch(`/api/patient/notes/${rxData.patientIDNumber}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: noteContent,
                        username: "username_placeholder", // replace with actual username
                        title: noteTitle,
                        date: new Date(),
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newNote = await response.json();
                setNotesList((prevNotes) => [...prevNotes, newNote]);
            } catch (error) {
                console.error('Failed to publish note:', error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRxData({
            ...rxData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        console.log('RX Form Data:', rxData);
    };

    return (
        <div>
            <PatientSubmenu />
            <div className="container mx-auto p-4 flex flex-col md:flex-row" style={{ paddingBottom: '80px', minHeight: '100vh' }}>
                <div className="w-full md:w-3/4 bg-white p-4">
                    <Typography variant="h5" gutterBottom>
                        RX for Patient {rxData.patientIDNumber}
                    </Typography>
                    <form>
                        <TextField
                            label="Full Name"
                            name="fullName"
                            variant="outlined"
                            fullWidth
                            value={rxData.fullName}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            variant="outlined"
                            fullWidth
                            value={rxData.phoneNumber}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Age"
                            name="age"
                            variant="outlined"
                            fullWidth
                            value={rxData.age}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Address / Area Located"
                            name="address"
                            variant="outlined"
                            fullWidth
                            value={rxData.address}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Patient ID Number #"
                            name="patientIDNumber"
                            variant="outlined"
                            fullWidth
                            value={rxData.patientIDNumber}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Referring Dr"
                            name="referringDr"
                            variant="outlined"
                            fullWidth
                            value={rxData.referringDr}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Prescribing Dr"
                            name="prescribingDr"
                            variant="outlined"
                            fullWidth
                            value={rxData.prescribingDr}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Diagnosis"
                            name="diagnosis"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={rxData.diagnosis}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Medications Needed"
                            name="medicationsNeeded"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={rxData.medicationsNeeded}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Pharmacy Location"
                            name="pharmacyLocation"
                            variant="outlined"
                            fullWidth
                            value={rxData.pharmacyLocation}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                        >
                            Submit RX
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RXForm;