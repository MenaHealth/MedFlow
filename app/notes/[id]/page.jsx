// app/notes/[id]/page.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Publish as PublishIcon } from '@mui/icons-material';

const NotesPage = () => {
    const { id } = useParams(); // Get the dynamic id from the URL
    const [note, setNote] = useState('');
    const [notesList, setNotesList] = useState([]);

    useEffect(() => {
        if (id) {
            fetch(`/api/patient/notes/${id}`)
                .then(response => response.json())
                .then(data => {
                    setNotesList(data);  // Assume the API returns an array of notes
                })
                .catch(error => {
                    console.error('Failed to load notes:', error);
                });
        }
    }, [id]);

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const publishNote = async () => {
        if (note.trim() && id) {
            try {
                const response = await fetch(`/api/patient/notes/${id}`, {
                    method: 'POST',
                    body: JSON.stringify({ note }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const addedNote = await response.json();  // Expecting the added note to be returned
                    setNotesList([...notesList, addedNote]); // Add the new note to the list
                    setNote('');  // Clear the input field after adding
                } else {
                    console.error('Failed to add the note');
                }
            } catch (error) {
                console.error('Error adding the note:', error);
            }
        }
    };

    return (
        <div className="container mx-auto p-4 flex flex-col md:flex-row">
            <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <h1 className="text-2xl font-bold mb-4">Notes for Patient {id}</h1>
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
                    {notesList.map((note, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemText primary={note.content} />  // Adjust according to your data structure
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))}
                </List>
            </div>
        </div>
    );
};

export default NotesPage;