// components/TriageDashboard/TriageModalView.tsx




import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem } from '@mui/material';
import { Button } from './../ui/button';
import EditIcon from '@mui/icons-material/Edit';
import useTriageModalViewModel from './TriageModalViewModel';
import { DoctorSpecialties } from '@/data/doctorSpecialty.enum';

const statusOptions = ['Not Selected', 'Not Started', 'Triaged', 'In-Progress', 'Completed', 'Archived'];
const priorityOptions = ['Not Selected', 'Routine', 'Moderate', 'Urgent', 'Emergency'];

const TriageModalView = ({
                             note,
                             patientId,
                             patientName,
                             currentStatus,
                             currentPriority,
                             currentSpecialty,
                             userEmail,
                             userId,
                             userFirstName
                         }) => {
    const [open, setOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);
    const [status, setStatus] = useState(currentStatus);
    const [priority, setPriority] = useState(currentPriority);
    const [specialty, setSpecialty] = useState(currentSpecialty);

    const { loading, fetchedNotes, fetchPreviousNotes, handleSaveTriageData } = useTriageModalViewModel(patientId, () => {
        setOpen(false); // Close modal on successful save
    });

    const handleOpen = () => {
        setOpen(true);
        fetchPreviousNotes();
    };

    const handleClose = () => setOpen(false);

    const handleSave = () => {
        handleSaveTriageData({
            status,
            priority,
            specialty,
            noteContent: currentNote,
            email: userEmail,
            authorId: userId,
            authorName: userFirstName
        });
    };

    return (
        <>
            <Button onClick={handleOpen} variant="outline" aria-hidden={open ? "true" : "false"}>
                <EditIcon />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Triage for {patientName} (ID: {patientId})</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Status"
                        select
                        fullWidth
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        {statusOptions.map((statusOption) => (
                            <MenuItem key={statusOption} value={statusOption}>
                                {statusOption}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Priority"
                        select
                        fullWidth
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        {priorityOptions.map((priorityOption) => (
                            <MenuItem key={priorityOption} value={priorityOption}>
                                {priorityOption}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Specialty"
                        select
                        fullWidth
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                    >
                        {DoctorSpecialties.map((specialtyOption) => (
                            <MenuItem key={specialtyOption} value={specialtyOption}>
                                {specialtyOption}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Triage Note"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                    />

                    <div className="previous-notes-section">
                        <h3>Previous Triage Notes</h3>
                        {fetchedNotes.length > 0 ? (
                            <ul>
                                {fetchedNotes.map((note) => (
                                    <li key={note._id}>
                                        <p>{new Date(note.date).toLocaleString()}</p>
                                        <p>{note.content}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No previous triage notes available.</p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSave} color="primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TriageModalView;