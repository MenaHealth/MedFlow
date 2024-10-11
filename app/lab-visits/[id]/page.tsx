import React from 'react';
import { Typography, Box } from '@mui/material';

interface LabVisitsProps {
    patientId: string | undefined;
}

const LabVisits: React.FC<LabVisitsProps> = ({ patientId }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Lab Visits for Patient {patientId}
            </Typography>
            <Typography variant="body1">
                This is where you would display the lab visits for the patient.
            </Typography>
        </Box>
    );
};

export default LabVisits;