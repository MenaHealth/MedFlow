// components/patientViewModels/image-gallery/ImageGalleryViewModel.tsx
import { useState, useEffect } from 'react';
import { usePatientDashboard } from '../PatientViewModelContext'; // Make sure this is the correct import
import { decryptPhoto } from '@/utils/encryptPhoto';

interface Photo {
    url: string;
}

export interface ImageGalleryViewModelProps {
    patientId: string;
}

export const useImageGalleryViewModel = ({ patientId }: ImageGalleryViewModelProps) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isDoctor, setIsDoctor] = useState(false);

    const { patientInfo } = usePatientDashboard(); // get patientInfo which contains telegramChatId
    const telegramChatId = patientInfo?.telegramChatId;

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!telegramChatId) {
                return; // no telegram ID, no files
            }
            setIsLoading(true);
            try {
                const folder = process.env.NODE_ENV === "development" ? "dev" : "prod";
                const folderPath = `${folder}/images/${telegramChatId}`;

                // 1. Fetch list of files from DO
                const listResponse = await fetch(`/api/telegram-bot/list-media?folderPath=${encodeURIComponent(folderPath)}`);
                if (!listResponse.ok) {
                    throw new Error(`Error listing media: ${listResponse.statusText}`);
                }
                const { files } = await listResponse.json();

                const tempPhotos: Photo[] = [];
                for (const fileKey of files) {
                    // 2. Get signed URL for each file
                    const getMediaUrl = `/api/telegram-bot/get-media?filePath=${encodeURIComponent(fileKey)}`;
                    const mediaResponse = await fetch(getMediaUrl);
                    if (!mediaResponse.ok) {
                        console.error(`Error getting media for ${fileKey}: ${mediaResponse.statusText}`);
                        continue;
                    }
                    const mediaData = await mediaResponse.json();
                    if (mediaData.signedUrl) {
                        tempPhotos.push({ url: mediaData.signedUrl });
                    }
                }

                setPhotos(tempPhotos);
            } catch (error) {
                console.error('Error fetching photos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPhotos();
    }, [telegramChatId]);

    useEffect(() => {
        // Check if user is a doctor
        // Assuming you have session or some logic here
        // setIsDoctor(true/false);
    }, []);

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
        // Upload logic, similar to your existing code but pointing to DO
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