    // components/PatientViewModels/PatientNotes/CombinedNotesViewModel.tsx
    import { useState, useCallback } from 'react';
    import { usePatientDashboard } from "../../../components/PatientViewModels/PatientDashboardContext";

    export function CombinedNotesViewModel(patientId: string) {
        const { notes, authorName, authorID, refreshPatientNotes, userSession } = usePatientDashboard();
        const [templateType, setTemplateType] = useState<'physician' | 'procedure' | 'subjective'>('physician');
        const [isLoading, setIsLoading] = useState(false);

        const [physicianNote, setPhysicianNote] = useState({
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            attendingPhysician: '',
            hpi: '',
            rosConstitutional: '',
            rosCardiovascular: '',
            rosRespiratory: '',
            rosGastrointestinal: '',
            rosGenitourinary: '',
            rosMusculoskeletal: '',
            rosNeurological: '',
            rosPsychiatric: '',
            mdm: '',
            planAndFollowUp: '',
            diagnosis: '',
            signature: ''
        });

        const [procedureNote, setProcedureNote] = useState({
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            procedureName: '',
            attendingPhysician: '',
            diagnosis: '',
            notes: '',
            plan: '',
        });

        const [subjectiveNote, setSubjectiveNote] = useState({
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            subjective: '',
            objective: '',
            assessment: '',
            plan: ''
        });

        // Function to set the note fields based on type
        const setNoteField = useCallback((noteType: 'physician' | 'procedure' | 'subjective', name: string, value: string) => {
            switch (noteType) {
                case 'physician':
                    setPhysicianNote(prev => ({ ...prev, [name]: value }));
                    break;
                case 'procedure':
                    setProcedureNote(prev => ({ ...prev, [name]: value }));
                    break;
                case 'subjective':
                    setSubjectiveNote(prev => ({ ...prev, [name]: value }));
                    break;
                default:
                    console.error('Invalid note type');
            }
        }, []);

        const createNote = useCallback(async () => {
            console.log('authorID:', authorID); // Log authorID to check if it's available
            console.log('patientId:', patientId);

            if (!authorID || !patientId) {
                console.error('Missing authorID or patientId');
                return;
            }

            let noteData;
            switch (templateType) {
                case 'physician':
                    noteData = {
                        noteType: 'physician',
                        content: physicianNote,  // Directly assign the physicianNote object
                        email: userSession?.email,
                        authorName,
                        authorID,
                    };
                    break;
                case 'procedure':
                    noteData = {
                        noteType: 'procedure',
                        content: procedureNote,  // Directly assign the procedureNote object
                        email: userSession?.email,
                        authorName,
                        authorID,
                    };
                    break;
                case 'subjective':
                    noteData = {
                        noteType: 'subjective',
                        content: subjectiveNote,  // Directly assign the subjectiveNote object
                        email: userSession?.email,
                        authorName,
                        authorID,
                    };
                    break;
            }

            try {
                setIsLoading(true);
                const response = await fetch(`/api/patient/${patientId}/notes/doctor-notes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(noteData),
                });
                if (!response.ok) {
                    throw new Error(`Failed to create note: ${response.status}`);
                }

                const newNote = await response.json();
                await refreshPatientNotes(); // Refresh the notes

                // Reset the form fields after successful note creation
                resetNoteFields();

                console.log('Note created:', newNote);
            } catch (error) {
                console.error('Error creating note:', error);
            } finally {
                setIsLoading(false);
            }
        }, [templateType, physicianNote, procedureNote, subjectiveNote, patientId, authorID, authorName, userSession, refreshPatientNotes]);

// Helper function to reset form fields
        const resetNoteFields = () => {
            setPhysicianNote({
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0],
                attendingPhysician: '',
                hpi: '',
                rosConstitutional: '',
                rosCardiovascular: '',
                rosRespiratory: '',
                rosGastrointestinal: '',
                rosGenitourinary: '',
                rosMusculoskeletal: '',
                rosNeurological: '',
                rosPsychiatric: '',
                mdm: '',
                planAndFollowUp: '',
                diagnosis: '',
                signature: ''
            });

            setProcedureNote({
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0],
                procedureName: '',
                attendingPhysician: '',
                diagnosis: '',
                notes: '',
                plan: '',
            });

            setSubjectiveNote({
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().split(' ')[0],
                subjective: '',
                objective: '',
                assessment: '',
                plan: ''
            });
        };

        // Ensure setNoteField is returned
        return {
            notes,
            templateType,
            setTemplateType,
            physicianNote,
            procedureNote,
            subjectiveNote,
            setNoteField, // Include setNoteField in the return object
            createNote,
            isLoading,
        };
    }