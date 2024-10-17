// components/TriageDashboard/TriageNoteComponent.tsx
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface TriageNoteComponentProps {
    note: string;
    onSave: (updatedNote: string) => void;
}

const TriageNoteComponent: React.FC<TriageNoteComponentProps> = ({ note, onSave }) => {
    const [open, setOpen] = useState(false);
    const [currentNote, setCurrentNote] = useState(note);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = () => {
        onSave(currentNote);
        handleClose();
    };

    return (
        <>
            <Button startIcon={<EditIcon />} onClick={handleOpen} variant="contained" color="primary">
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Triage Note</DialogTitle>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TriageNoteComponent;