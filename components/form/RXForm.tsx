import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, MenuItem, List, ListItem, ListItemText, Divider, Typography, IconButton, Select, InputLabel, FormControl } from '@mui/material';
import { Publish as PublishIcon, Delete as DeleteIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';

interface NotesFormProps {
    patientId: string;
    username: string;
}

interface Note {
    _id: string;
    content: string;
    username: string;
    date: string;
    title: string;
}

const NotesForm: React.FC<NotesFormProps> = ({ patientId, username }) => {
    const [rxformNote, setrxformNote] = useState({
        patientName: '',
        phoneNumber: '',
        age: '',
        address: '',
        patientID: '',
        date: '',
        referringDr: '',
        prescribingDr: '',
        diagnosis: '',
        medicationsNeeded: '',
        pharmacyOrClinic: '',
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
        'EGH, Khan Younis',
        'Shuhada Al Aqsa, Dier El Balah',
        'Abu Yousif Najjar, Rafah',
        'Al Emarati, Rafah',
        'Tal Sultan, Rafah',
        'Kuwaiti Hospital, Rafah',
        'Jordanian Field Hospital, Khan Younis',
        'Nusseirat, Al Awda',
    ];

    const [notesList, setNotesList] = useState<Note[]>([]);
    const [templateType, setTemplateType] = useState('rxform'); // Default to rxform
    const [showTemplateButtons, setShowTemplateButtons] = useState(false);
    const [noteContent, setNoteContent] = useState('');

    const fetchNote = useCallback(async (noteId: string) => {
        try {
            const response = await fetch(`/api/patient/notes/${patientId}?noteId=${noteId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const note = await response.json();
            setNoteContent(note.content);
        } catch (error) {
            console.error('Failed to fetch note:', error);
        }
    }, [patientId]);

    useEffect(() => {
        fetchNote(patientId);
    }, [patientId, fetchNote]);

    const publishNote = async () => {
        let noteContent = '';
        let noteTitle = '';

        if (templateType === 'rxform') {
            noteContent = `
                RX Form Note
                Full Name: ${rxformNote.patientName}
                Phone Number: ${rxformNote.phoneNumber}
                Age: ${rxformNote.age}
                Address: ${rxformNote.address}
                Patient ID: ${rxformNote.patientID}
                Date: ${rxformNote.date}
                Referring Dr: ${rxformNote.referringDr}
                Prescribing Dr: ${rxformNote.prescribingDr}
                Diagnosis: ${rxformNote.diagnosis}
                Medications Needed: ${rxformNote.medicationsNeeded}
                Pharmacy/Clinic: ${rxformNote.pharmacyOrClinic}
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
                const response = await fetch(`/api/patient/notes/${patientId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: noteContent,
                        username: username,
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
        if (templateType === 'rxform') {
            setrxformNote({
                ...rxformNote,
                [e.target.name]: e.target.value,
            });
        } else {
            setmedicalrequestNote({
                ...medicalrequestNote,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handlePharmacyChange = (event: SelectChangeEvent) => {
        setrxformNote({
            ...rxformNote,
            pharmacyOrClinic: event.target.value as string,
        });
    };

    const toggleTemplate = (template: string) => {
        setTemplateType(template);
        setShowTemplateButtons(false);
    };

    const deleteNote = async (noteId: string) => {
        try {
            const response = await fetch(`/api/patient/notes/${noteId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setNotesList((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        } catch (error) {
            console.error('Failed to delete note:', error);
            alert('An error occurred while trying to delete the note. Please try again.');
        }
    };

    const handleDownload = (noteId: string) => {
        const note = notesList.find(note => note._id === noteId);

        if (!note) {
            console.error('Note not found for download');
            return;
        }

        const blob = new Blob([note.content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `note-${noteId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row" style={{ paddingBottom: '80px', minHeight: '100vh' }}>
            <div className="w-full md:w-1/4 bg-gray-200 p-4">
                <Typography variant="h6" gutterBottom>
                    <b>Previous Notes</b>
                </Typography>
                <List component="nav" aria-label="previous notes">
                    {notesList.map((item) => (
                        <React.Fragment key={item._id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={item.title}
                                    secondary={
                                        <React.Fragment>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {item.username}
                                            </Typography>
                                            {" — "}{new Date(item.date).toLocaleString()}
                                        </React.Fragment>
                                    }
                                />
                                <IconButton
                                    edge="end"
                                    aria-label="download"
                                    onClick={() => handleDownload(item._id)}
                                    size="small"
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => deleteNote(item._id)}
                                    size="small"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </ListItem>
                            <Divider component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </div>
            <div className="w-full md:w-3/4 bg-white p-4 relative">
                <div className="flex justify-between items-center mt-0 mb-0 relative" style={{ position: 'absolute', top: '-30px', right: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowTemplateButtons(!showTemplateButtons)}
                            style={{
                                borderColor: 'black',
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: '25px',
                                padding: '8px 18px', 
                                textTransform: 'none',
                                marginRight: '-10px',
                            }}
                        >
                            Template
                        </Button>
                        {showTemplateButtons && (
                            <div style={{ 
                                position: 'absolute', 
                                top: '0', 
                                right: 'calc(100% + 10px)', 
                                display: 'flex', 
                                gap: '7px',
                            }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => toggleTemplate('rxform')}
                                    style={{
                                        borderColor: 'grey',
                                        backgroundColor: 'white',
                                        color: 'grey',
                                        borderRadius: '25px',
                                        padding: '8px 18px',
                                        whiteSpace: 'nowrap',
                                        textTransform: 'none',
                                    }}
                                >
                                    RX Form
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => toggleTemplate('medicalrequest')}
                                    style={{
                                        borderColor: 'grey',
                                        backgroundColor: 'white',
                                        color: 'grey',
                                        borderRadius: '25px',
                                        padding: '8px 18px',
                                        whiteSpace: 'nowrap',
                                        textTransform: 'none',
                                    }}
                                >
                                    Medical Request
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                {templateType === 'rxform' ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            <b>Prescription Form</b>
                        </Typography>
                        <TextField
                            label="Full Name"
                            name="patientName"
                            variant="outlined"
                            fullWidth
                            value={rxformNote.patientName}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            variant="outlined"
                            fullWidth
                            value={rxformNote.phoneNumber}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Age"
                            name="age"
                            variant="outlined"
                            fullWidth
                            value={rxformNote.age}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Address / Area Located"
                            name="address"
                            variant="outlined"
                            fullWidth
                            value={rxformNote.address}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Patient ID Number"
                            name="patientID"
                            variant="outlined"
                            fullWidth
                            value={rxformNote.patientID}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Referring Dr"
                            name="referringDr"
                            variant="outlined"
                            fullWidth
                            value={rxformNote.referringDr}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Prescribing Dr"
                            name="prescribingDr"
                            variant="outlined"
                            fullWidth
                            value={rxformNote.prescribingDr}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Diagnosis"
                            name="diagnosis"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={rxformNote.diagnosis}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Medications Needed"
                            name="medicationsNeeded"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={rxformNote.medicationsNeeded}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <FormControl fullWidth style={{ marginBottom: '10px' }}>
                            <InputLabel>Pharmacy/Clinic</InputLabel>
                            <Select
                                value={rxformNote.pharmacyOrClinic}
                                onChange={handlePharmacyChange}
                            >
                                {pharmacies.map((pharmacy) => (
                                    <MenuItem key={pharmacy} value={pharmacy}>
                                        {pharmacy}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            <b>Medical Request</b>
                        </Typography>
                        <TextField
                            label="Date"
                            name="date"
                            variant="outlined"
                            fullWidth
                            value={medicalrequestNote.date}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Dr(s) In Charge Full Name"
                            name="drInCharge"
                            variant="outlined"
                            fullWidth
                            value={medicalrequestNote.drInCharge}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Specialty"
                            name="specialty"
                            variant="outlined"
                            fullWidth
                            value={medicalrequestNote.specialty}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Patient's Full Name"
                            name="patientName"
                            variant="outlined"
                            fullWidth
                            value={medicalrequestNote.patientName}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Patient's Phone Number"
                            name="patientPhoneNumber"
                            variant="outlined"
                            fullWidth
                            value={medicalrequestNote.patientPhoneNumber}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Patient's Address"
                            name="patientAddress"
                            variant="outlined"
                            fullWidth
                            value={medicalrequestNote.patientAddress}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Diagnosis"
                            name="diagnosis"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={medicalrequestNote.diagnosis}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Name of Medications Needed"
                            name="medications"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={medicalrequestNote.medications}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Dosage"
                            name="dosage"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={medicalrequestNote.dosage}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Frequency/Duration"
                            name="frequency"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={medicalrequestNote.frequency}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                    </>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PublishIcon />}
                    onClick={publishNote}
                >
                    Publish
                </Button>
            </div>
        </div>
    );
}

export default NotesForm;
