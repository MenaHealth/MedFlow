"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MedicalInformation from '@mui/icons-material/MedicalInformation';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Notes from '@mui/icons-material/Notes';
import Collections from '@mui/icons-material/Collections';

const Home = () => {
    const theme = useTheme();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {/*<Typography variant="h2" component="h1" gutterBottom>*/}
            {/*    Home Screen*/}
            {/*</Typography>*/}
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
                            href="/patient-info/dashboard"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ p: 2 }}
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
                            href="/lab-visits"
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
                            href="/notes"
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
                            href="/image-gallery"
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

export default Home;