// TriageNoteModalViewModel.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const useTriageNoteModalViewModel = (patientId, onSuccess) => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [fetchedNotes, setFetchedNotes] = useState([]);

    const fetchPreviousNotes = () => {
        setLoading(true);
        fetch(`/api/patient/${patientId}?type=triage`)
            .then(response => response.json())
            .then(data => {
                setFetchedNotes(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching notes2:", error);
                setLoading(false);
            });
    };

    const handleSaveTriageNote = (updatedNote) => {
        setLoading(true);
        return fetch(`/api/patient/${patientId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                noteType: 'triage',
                content: updatedNote,
                email: session?.user?.email,
                authorName: session?.user?.name,
                authorID: session?.user?.id,
            }),
        })
            .then(response => {
                setLoading(false);
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
                return response.json();
            })
            .then(() => {
                if (onSuccess) onSuccess(); // Trigger any success callback
            })
            .catch(error => {
                console.error('Error saving triage note:', error);
                setLoading(false);
            });
    };

    return {
        loading,
        fetchedNotes,
        fetchPreviousNotes,
        handleSaveTriageNote,
    };
};

export default useTriageNoteModalViewModel;