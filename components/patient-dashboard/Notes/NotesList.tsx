import React from 'react';
import { List, ListItem } from "@/components/ui/List";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from 'lucide-react';

interface Note {
    _id: string;
    title: string;
    username: string;
    date: string;
}

interface NotesListProps {
    notes: Note[];
    onDelete: (id: string) => void;
}

export const NotesList: React.FC<NotesListProps> = ({ notes, onDelete }) => {
    const handleDownload = (note: Note) => {
        const blob = new Blob([JSON.stringify(note)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `note-${note._id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <List>
            {notes.map((note) => (
                <ListItem key={note._id} className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold">{note.title}</h3>
                        <p className="text-sm text-gray-500">{note.username} - {new Date(note.date).toLocaleString()}</p>
                    </div>
                    <div>
                        <Button onClick={() => handleDownload(note)} size="icon" variant="ghost">
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => onDelete(note._id)} size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </ListItem>
            ))}
        </List>
    );
};