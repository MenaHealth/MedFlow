    // components/PatientViewModels/PatientNotes/CombinedNotesViewModel.tsx
    import { useState, useCallback, useEffect } from 'react';
    import { usePatientDashboard } from "@/components/PatientViewModels/PatientDashboardContext";
    import { useSession } from "next-auth/react";
    import type { Session } from 'next-auth';

    export interface Note {
        _id: string;
        content: string;
        email: string;
        date: string;
        title: string;
    }

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

    export interface ProcedureNote {
        date: string;
        time: string;
        procedureName: string;
        attendingPhysician: string;
        diagnosis: string;
        notes: string;
        plan: string;
    }

    export interface SubjectiveNote {
        date: string;
        time: string;
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    }

    export function CombinedNotesViewModel(patientId: string) {
        const { data: session, status } = useSession();
        const [userEmail, setUserEmail] = useState('');
        const [authorID, setAuthorID] = useState('');
        const [authorName, setAuthorName] = useState('');
        const [notesList, setNotesList] = useState<Note[]>([]);
        const [templateType, setTemplateType] = useState<'physician' | 'procedure' | 'subjective'>('physician');
        const [isExpanded, setIsExpanded] = useState(false);
        const [isLoading, setIsLoading] = useState(false);
        const { refreshPatientNotes } = usePatientDashboard();

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

        useEffect(() => {
            if (status === "authenticated" && session?.user) {
                console.log("Session user data:", session.user);
                setUserEmail(session.user.email || '');
                setAuthorID(session.user.id || '');
                setAuthorName(`${session.user.firstName || ''} ${session.user.lastName || ''}`.trim());
            }
        }, [session, status]);

        const fetchNotes = useCallback(async () => {
            if (!patientId || !isExpanded) {
                return;
            }
            setIsLoading(true);
            try {
                console.log(`Fetching notes for patient: ${patientId}`);
                const response = await fetch(`/api/patient/notes/${patientId}`);
                console.log('Fetch response status:', response.status);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error response: ${errorText}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const notes = await response.json();
                console.log('Fetched notes2:', notes);
                setNotesList(notes);
            } catch (error) {
                console.error('Failed to fetch notes2:', error);
            } finally {
                setIsLoading(false);
            }
        }, [patientId, isExpanded]);

        useEffect(() => {
            if (isExpanded) {
                fetchNotes();
            }
        }, [isExpanded, fetchNotes]);

        const createNote = useCallback(async () => {
            console.log('createNote called with patientId:', patientId);
            console.log('Current session data:', { userEmail, authorID, authorName });

            if (!patientId) {
                console.error('patientId is undefined');
                return;
            }

            if (!authorID) {
                console.error('authorID is undefined');
                return;
            }

            let noteData;
            switch (templateType) {
                case 'physician':
                    noteData = {
                        ...physicianNote,
                        noteType: 'physician',
                        email: userEmail,
                        authorName,
                        authorID,
                        createdAt: new Date().toISOString()
                    };
                    break;
                case 'procedure':
                    noteData = {
                        ...procedureNote,
                        noteType: 'procedure',
                        email: userEmail,
                        authorName,
                        authorID,
                        createdAt: new Date().toISOString()
                    };
                    break;
                case 'subjective':
                    noteData = {
                        ...subjectiveNote,
                        noteType: 'subjective',
                        email: userEmail,
                        authorName,
                        authorID,
                        createdAt: new Date().toISOString()
                    };
                    break;
            }

            console.log('Note data being sent:', noteData);

            try {
                const url = `/api/patient/notes/${patientId}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(noteData),
                });
                console.log('POST request sent to:', url);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error response: ${errorText}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const newNote = await response.json();
                console.log('New note created:', newNote);
                setNotesList(prevNotes => [...prevNotes, newNote.note]);
                resetForm();
                await refreshPatientNotes();
            } catch (error) {
                console.error('Failed to create note:', error);
            }
        }, [templateType, physicianNote, procedureNote, subjectiveNote, patientId, userEmail, authorName, authorID, refreshPatientNotes]);



        const resetForm = useCallback(() => {
            switch (templateType) {
                case 'physician':
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
                    break;
                case 'procedure':
                    setProcedureNote({
                        date: new Date().toISOString().split('T')[0],
                        time: new Date().toTimeString().split(' ')[0],
                        procedureName: '',
                        attendingPhysician: '',
                        Diagnosis: '',
                        notes: '',
                        Plan: ''
                    });
                    break;
                case 'subjective':
                    setSubjectiveNote({
                        date: new Date().toISOString().split('T')[0],
                        time: new Date().toTimeString().split(' ')[0],
                        subjective: '',
                        objective: '',
                        assessment: '',
                        plan: ''
                    });
                    break;
            }
        }, [templateType]);

        const deleteNote = useCallback(async (noteId: string) => {
            try {
                const response = await fetch(`/api/patient/notes/${patientId}?noteId=${noteId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                setNotesList((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
            } catch (error) {
                console.error('Failed to delete note:', error);
            }
        }, [patientId]);

        const setNoteField = useCallback((type: 'physician' | 'procedure' | 'subjective', name: string, value: string) => {
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
            setNotesList,
            templateType,
            setTemplateType,
            physicianNote,
            procedureNote,
            subjectiveNote,
            fetchNotes,
            createNote,
            setNoteField,
            isExpanded,
            isLoading,
            status,
        };
    }

    export default function Component() {
        // This is a placeholder component to satisfy the React Component code block requirements
        return null;
    }