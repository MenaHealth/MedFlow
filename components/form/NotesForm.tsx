// components/form/NotesForm.tsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { Publish as PublishIcon } from '@mui/icons-material';

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
    const [note, setNote] = useState<string>('');
    const [notesList, setNotesList] = useState<Note[]>([]);

    useEffect(() => {
        fetchNotes(patientId);
    }, [patientId]);

    const fetchNotes = async (patientId: string) => {
        try {
            const response = await fetch(`/api/patient/notes/${patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setNotesList(data);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    };

    const publishNote = async () => {
        if (note.trim()) {
            try {
                const response = await fetch(`/api/patient/notes/${patientId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: note, username: username }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newNote = await response.json();
                setNotesList(prevNotes => [...prevNotes, newNote]);
                setNote('');  // Clear input after publishing
            } catch (error) {
                console.error('Failed to publish note:', error);
            }
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
                    onChange={(e) => setNote(e.target.value)}
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
                        <React.Fragment key={item._id}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={item.content}
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
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
            </div>
        </div>
    );
}

export default NotesForm;