// components/patientViewModels/PatientNotes/CombinedNotesViewModel.tsx
import { useState, useCallback } from 'react';
import { usePatientDashboard } from "../PatientViewModelContext";
import { INote } from "@/models/note";
import { useSession } from 'next-auth/react'; // Import the session hook

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
    const { data: session } = useSession(); // Use session directly here
    const { notes, refreshPatientNotes } = usePatientDashboard();
    const authorName = `${session?.user?.firstName || ''} ${session?.user?.lastName || ''}`;
    const authorID = session?.user?._id || '';
    const [templateType, setTemplateType] = useState<'physician' | 'procedure' | 'subjective'>('physician');
    const [isLoading, setIsLoading] = useState(false);
    const [noteId, setNoteId] = useState<string | null>(null);

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

    const populateNote = useCallback((note: INote) => {
        const noteType = note.noteType;
        // setTemplateType(noteType);
        if (note._id) {
            setNoteId(note._id.toString());
        }
        switch (noteType) {
            case 'physician':
                setNoteField('physician', 'attendingPhysician', note.content?.attendingPhysician);
                setNoteField('physician', 'hpi', note.content?.hpi);
                setNoteField('physician', 'rosConstitutional', note.content?.rosConstitutional);
                setNoteField('physician', 'rosCardiovascular', note.content?.rosCardiovascular);
                setNoteField('physician', 'rosRespiratory', note.content?.rosRespiratory);
                setNoteField('physician', 'rosGastrointestinal', note.content?.rosGastrointestinal);
                setNoteField('physician', 'rosGenitourinary', note.content?.rosGenitourinary);
                setNoteField('physician', 'rosMusculoskeletal', note.content?.rosMusculoskeletal);
                setNoteField('physician', 'rosNeurological', note.content?.rosNeurological);
                setNoteField('physician', 'rosPsychiatric', note.content?.rosPsychiatric);
                setNoteField('physician', 'mdm', note.content?.mdm);
                setNoteField('physician', 'planAndFollowUp', note.content?.planAndFollowUp);
                setNoteField('physician', 'diagnosis', note.content?.diagnosis);
                setNoteField('physician', 'signature', note.content?.signature);
                break;
            case 'procedure':
                setNoteField('procedure', 'procedureName', note.content?.procedureName);
                setNoteField('procedure', 'attendingPhysician', note.content?.attendingPhysician);
                setNoteField('procedure', 'diagnosis', note.content?.diagnosis);
                setNoteField('procedure', 'notes', note.content?.notes);
                setNoteField('procedure', 'plan', note.content?.plan);
                break;
            case 'subjective':
                setNoteField('subjective', 'subjective', note.content?.subjective);
                setNoteField('subjective', 'objective', note.content?.objective);
                setNoteField('subjective', 'assessment', note.content?.assessment);
                setNoteField('subjective', 'plan', note.content?.plan);
                break;
            default:
                console.error('Invalid note type');
        }
    }, [setNoteField]);

    const createNote = useCallback(async (draft: boolean) => {

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
                    email: session?.user.email,
                    authorName,
                    authorID,
                    draft,
                    noteId
                };
                break;
            case 'procedure':
                noteData = {
                    noteType: 'procedure',
                    content: procedureNote,  // Directly assign the procedureNote object
                    email: session?.user.email,
                    authorName,
                    authorID,
                    draft,
                    noteId
                };
                break;
            case 'subjective':
                noteData = {
                    noteType: 'subjective',
                    content: subjectiveNote,  // Directly assign the subjectiveNote object
                    email: session?.user.email,
                    authorName,
                    authorID,
                    draft,
                    noteId
                };
                break;
        }

        try {
            setIsLoading(true);
            const response = await fetch(`/api/patient/${patientId}/notes/doctor-notes`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noteData),
            });
            if (!response.ok) {
                throw new Error(`Failed to create note: ${response.status}`);
            }

            await refreshPatientNotes(); // Refresh the notes

            // Reset the form fields after successful note creation
            resetNoteFields();

        } catch (error) {
            console.error('Error creating note:', error);
        } finally {
            setIsLoading(false);
        }
    }, [templateType, physicianNote, procedureNote, subjectiveNote, patientId, authorID, authorName, session, refreshPatientNotes]);

    const deleteNote = async (noteId: string) => {
        try {
            const response = await fetch(`/api/patient/${patientId}/notes/doctor-notes/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ noteId }),
            });
            if (!response.ok) {
                throw new Error(`Failed to delete note: ${response.status}`);
            }

            await refreshPatientNotes(); // Refresh the notes

        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

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
        populateNote,
        deleteNote,
        setNoteField, // Include setNoteField in the return object
        createNote,
        isLoading,
    };
}