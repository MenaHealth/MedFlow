"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Box, Grid, IconButton, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { generateEncryptionKey, encryptPhoto, calculateFileHash, convertToWebP, decryptPhoto } from '@/utils/encryptPhoto';
import Image from 'next/image';

const DEFAULT_FORM_VALUES = {
    patientId: "",
    age: 0,
    diagnosis: "",
    icd10: "",
    surgeryDate: new Date(),
    occupation: "",
    laterality: "Bilateral",
    priority: "Low",
    hospital: "PMC",
    baselineAmbu: "Independent",
    medx: [],
    pmhx: [],
    pshx: [],
    smokeCount: "",
    drinkCount: "",
    otherDrugs: "",
    allergies: "",
    notes: "",
};

const ImageGallery = () => {
    const { id } = useParams();
    const [patientFiles, setPatientFiles] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id !== '') {
            fetch(`/api/patient/${id}`)
                .then(response => response.json())
                .then(data => {
                    setPatientFiles(data.files);
                })
                .catch(error => {
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
                            if (patientFiles[i].encryptionKey) {
                                const arrayBuffer = await response.arrayBuffer();
                                const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))); // Convert to Base64 string
                                const decryptedBlob = await decryptPhoto(encryptedBase64, patientFiles[i].encryptionKey); // Assuming each file has an encryptionKey
                                const url = URL.createObjectURL(decryptedBlob);
                                const data = { url };
                                tempPhotos.push(data);
                            } else {
                                const data = { url: response.url };
                                tempPhotos.push(data);
                            }
                        } else {
                            console.error('Failed to fetch photos:', response.statusText);
                        }
                    }
                    setPhotos(tempPhotos);
                }
                setIsLoading(false);
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

    const handleFileChange = (event) => {
        const filesArray = Array.from(event.target.files);
        setSelectedFiles(filesArray);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let encryptedImages = [];
        try {
            let convertedFiles = await Promise.all(selectedFiles.map(file => convertToWebP(file))); 
            const fileHashes = await Promise.all(convertedFiles.map(file => calculateFileHash(file)));

            const formData = new FormData();
            convertedFiles.forEach((convertedFile, index) => {
                formData.append('file', new Blob([convertedFile]), `${fileHashes[index]}.webp`);
            });

            const response = await fetch('/api/patient/photos', {
                method: 'POST',
                body: formData,
            });
            encryptedImages = convertedFiles.map((file, index) => ({ hash: fileHashes[index] }));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.error('Error uploading encrypted files:', err);
        }

        const currentPatient = await fetch(`/api/patient/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const currentPhotos = (await currentPatient.json()).files;
        await fetch(`/api/patient/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ ...DEFAULT_FORM_VALUES, patientId: id, files: currentPhotos.length > 0 ? [...currentPhotos, ...encryptedImages] : encryptedImages }),
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (response.ok) {
                setPatientFiles((prev) => [...prev, ...encryptedImages]);
                // Reset the file input and selected files
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setSelectedFiles([]);
            } else {
            // show an alert with the error message
            alert('Error: ' + response.statusText);
            }
        })
        .catch(error => {
            // show an alert with the error message
            alert('Error: ' + error.message);
        });
    };

    if (isLoading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <>
            <h1 className="text-2xl font-bold mb-4" style={{ transform: 'translateX(5rem)'}}>Image Gallery</h1>
            <div className="container mx-auto p-4 flex flex-row justify-between">
                <div style={{ minWidth: '75%'}}>
                    {photos.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', mb: 4, width: '100%', maxWidth: '600px' }}>
                                <IconButton onClick={handlePrevClick} sx={{ position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)' }}>
                                    <ChevronLeftIcon />
                                </IconButton>
                                <image
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
                                                <Image
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
                <div>
                    <h1 className="text-2xl font-bold mb-4 mt-4">Upload Files</h1>
                    <form onSubmit={handleFormSubmit} className='flex flex-col'>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ width: '110px', marginTop: '5px' }}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ImageGallery;
