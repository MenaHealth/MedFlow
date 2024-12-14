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
    height: '24px',
    width: '24px',
});

const DescriptionButton = styled(IconButton)({
    marginLeft: '8px',
    height: '24px',
    width: '24px',
});

const HiddenTextWrapper = styled('div')(({ isVisible }) => ({
    display: isVisible ? 'block' : 'none',  // Only render if visible
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
    cursor: 'default'
}));

const NotesCell = ({ notes, onUpdate }) => {
    const [open, setOpen] = useState(false);
    const [showNotes, setShowNotes] = useState(false); // State to control hidden text visibility
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

    const toggleNotesVisibility = () => {
        setShowNotes((prev) => !prev); // Toggle the visibility of the hidden text
    };

    const isDesktop = window.matchMedia('(hover: hover)').matches; // Detect if hover is available

    return (
        <>
            <TableCell align="center">
                <CellWrapper>
                    {/* Show the DescriptionIcon only if there are notes2 */}
                    {notes && (
                        <DescriptionButton
                            onClick={toggleNotesVisibility}
                            onMouseEnter={() => {
                                if (isDesktop) {
                                    setShowNotes(true); // Only show on hover for desktops
                                }
                            }}
                            onMouseLeave={() => {
                                if (isDesktop) {
                                    setShowNotes(false); // Hide on hover leave for desktops
                                }
                            }}
                        >
                            <DescriptionIcon />
                            {/* Conditionally render the hidden text */}
                            <HiddenTextWrapper isVisible={showNotes}>
                                {notes}
                            </HiddenTextWrapper>
                        </DescriptionButton>
                    )}

                    {/* Edit button to open the modal */}
                    <EditButton onClick={handleClickOpen} aria-hidden={showNotes}>
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
