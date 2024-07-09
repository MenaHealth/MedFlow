// components/form/NotesForm.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Publish as PublishIcon } from '@mui/icons-material';

interface NotesFormProps {
    patientId: string;
}

const NotesForm: React.FC<NotesFormProps> = ({ patientId }) => {
    const [note, setNote] = useState<string>('');
    const [notesList, setNotesList] = useState<string[]>([]);

    useEffect(() => {
        // Fetch notes when component mounts
        fetchNotes(patientId);
    }, [patientId]);

    const fetchNotes = async (patientId: string) => {
        try {
            const response = await fetch(`/api/patient/${patientId}`);
            const data = await response.json();
            if (data.notes) {
                // Assuming 'notes' is a string; adjust if it's stored differently
                setNotesList(data.notes.split('\n')); // Example: split by newline if multiple notes are in one string
            }
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNote(event.target.value);
    };

    const publishNote = async () => {
        if (note.trim()) {
            // Example: Post to add a new note, this needs a backend endpoint
            const response = await fetch(`/api/patient/${patientId}/add-note`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ note }),
            });
            if (response.ok) {
                const updatedNotes = await response.json();
                setNotesList(updatedNotes); // Update based on what the API returns
            }
            setNote('');  // Clear input after publishing
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row">
            <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <TextField
                    label="Write your note here..."
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={note}
                    onChange={handleNoteChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PublishIcon />}
                    onClick={publishNote}
                    style={{ marginTop: '10px' }}
                >
                    Publish
                </Button>
            </div>
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-4">Previous Notes</h2>
                <List component="nav" aria-label="previous notes">
                    {notesList.map((item, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemText primary={item} />
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </div>
        </div>
    );
}

export default NotesForm;