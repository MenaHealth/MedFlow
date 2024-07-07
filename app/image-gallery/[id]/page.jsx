"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Grid, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ImageGallery = () => {
    const { id } = useParams();
    const [patientFiles, setPatientFiles] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        if (id !== '') {
            // Fetch the patient-info data from the API
            fetch(`/api/patient/${id}`)
                .then(response => response.json())
                .then(data => {
                    setPatientFiles(data.files);
                })
                .catch(error => {
                    // Show an alert with the error message
                    alert('Error: ' + error.message);
                });
        }
    }, [id]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                if (patientFiles.length > 0) {
                    const tempPhotos = [];
                    for (let i = 0; i < patientFiles.length; i++) {
                        const response = await fetch(`/api/patient/photos/${patientFiles[i].hash}`);
                        if (response.ok) {
                            const data = { url: response.url }; // Example structure
                            tempPhotos.push(data); // Adjust data structure as per your actual response
                        } else {
                            console.error('Failed to fetch photos:', response.statusText);
                        }
                    }
                    setPhotos(tempPhotos);
                }
                setIsLoading(false); // Mark loading as complete
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        fetchPhotos();
    }, [patientFiles]);

    const handleThumbnailClick = (index) => {
        setCurrentPhotoIndex(index);
    };

    const handlePrevClick = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    };

    // Display message if there are no photos
    if (isLoading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
            {photos.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', mb: 4, width: '100%', maxWidth: '600px' }}>
                        <IconButton onClick={handlePrevClick} sx={{ position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)' }}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <img
                            src={photos[currentPhotoIndex].url}
                            alt={`Photo ${currentPhotoIndex + 1}`}
                            className="max-w-full h-auto mx-auto"
                            style={{ maxWidth: '100%', maxHeight: '600px', display: 'block' }}
                        />
                        <IconButton onClick={handleNextClick} sx={{ position: 'absolute', right: '-40px', top: '50%', transform: 'translateY(-50%)' }}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                    {photos.length > 1 && (
                        <Grid container spacing={2} justifyContent="center">
                            {photos.map((photo, index) => (
                                <Grid item key={index}>
                                    <IconButton onClick={() => handleThumbnailClick(index)}>
                                        <img
                                            src={photo.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    </IconButton>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            ) : (
                <p className="text-center text-gray-500 mt-8">This user has no associated files.</p>
            )}
        </div>
    );
};

export default ImageGallery;
