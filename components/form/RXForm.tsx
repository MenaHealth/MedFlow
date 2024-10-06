import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, MenuItem, List, ListItem, ListItemText, Divider, Typography, IconButton, Select, InputLabel, FormControl } from '@mui/material';
import { Publish as PublishIcon, Delete as DeleteIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';

interface RXFormProps {
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

const RXForm: React.FC<RXFormProps> = ({ patientId, username }) => {
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
    const [selectedNote, setSelectedNote] = useState<Note | null>(null); // Track selected note
    const [templateType, setTemplateType] = useState('rxform'); // Default to rxform
    const [showTemplateButtons, setShowTemplateButtons] = useState(false);

    const fetchNote = useCallback(async (noteId: string) => {
        try {
            const response = await fetch(`/api/patient/notes/${patientId}?noteId=${noteId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const note = await response.json();
            setSelectedNote(note); // Set the selected note
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

    const handleNoteClick = (note: Note) => {
        setSelectedNote(note); // Set the selected note when clicked
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

    const toggleTemplate = (template: string) => {
        if (selectedNote) {
            // Clear the selected note if one is viewed, returning to form view
            setSelectedNote(null);
        } else {
            // Otherwise, toggle between RX and Medical Request templates
            setTemplateType(template);
            setShowTemplateButtons(false);
        }
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
                            <ListItem alignItems="flex-start" button onClick={() => handleNoteClick(item)}>
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
                                    size="small"
                                >
                                    <DownloadIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
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
                {/* Template Button */}
                <div className="flex justify-between items-center mt-0 mb-0 relative" style={{ position: 'absolute', top: '-30px', right: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Button
                            variant="outlined"
                            onClick={() => setShowTemplateButtons(!showTemplateButtons)} // Toggle the template buttons
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
                        {showTemplateButtons && !selectedNote && (
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

                {selectedNote ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            <b>{selectedNote.title}</b>
                        </Typography>

                        {templateType === 'rxform' ? (
                            <>
                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Full Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.patientName || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Phone Number
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.phoneNumber || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Age
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.age || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Address / Area Located
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.address || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Patient ID Number
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.patientID || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Referring Dr
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.referringDr || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Prescribing Dr
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.prescribingDr || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Diagnosis
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.diagnosis || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Medications Needed
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.medicationsNeeded || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Pharmacy / Clinic
                                    </Typography>
                                    <Typography variant="body1">
                                        {rxformNote.pharmacyOrClinic || 'N/A'}
                                    </Typography>
                                </div>
                            </>
                        ) : (
                            <>
                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.date || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Dr In Charge
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.drInCharge || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Specialty
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.specialty || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                     Patient&apos;s Full Name
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.patientName || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Patient&apos;s Phone Number
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.patientPhoneNumber || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Patient&apos;s Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.patientAddress || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Diagnosis
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.diagnosis || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Medications Needed
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.medications || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Dosage
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.dosage || 'N/A'}
                                    </Typography>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        Frequency/Duration
                                    </Typography>
                                    <Typography variant="body1">
                                        {medicalrequestNote.frequency || 'N/A'}
                                    </Typography>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div>
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
                                        onChange={(event: SelectChangeEvent) => {
                                            setrxformNote({
                                                ...rxformNote,
                                                pharmacyOrClinic: event.target.value as string,
                                            });
                                        }}
                                    >
                                        {['Egypt', 'Gaza'].map((pharmacy) => (
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
                                    label="Dr In Charge"
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
                                    label="Medications"
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
                )}
            </div>
        </div>
    );
}

export default RXForm;
