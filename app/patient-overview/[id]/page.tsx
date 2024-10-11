"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Grid, Button, Box } from '@mui/material';
import { useTheme, Theme } from '@mui/material/styles';
import MedicalInformation from '@mui/icons-material/MedicalInformation';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Notes from '@mui/icons-material/Notes';
import Collections from '@mui/icons-material/Collections';
import LocalPharmacy from '@mui/icons-material/LocalPharmacy';
import { useParams } from 'next/navigation';
import PatientSubmenu from '@/components/PatientSubmenu';
import PatientSubmenuHeader from '@/components/PatientSubmenuHeader';
import LabVisits from './../../lab-visits/[id]/page';

const PatientOverview: React.FC = () => {
    const theme = useTheme<Theme>();
    const [isClient, setIsClient] = useState(false);
    const { id } = useParams() as { id: string | undefined };
    const router = useRouter();
    const [activeContent, setActiveContent] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleNavigation = (path: string) => {
        const contentType = path.split('/')[1];
        setActiveContent(contentType);
    };

    const renderContent = () => {
        switch (activeContent) {
            case 'lab-visits':
                return <LabVisits patientId={id} />;
            // Add other cases for different content types
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {id && <PatientSubmenuHeader patientId={id} />}
            <PatientSubmenu />
            {activeContent ? (
                renderContent()
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', sm: 'column' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...(isClient && {
                                    '&:hover svg': {
                                        color: theme.palette.primary.main,
                                    },
                                }),
                            }}
                        >
                            <MedicalInformation sx={{ fontSize: 40, mb: { sm: 2 }, mr: { xs: 2, sm: 0 } }} />
                            <Button
                                onClick={() => handleNavigation(id ? `/fajr/patient/${id}` : '#')}
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ p: 2 }}
                                disabled={!id}
                            >
                                Patient Info
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', sm: 'column' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...(isClient && {
                                    '&:hover svg': {
                                        color: theme.palette.success.main,
                                    },
                                }),
                            }}
                        >
                            <CalendarMonth sx={{ fontSize: 40, mb: { sm: 2 }, mr: { xs: 2, sm: 0 } }} />
                            <Button
                                onClick={() => handleNavigation(`/lab-visits/${id}`)}
                                variant="contained"
                                color="success"
                                fullWidth
                                sx={{ p: 2 }}
                            >
                                Lab Visits
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', sm: 'column' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...(isClient && {
                                    '&:hover svg': {
                                        color: theme.palette.warning.main,
                                    },
                                }),
                            }}
                        >
                            <Notes sx={{ fontSize: 40, mb: { sm: 2 }, mr: { xs: 2, sm: 0 } }} />
                            <Button
                                onClick={() => handleNavigation(`/notes/${id}`)}
                                variant="contained"
                                color="warning"
                                fullWidth
                                sx={{ p: 2 }}
                            >
                                Notes
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', sm: 'column' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...(isClient && {
                                    '&:hover svg': {
                                        color: theme.palette.error.main,
                                    },
                                }),
                            }}
                        >
                            <Collections sx={{ fontSize: 40, mb: { sm: 2 }, mr: { xs: 2, sm: 0 } }} />
                            <Button
                                onClick={() => handleNavigation(`/image-gallery/${id}`)}
                                variant="contained"
                                color="error"
                                fullWidth
                                sx={{ p: 2 }}
                            >
                                Image Gallery
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', sm: 'column' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                ...(isClient && {
                                    '&:hover svg': {
                                        color: theme.palette.info.main,
                                    },
                                }),
                            }}
                        >
                            <LocalPharmacy sx={{ fontSize: 40, mb: { sm: 2 }, mr: { xs: 2, sm: 0 } }} />
                            <Button
                                onClick={() => handleNavigation(`/rx/${id}`)}
                                variant="contained"
                                fullWidth
                                sx={{
                                    p: 2,
                                    backgroundColor: '#BF40BF',
                                    '&:hover': {
                                        backgroundColor: '#702963',
                                    },
                                    color: 'white'
                                }}
                            >
                                Medications
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default PatientOverview;