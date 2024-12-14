// components/PhotoModal.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Photo, { IPhoto } from '../models/photo'; // Import both the model and the interface

interface PhotoModalProps {
    photos: IPhoto[]; // Use IPhoto instead of Photo
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photos }) => {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        if (!photos || photos.length === 0) {
            setImageUrls([]);
            return;
        }

        const urls = photos.map((photo, index) => {
            try {
                const blob = new Blob([photo.buffer], { type: photo.contentType });
                return URL.createObjectURL(blob);
            } catch (error) {
                console.error(`Error generating URL ${index}:`, error);
                return '';
            }
        });

        setImageUrls(urls);

        // Clean up blob URLs when component unmounts or URLs change
        return () => {
            urls.forEach(URL.revokeObjectURL);
        };
    }, [photos]);

    return (
        <div>
            {photos.map((photo, index) => (
                <div key={photo._id.toString()}>
                    {imageUrls[index] ? (
                        <>
                            <Image
                                src={imageUrls[index]}
                                alt={`Photo ${index}`}
                                width={500}
                                height={300}
                                layout="responsive"
                            />
                            <p>Uploaded on: {new Date(photo.date).toLocaleString()}</p>
                            <p>By: {photo.username}</p>
                        </>
                    ) : (
                        <span>Error loading photo {index}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PhotoModal;