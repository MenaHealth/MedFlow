// app/image-gallery/[id]/page.jsx
"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Box, Grid, IconButton, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ClipLoader } from 'react-spinners'; // Import the loading spinner
import { generateEncryptionKey, encryptPhoto, calculateFileHash, convertToWebP, decryptPhoto } from '@/utils/encryptPhoto';
import Image from 'next/image';
import PatientSubmenu from "../../../components/PatientSubmenu";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FiMinus, FiPlus } from 'react-icons/fi';

const DEFAULT_FORM_VALUES = {
    patientName:"",
    patientId: "",
    age: 0,
    chiefComplaint: "",
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
    const [clickZoomIn, setClickZoomIn] = useState(false);
    const [clickZoomOut, setClickZoomOut] = useState(false);
    const carouselRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id !== '') {
            fetch(`/api/patient/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched patient data:', data);
                    setPatientFiles(data.files);
                })
                .catch(error => {
                    console.error('Error fetching patient data:', error);
                    alert('Error: ' + error.message);
                });
        }
    }, [id]);

    useEffect(() => {
        if (carouselRef.current) {
            const selectedThumbnail = carouselRef.current.querySelector(`[data-index="${currentPhotoIndex}"]`);
            if (selectedThumbnail) {
                carouselRef.current.scrollTo({
                    left: selectedThumbnail.offsetLeft - (carouselRef.current.clientWidth / 2) + (selectedThumbnail.clientWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [currentPhotoIndex]);

    useEffect(() => {
        const fetchPhotos = async () => {
            setIsLoading(true); // Set loading to true at the start of the fetch
            try {
                if (patientFiles.length > 0) {
                    const tempPhotos = [];
                    for (let i = 0; i < patientFiles.length; i++) {
                        const response = await fetch(`/api/patient/photos/${patientFiles[i].hash}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        if (patientFiles[i].encryptionKey) {
                            const arrayBuffer = await response.arrayBuffer();
                            const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
                            const decryptedBlob = await decryptPhoto(encryptedBase64, patientFiles[i].encryptionKey);
                            const url = URL.createObjectURL(decryptedBlob);
                            const data = { url };
                            tempPhotos.push(data);
                        } else {
                            const data = { url: response.url };
                            tempPhotos.push(data);
                        }
                    }
                    console.log('Fetched photos:', tempPhotos);
                    setPhotos(tempPhotos);
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching photos
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

            console.log('Uploading files:', formData);

            const response = await fetch('/api/patient/photos', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Upload result:', result);

            encryptedImages = convertedFiles.map((file, index) => ({ hash: fileHashes[index] }));
        } catch (err) {
            console.error('Error uploading encrypted files:', err);
        }

        try {
            const currentPatient = await fetch(`/api/patient/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!currentPatient.ok) {
                const errorText = await currentPatient.text();
                throw new Error(`HTTP error! status: ${currentPatient.status} - ${errorText}`);
            }

            const currentPhotos = (await currentPatient.json()).files;
            const patchResponse = await fetch(`/api/patient/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ ...DEFAULT_FORM_VALUES, patientId: id, files: currentPhotos.length > 0 ? [...currentPhotos, ...encryptedImages] : encryptedImages }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!patchResponse.ok) {
                const errorText = await patchResponse.text();
                throw new Error(`HTTP error! status: ${patchResponse.status} - ${errorText}`);
            }

            const updatedPatient = await patchResponse.json();
            console.log('Updated patient:', updatedPatient);

            setPatientFiles((prev) => [...prev, ...encryptedImages]);

            // Reset the file input and selected files
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setSelectedFiles([]);
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Error: ' + error.message);
        }
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4" style={{ transform: 'translateX(5rem)' }}>Image Gallery</h1>
            <div className="container mx-auto p-4 flex flex-row justify-between">
                <div style={{ minWidth: '75%', display: 'flex', justifyContent: 'center' }}>
                <PatientSubmenu />
                    <div style={{ minWidth: '75%' }}>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
                            </div>
                        ) : (
                            <>
                                {photos.length > 0 ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Box sx={{ position: 'relative', mb: 4, width: '100%', maxWidth: '600px' }}>
                                        <TransformWrapper
                                            initialScale={1}
                                            alignmentAnimation={{ sizeX: 0, sizeY: 0 }}
                                        >
                                            {({ zoomIn, zoomOut }) => (
                                                <div className="relative">
                                                    <TransformComponent>
                                                        <Image
                                                            src={photos[currentPhotoIndex].url ?? ''}
                                                            alt={`Photo ${currentPhotoIndex + 1}`}
                                                            className="max-w-full h-auto mx-auto cursor-pointer"
                                                            width={400}
                                                            height={400}
                                                        />
                                                    </TransformComponent>
                                                    <div className={`absolute bottom-3 left-5 flex gap-5 text-lg rounded-md border border-white bg-gray-800 p-2 ${clickZoomIn ? 'animate-pop' : ''} ${clickZoomOut ? 'animate-pop' : ''}`}>
                                                        <button
                                                            className="border-none bg-transparent text-white"
                                                            onClick={() => {
                                                                setClickZoomOut(true);
                                                                zoomOut();
                                                            }}
                                                            onAnimationEnd={() => setClickZoomOut(false)}
                                                        >
                                                            <FiMinus />
                                                        </button>
                                                        <button
                                                            className="border-none bg-transparent text-white"
                                                            onClick={() => {
                                                                setClickZoomIn(true);
                                                                zoomIn();
                                                            }}
                                                            onAnimationEnd={() => setClickZoomIn(false)}
                                                        >
                                                            <FiPlus />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </TransformWrapper>
                                    </Box>
                                    {photos.length > 1 && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                            <IconButton onClick={handlePrevClick} sx={{ flex: '0 0 auto' }}>
                                                <ChevronLeftIcon />
                                            </IconButton>
                                            <Box ref={carouselRef} sx={{ display: 'flex', overflowX: 'auto', maxWidth: '300px', flex: '1 1 auto' }}>
                                                {photos.map((photo, index) => (
                                                    <IconButton
                                                        key={index}
                                                        data-index={index}
                                                        onClick={() => handleThumbnailClick(index)}
                                                        sx={{ minWidth: '75px', minHeight: '75px', padding: '10px' }}
                                                    >
                                                        <Image
                                                            src={photo.url ?? ''}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="object-cover rounded"
                                                            width={75}
                                                            height={75}
                                                            style={{
                                                                border: currentPhotoIndex === index ? '2px solid gray' : 'none',
                                                            }}
                                                        />
                                                    </IconButton>
                                                ))}
                                            </Box>
                                            <IconButton onClick={handleNextClick} sx={{ flex: '0 0 auto' }}>
                                                <ChevronRightIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                                ) : (
                                    <p className="text-center text-gray-500 mt-8">This user has no associated files.</p>
                                )}
                            </>
                        )}
                    </div>
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