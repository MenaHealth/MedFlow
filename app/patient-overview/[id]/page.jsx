"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MedicalInformation from '@mui/icons-material/MedicalInformation';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Notes from '@mui/icons-material/Notes';
import Collections from '@mui/icons-material/Collections';
import { useParams } from 'next/navigation';

const PatientOverview = () => {
    const theme = useTheme();
    const [isClient, setIsClient] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setIsClient(true);
    }, []);

    // useEffect(() => {
    //     if (id !== '') {
    //         // fetch the patient-info data from the API
    //         fetch(`/api/patient/${id}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             // update the form with the data
    //             data.surgeryDate = new Date(data.surgeryDate);
    //             data.medx = data.medx.map((med) => {
    //                 return {
    //                     medName: med.medName,
    //                     medDosage: med.medDosage,
    //                     medFrequency: med.medFrequency,
    //                 };
    //             });
    //             // age
    //             data.age = parseInt(data.age);
    //             setPatientData(data);
    //             console.log(data)
    //         })
    //         .catch(error => {
    //             // show an alert with the error message
    //             alert('Error: ' + error.message);
    //         });
    //     }}, [id]);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
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
                            component={Link}
                            href={id ? `/fajr/patient/${id}` : '#'}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ p: 2 }}
                            disabled={!id} // Disable button if id is not set
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
                            component={Link}
                            href={`/lab-visits/${id}`}
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
                            component={Link}
                            href={`/notes/${id}`}
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
                            component={Link}
                            href={`/image-gallery/${id}`}
                            variant="contained"
                            color="error"
                            fullWidth
                            sx={{ p: 2 }}
                        >
                            Image Gallery
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PatientOverview;
