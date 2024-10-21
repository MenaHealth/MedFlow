// TriageModalViewModel.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const useTriageModalViewModel = (patientId, onSuccess) => {
    const { data: session } = useSession(); // Access session data correctly
    const [loading, setLoading] = useState(false);
    const [fetchedNotes, setFetchedNotes] = useState([]);

    const fetchPreviousNotes = () => {
        setLoading(true);
        fetch(`/api/patient/${patientId}?type=triage`)
            .then((response) => response.json())
            .then((data) => {
                setFetchedNotes(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching notes:", error);
                setLoading(false);
            });
    };

    const handleSaveTriageData = async ({ status, priority, specialty, noteContent }) => {
        setLoading(true);
        console.log("Session data:", session);

        // Extract author details from session
        const authorName = session?.user?.name || `${session?.user?.firstName} ${session?.user?.lastName}`; // Ensure name is correct
        const authorID = session?.user?._id;
        const email = session?.user?.email;

        if (!authorName || !authorID || !email) {
            console.log("Session author name:", authorName , "| author ID:" , authorID, "| author email:" , email);
            console.error("Missing session details for author.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/patient/${patientId}/triage`, {
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
                    authorID,
                    email,
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