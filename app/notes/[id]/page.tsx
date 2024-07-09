// app/notes/[id]/page.jsx
"use client";

import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Publish as PublishIcon } from '@mui/icons-material';
import PatientSubmenu from "../../../components/PatientSubmenu";

const Notes = () => {
    const [note, setNote] = useState('');
    const [notesList, setNotesList] = useState([]);

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const publishNote = () => {
        if (note.trim()) {
            setNotesList([...notesList, note]);
            setNote(''); // Clear input after publishing
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row">
            <PatientSubmenu />
            <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <h1 className="text-2xl font-bold mb-4">Notes</h1>
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
};

export default Notes;