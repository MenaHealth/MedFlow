import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { decryptPhoto } from '@/utils/encryptPhoto';

interface PatientFile {
    hash: string;
    encryptionKey?: string;
}

interface Photo {
    url: string;
}

export interface ImageGalleryViewModelProps {
    patientId: string;
}

export const useImageGalleryViewModel = ({ patientId }: ImageGalleryViewModelProps) => {
    const [patientFiles, setPatientFiles] = useState<PatientFile[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDoctor, setIsDoctor] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        if (patientId !== '') {
            fetch(`/api/patient/${patientId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setPatientFiles(data?.patient?.files || []);
                })
                .catch(error => {
                    console.error('Error fetching patient data:', error);
                    alert('Error: ' + error.message);
                });
        }
    }, [patientId]);

    useEffect(() => {
        const fetchPhotos = async () => {
            setIsLoading(true);
            try {
                if (patientFiles.length > 0) {
                    const tempPhotos: Photo[] = [];
                    for (const file of patientFiles) {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                        const response = await fetch(`${apiUrl}/api/patient/photos/${file.hash}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        if (file.encryptionKey) {
                            const arrayBuffer = await response.arrayBuffer();
                            const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
                            const decryptedBlob = await decryptPhoto(encryptedBase64, file.encryptionKey);
                            const url = URL.createObjectURL(decryptedBlob);
                            tempPhotos.push({ url });
                        } else {
                            tempPhotos.push({ url: response.url });
                        }
                    }
                    setPhotos(tempPhotos);
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPhotos();
    }, [patientFiles]);

    useEffect(() => {
        if (session?.user?.accountType === 'Doctor') {
            setIsDoctor(true);
        }
    }, [session]);

    const handleThumbnailClick = (index: number) => {
        setCurrentPhotoIndex(index);
    };

    const handlePrevClick = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
        setCurrentPhotoIndex(prevIndex => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filesArray = Array.from(event.target.files || []);
        setSelectedFiles(filesArray);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Implementation of file upload logic
        // ...
    };

    return {
        photos,
        currentPhotoIndex,
        isLoading,
        isDoctor,
        selectedFiles,
        handleThumbnailClick,
        handlePrevClick,
        handleNextClick,
        handleFileChange,
        handleFormSubmit,
    };
};

