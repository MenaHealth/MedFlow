// app/lab-visits/[id]/page.tsx
'use client'

import React from 'react';
import { Typography, Box } from '@mui/material';
import { useParams } from 'next/navigation'; // For Next.js App Router

const LabVisits: React.FC = () => {
    const params = useParams();
    const patientId = params?.id; // Extract patientId from the URL params

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