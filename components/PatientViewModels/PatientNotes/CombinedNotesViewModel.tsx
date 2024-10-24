// components/PatientViewModels/PatientNotes/CombinedNotesViewModel.tsx
import { useState, useCallback } from 'react';
import { usePatientDashboard } from "../PatientViewModelContext";

// Define the PhysicianNote interface
export interface PhysicianNote {
    date: string;
    time: string;
    attendingPhysician: string;
    hpi: string;
    rosConstitutional: string;
    rosCardiovascular: string;
    rosRespiratory: string;
    rosGastrointestinal: string;
    rosGenitourinary: string;
    rosMusculoskeletal: string;
    rosNeurological: string;
    rosPsychiatric: string;
    mdm: string;
    planAndFollowUp: string;
    diagnosis: string;
    signature: string;
}

// Define the ProcedureNote interface
export interface ProcedureNote {
    date: string;
    time: string;
    procedureName: string;
    attendingPhysician: string;
    diagnosis: string;
    notes: string;
    plan: string;
}

// Define the SubjectiveNote interface
export interface SubjectiveNote {
    date: string;
    time: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export function CombinedNotesViewModel(patientId: string) {
    const { notes, authorName, authorID, refreshPatientNotes, userSession } = usePatientDashboard();
    const [templateType, setTemplateType] = useState<'physician' | 'procedure' | 'subjective'>('physician');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize state for each type of note
    const [physicianNote, setPhysicianNote] = useState<PhysicianNote>({
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

    const [procedureNote, setProcedureNote] = useState<ProcedureNote>({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        procedureName: '',
        attendingPhysician: '',
        diagnosis: '',
        notes: '',
        plan: '',
    });

    const [subjectiveNote, setSubjectiveNote] = useState<SubjectiveNote>({
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