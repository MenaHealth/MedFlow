import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Button,
    TableCell,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import { useForm, FormProvider } from 'react-hook-form';
import { TextFormField } from '../form/TextFormField';

const CellWrapper = styled('div')({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const EditButton = styled(IconButton)({
    marginLeft: '8px',
    height: '24px',
    width: '24px',
});

const DescriptionButton = styled(IconButton)({
    marginLeft: '8px',
    height: '24px',
    width: '24px',
});

const HiddenTextWrapper = styled('div')(({ isVisible }) => ({
    display: isVisible ? 'block' : 'none',
    position: 'absolute',
    backgroundColor: 'white',
    border: '1px solid #ccc',
    padding: '8px',
    borderRadius: '4px',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
    zIndex: 10,
    whiteSpace: 'pre-wrap',
    maxWidth: '300px',
    minWidth: '100px',
    maxHeight: '200px',
    overflowY: 'auto',
    fontSize: '12px',
    color: 'black',
    cursor: 'default',
}));

const NotesCell = ({ notes, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const methods = useForm({
        defaultValues: { notes },
    });

    useEffect(() => {
        methods.reset({ notes }); // Sync when `notes` changes
    }, [notes, methods]);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleSave = (data) => {
        onUpdate(data.notes);
        handleClose();
    };

    const toggleNotesVisibility = () => setShowNotes((prev) => !prev);

    const isDesktop = window.matchMedia('(hover: hover)').matches;

    return (
        <>
            <TableCell align="center">
                <CellWrapper>
                    {notes && (
                        <DescriptionButton
                            onClick={toggleNotesVisibility}
                            onMouseEnter={() => isDesktop && setShowNotes(true)}
                            onMouseLeave={() => isDesktop && setShowNotes(false)}
                        >
                            <DescriptionIcon />
                            <HiddenTextWrapper isVisible={showNotes}>{notes}</HiddenTextWrapper>
                        </DescriptionButton>
                    )}
                    <EditButton onClick={handleClickOpen}>
                        <EditIcon />
                    </EditButton>
                </CellWrapper>
            </TableCell>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Notes</DialogTitle>
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(handleSave)}>
                        <DialogContent>
                            <TextFormField
                                fieldName="notes"
                                fieldLabel="Notes"
                                multiline
                                rows={4}
                                value={methods.watch('notes')}
                                onChange={(e) => methods.setValue('notes', e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary" startIcon={<CloseIcon />}>
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" startIcon={<CheckIcon />}>
                                Save
                            </Button>
                        </DialogActions>
                    </form>
                </FormProvider>
            </Dialog>
        </>
    );
};

export default NotesCell;