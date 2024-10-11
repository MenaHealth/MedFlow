import { useState, useCallback } from 'react';

export interface Note {
    _id: string;
    content: string;
    username: string;
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
    procedureName: string;
    date: string;
    physician: string;
    Diagnosis: string;
    Notes: string;
    Plan: string;
}

export interface SubjectiveNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export class NotesViewModel {
    private patientId: string;
    private username: string;

    constructor(patientId: string, username: string) {
        this.patientId = patientId;
        this.username = username;
    }

    useNotes = () => {
        const [notesList, setNotesList] = useState<Note[]>([]);
        const [templateType, setTemplateType] = useState<'physician' | 'procedure' | 'subjective'>('physician');
        const [physicianNote, setPhysicianNote] = useState<PhysicianNote>({} as PhysicianNote);
        const [procedureNote, setProcedureNote] = useState<ProcedureNote>({} as ProcedureNote);
        const [subjectiveNote, setSubjectiveNote] = useState<SubjectiveNote>({} as SubjectiveNote);

        const fetchNotes = useCallback(async () => {
            try {
                const response = await fetch(`/api/patient/notes/${this.patientId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const notes = await response.json();
                setNotesList(notes);
            } catch (error) {
                console.error('Failed to fetch notes:', error);
            }
        }, [this.patientId]);

        const publishNote = useCallback(async () => {
            let noteData;
            let noteTitle;
            let noteType = templateType;

            switch (templateType) {
                case 'physician':
                    noteData = {
                        date: physicianNote.date,
                        time: physicianNote.time,
                        attendingPhysician: physicianNote.attendingPhysician,
                        hpi: physicianNote.hpi,
                        rosConstitutional: physicianNote.rosConstitutional,
                        rosCardiovascular: physicianNote.rosCardiovascular,
                        rosRespiratory: physicianNote.rosRespiratory,
                        rosGastrointestinal: physicianNote.rosGastrointestinal,
                        rosGenitourinary: physicianNote.rosGenitourinary,
                        rosMusculoskeletal: physicianNote.rosMusculoskeletal,
                        rosNeurological: physicianNote.rosNeurological,
                        rosPsychiatric: physicianNote.rosPsychiatric,
                        mdm: physicianNote.mdm,
                        planAndFollowUp: physicianNote.planAndFollowUp,
                        diagnosis: physicianNote.diagnosis,
                        signature: physicianNote.signature
                    };
                    noteTitle = 'Physician Note';
                    break;
                // cases for other note types
            }

            try {
                const response = await fetch(`/api/patient/notes/${this.patientId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...noteData,
                        username: this.username,
                        title: noteTitle,
                        type: noteType
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newNote = await response.json();
                setNotesList(prevNotes => [...prevNotes, newNote]);
            } catch (error) {
                console.error('Failed to publish note:', error);
            }
        }, [templateType, physicianNote, procedureNote, subjectiveNote, this.patientId, this.username]);

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
    };
}