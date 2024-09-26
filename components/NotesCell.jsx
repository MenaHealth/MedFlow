import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Button, TableCell } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';

const CellWrapper = styled('div')({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    });

    const EditButton = styled(IconButton)({
        marginLeft: '8px',
        position: 'absolute',
        right: '50%',
        transform: 'translateX(50%)',
    });

    const HiddenText = styled('span')({
        display: 'none',
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
    });

    const NotesCell = ({ notes, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [currentNotes, setCurrentNotes] = useState(notes);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        onUpdate(currentNotes);
        handleClose();
    };

    const handleChange = (event) => {
        setCurrentNotes(event.target.value);
    };

    return (
        <>
        <TableCell align="center">
            <CellWrapper
            onMouseEnter={(e) => {
                if (!notes) return;
                e.currentTarget.querySelector('.hidden-text').style.display = 'inline'
            }}
            onMouseLeave={(e) => {
                if (!notes) return;
                e.currentTarget.querySelector('.hidden-text').style.display = 'none'
            }}
            >
            { notes && <HiddenText className="hidden-text" onClick={handleClickOpen}>{notes}</HiddenText> }
            <EditButton onClick={handleClickOpen}>
                <EditIcon />
            </EditButton>
            </CellWrapper>
        </TableCell>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="notes"
                label="Notes"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={currentNotes}
                onChange={handleChange}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary" startIcon={<CloseIcon />}>
                Cancel
            </Button>
            <Button onClick={handleSave} color="primary" startIcon={<CheckIcon />}>
                Save
            </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default NotesCell;
