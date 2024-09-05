import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Divider, Typography, IconButton } from '@mui/material';
import { Publish as PublishIcon, Delete as DeleteIcon, GetApp as DownloadIcon } from '@mui/icons-material';

interface NotesFormProps {
    patientId: string;
    username: string;
}

interface Note {
    _id: string;
    content: string;
    username: string;
    date: string;
}

const NotesForm: React.FC<NotesFormProps> = ({ patientId, username }) => {
    const [physicianNote, setPhysicianNote] = useState({
        patientName: '',
        patientID: '',
        date: '',
        time: '',
        attendingPhysician: '',
        hpi: '',
        rosConstitutional: '',
        rosCardiovascular: '',
        rosRespiratory: '',
        rosGastrointestinal: '',
        rosGenitourinary: '',
        rosMusculoskeletal: '',
        rosNeurological: '',
        rosPsychiatric: '',
        mdm: '',
        planAndFollowUp: '',
        diagnosis: '',
        signature: '',
    });

    const [procedureNote, setProcedureNote] = useState({
        procedureName: '',
        date: '',
        physician: '',
        Diagnosis: '',
        Notes: '',
        Plan: '',
    });

    const [subjectiveNote, setSubjectiveNote] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
    });

    const [notesList, setNotesList] = useState<Note[]>([]);
    const [templateType, setTemplateType] = useState('physician'); 
    const [showTemplateButtons, setShowTemplateButtons] = useState(false); 

    useEffect(() => {
        fetchNote(patientId);
    }, [patientId]);

    const fetchNote = async (noteId: string) => {
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
    };    

    const publishNote = async () => {
        let noteContent = '';
        let noteTitle = '';
        let noteProcedureName = '';
        let notePhysician = '';
        let noteDiagnosis = '';
        let noteNotes = '';
        let notePlan = '';
    
        if (templateType === 'physician') {
            noteContent = `
                Physician Note
                Patient Name: ${physicianNote.patientName}
                Patient ID: ${physicianNote.patientID}
                Date: ${physicianNote.date}
                Time: ${physicianNote.time}
                Attending Physician: ${physicianNote.attendingPhysician}
                ...
            `;
            noteTitle = 'Physician Note';
            notePhysician = physicianNote.attendingPhysician;
            noteDiagnosis = physicianNote.diagnosis;
            notePlan = physicianNote.planAndFollowUp;
        } else if (templateType === 'procedure') {
            noteContent = `
                Procedure Note
                Procedure Name: ${procedureNote.procedureName}
                Date: ${procedureNote.date}
                Physician: ${procedureNote.physician}
                Diagnosis: ${procedureNote.Diagnosis}
                Notes: ${procedureNote.Notes}
                Plan: ${procedureNote.Plan}
            `;
            noteTitle = 'Procedure Note';
            noteProcedureName = procedureNote.procedureName;
            notePhysician = procedureNote.physician;
            noteDiagnosis = procedureNote.Diagnosis;
            noteNotes = procedureNote.Notes;
            notePlan = procedureNote.Plan;
        } else {
            noteContent = `
                Subjective Note
                Subjective: ${subjectiveNote.subjective}
                Objective: ${subjectiveNote.objective}
                Assessment: ${subjectiveNote.assessment}
                Plan: ${subjectiveNote.plan}
            `;
            noteTitle = 'Subjective Note';
            noteNotes = subjectiveNote.subjective;
            notePlan = subjectiveNote.plan;
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
                        procedureName: noteProcedureName,
                        date: new Date(),
                        physician: notePhysician,
                        diagnosis: noteDiagnosis,
                        notes: noteNotes,
                        plan: notePlan,
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newNote = await response.json();
                setNotesList(prevNotes => [...prevNotes, newNote]);
            } catch (error) {
                console.error('Failed to publish note:', error);
            }
        }
    };

    const toggleTemplate = (template: string) => {
        setTemplateType(template);
        setShowTemplateButtons(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (templateType === 'physician') {
            setPhysicianNote({
                ...physicianNote,
                [e.target.name]: e.target.value,
            });
        } else if (templateType === 'procedure') {
            setProcedureNote({
                ...procedureNote,
                [e.target.name]: e.target.value,
            });
        } else {
            setSubjectiveNote({
                ...subjectiveNote,
                [e.target.name]: e.target.value,
            });
        }
    };

    const deleteNote = async (noteId) => {
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

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row" style={{ paddingBottom: '80px', minHeight: '100vh' }}>
            <div className="w-full md:w-1/4 bg-gray-200 p-4">
                <Typography variant="h6" gutterBottom>
                    <b>Previous Notes</b>
                </Typography>
                <List component="nav" aria-label="previous notes">
                    {notesList.map((item, index) => (
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
                                    onClick={() => toggleTemplate('physician')}
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
                                    Physician
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => toggleTemplate('procedure')}
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
                                    Procedure
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => toggleTemplate('subjective')}
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
                                    Subjective
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                {templateType === 'physician' ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            <b>Physician Note</b>
                        </Typography>
                        <TextField
                            label="Patient Name"
                            name="patientName"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.patientName}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Patient ID"
                            name="patientID"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.patientID}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Date"
                            name="date"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.date}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Time"
                            name="time"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.time}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Attending Physician"
                            name="attendingPhysician"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.attendingPhysician}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="History of Present Illness (HPI)"
                            name="hpi"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={physicianNote.hpi}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Constitutional"
                            name="rosConstitutional"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosConstitutional}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Cardiovascular"
                            name="rosCardiovascular"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosCardiovascular}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Respiratory"
                            name="rosRespiratory"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosRespiratory}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Gastrointestinal"
                            name="rosGastrointestinal"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosGastrointestinal}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Genitourinary"
                            name="rosGenitourinary"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosGenitourinary}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Musculoskeletal"
                            name="rosMusculoskeletal"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosMusculoskeletal}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Neurological"
                            name="rosNeurological"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosNeurological}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Review of Systems (ROS) - Psychiatric"
                            name="rosPsychiatric"
                            variant="outlined"
                            fullWidth
                            value={physicianNote.rosPsychiatric}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Medical Decision Making (MDM)"
                            name="mdm"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={physicianNote.mdm}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Plan and Follow-up"
                            name="planAndFollowUp"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={physicianNote.planAndFollowUp}
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
                            value={physicianNote.diagnosis}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Signature"
                            name="signature"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={physicianNote.signature}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                    </>
                ) : templateType === 'procedure' ? (
                    <>
                        <Typography variant="h6" gutterBottom>
                            <b>Procedure Note</b>
                        </Typography>
                        <TextField
                            label="Procedure Name"
                            name="procedureName"
                            variant="outlined"
                            fullWidth
                            value={procedureNote.procedureName}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Date"
                            name="date"
                            variant="outlined"
                            fullWidth
                            value={procedureNote.date}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Physician"
                            name="physician"
                            variant="outlined"
                            fullWidth
                            value={procedureNote.physician}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Diagnosis"
                            name="Diagnosis"
                            variant="outlined"
                            fullWidth
                            value={procedureNote.Diagnosis}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Notes"
                            name="Notes"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={procedureNote.Notes}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Plan"
                            name="Plan"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={procedureNote.Plan}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                    </>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            <b>Subjective Note</b>
                        </Typography>
                        <TextField
                            label="Subjective"
                            name="subjective"
                            variant="outlined"
                            fullWidth
                            value={subjectiveNote.subjective}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Objective"
                            name="objective"
                            variant="outlined"
                            fullWidth
                            value={subjectiveNote.objective}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Assessment"
                            name="assessment"
                            variant="outlined"
                            fullWidth
                            value={subjectiveNote.assessment}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="Plan"
                            name="plan"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={2}
                            value={subjectiveNote.plan}
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
