// components/TriageDashboard/TriageNoteModal.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Button } from "./../ui/button";
import EditIcon from '@mui/icons-material/Edit';
import useTriageNoteModalViewModel from './TriageNoteModalViewModel';

const TriageNoteModal = ({ note, patientId, patientName, previousTriageNotes = [] }) => {
    const [open, setOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);

    const { loading, fetchedNotes, fetchPreviousNotes, handleSaveTriageNote } = useTriageNoteModalViewModel(patientId, () => {
        setOpen(false); // Close modal on successful save
    });

    const handleOpen = () => {
        setOpen(true);
        fetchPreviousNotes();
    };

    const handleClose = () => setOpen(false);

    const handleSave = () => {
        handleSaveTriageNote(currentNote);
    };

    return (
        <>
            <Button onClick={handleOpen} variant="outline" aria-hidden={open ? "true" : "false"}>
                <EditIcon />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Triage Note for {patientName} (ID: {patientId})</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
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
                                {fetchedNotes.map(note => (
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

export default TriageNoteModal;