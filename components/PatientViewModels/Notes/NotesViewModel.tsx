// components/PatientViewModels/Notes/NotesViewModel.tsx
import { useState, useCallback, useMemo } from 'react';

export interface Note {
    _id: string;
    content: string;
    email: string;
    date: string;
    title: string;
}

export interface PhysicianNote {
    patientName: string;
    patientID: string;
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

export interface ProcedureNote {
    patientName: string;
    patientID: string;
    date: string;
    time: string;
    procedureName: string;
    attendingPhysician: string;
    Diagnosis: string;
    Notes: string;
    Plan: string;
}

export interface SubjectiveNote {
    patientName: string;
    patientID: string;
    date: string;
    time: string;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export function NotesViewModel(patientId: string, userEmail: string) {
    const [notesList, setNotesList] = useState<Note[]>([]);
    const [templateType, setTemplateType] = useState<'physician' | 'procedure' | 'subjective'>('physician');
    const [physicianNote, setPhysicianNote] = useState<PhysicianNote>({
        patientName: '',
        patientID: patientId,
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
        patientName: '',
        patientID: patientId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        procedureName: '',
        attendingPhysician: '',
        Diagnosis: '',
        Notes: '',
        Plan: ''
    });
    const [subjectiveNote, setSubjectiveNote] = useState<SubjectiveNote>({
        patientName: '',
        patientID: patientId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    const fetchNotes = useCallback(async () => {
        if (!patientId) {
            console.error('patientId is undefined');
            return;
        }
        try {
            const response = await fetch(`/api/patient/notes/${patientId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const notes = await response.json();
            setNotesList(notes);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        }
    }, [patientId]);

    const publishNote = useCallback(async () => {
        let noteData;
        let noteTitle;
        let noteType = templateType;

        switch (templateType) {
            case 'physician':
                noteData = {
                    ...physicianNote,
                    email: userEmail,
                    createdAt: new Date().toISOString()
                };
                noteTitle = 'Physician Note';
            case 'procedure':
                noteData = {
                    ...procedureNote,
                    email: userEmail,
                    createdAt: new Date().toISOString()
                };
                noteTitle = 'Procedure Note';
                break;
            case 'subjective':
                noteData = {
                    ...subjectiveNote,
                    email: userEmail,
                    createdAt: new Date().toISOString()
                };
                noteTitle = 'Subjective Note';
                break;
        }

        try {
            const response = await fetch(`/api/patient/notes/${patientId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...noteData,
                    title: noteTitle,
                    type: noteType
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newNote = await response.json();
            setNotesList(prevNotes => [...prevNotes, newNote]);
        }

        catch (error) {
            console.error('Failed to publish note:', error);
        }
    }, [templateType, physicianNote, patientId, userEmail]);

    const deleteNote = useCallback(async (noteId: string) => {
        try {
            const response = await fetch(`/api/patient/notes/${noteId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setNotesList((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    }, []);

    const updateNote = useCallback((type: 'physician' | 'procedure' | 'subjective', name: string, value: string) => {
        switch (type) {
            case 'physician':
                setPhysicianNote(prev => ({ ...prev, [name]: value }));
                break;
            case 'procedure':
                setProcedureNote(prev => ({ ...prev, [name]: value }));
                break;
            case 'subjective':
                setSubjectiveNote(prev => ({ ...prev, [name]: value }));
                break;
        }
    }, []);

    return {
        notesList,
        templateType,
        setTemplateType,
        physicianNote,
        procedureNote,
        subjectiveNote,
        fetchNotes,
        publishNote,
        deleteNote,
        updateNote,
    };
}


