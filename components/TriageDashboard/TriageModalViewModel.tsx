// TriageModalViewModel.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {INote} from "./../../models/note";

interface TriageData {
    status: string;
    priority: string;
    specialty: string;
    noteContent: string;
    email: string;
    authorId: string;
    authorName: string;
}

const useTriageModalViewModel = (patientId: string, onSuccess: () => void) => {
    const { data: session } = useSession(); // Access session data correctly
    const [loading, setLoading] = useState(false);
    const [fetchedNotes, setFetchedNotes] = useState<INote[]>([]); // Assuming INote is the correct type

    const fetchPreviousNotes = () => {
        setLoading(true);
        fetch(`/api/patient/${patientId}?type=triage`)
            .then((response) => response.json())
            .then((data) => {
                setFetchedNotes(data.notes || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching notes:", error);
                setLoading(false);
            });
    };

    const handleSaveTriageData = async ({
                                            status,
                                            priority,
                                            specialty,
                                            noteContent,
                                            email,
                                            authorId,
                                            authorName,
                                        }: TriageData) => {
        setLoading(true);
        console.log("Session data:", session);

        try {
            const response = await fetch(`/api/patient/${patientId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    priority,
                    specialty,
                    noteContent,
                    noteType: 'triage',
                    authorName,
                    authorID: authorId,
                    email, // Now explicitly passing email here
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update patient data: ${response.status}`);
            }

            await response.json();
            if (onSuccess) onSuccess(); // Trigger the success callback
        } catch (error) {
            console.error("Error saving triage data:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        fetchedNotes,
        fetchPreviousNotes,
        handleSaveTriageData, // Function to save data
    };
};

export default useTriageModalViewModel;