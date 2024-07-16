import { useEffect, useState } from 'react';

const PhotoModal = ({ photos }: { photos: any }) => {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        if (!photos || photos.length === 0) {
        setImageUrls([]);
        return;
        }

        const urls = photos.map((photo: { buffer: BlobPart; }, index: any) => {
        try {
            const blob = new Blob([photo.buffer], { type: 'image/webp' });
            const url = URL.createObjectURL(blob);
            return url;
        } catch (error) {
            console.error(`Error generating URL ${index}:`, error);
            return '';
        }
        });

        setImageUrls(urls);

        // Clean up blob URLs when component unmounts or URLs change
        return () => {
        urls.forEach((url: string) => URL.revokeObjectURL(url));
        };
    }, [photos]);

    return (
        <div>
        {imageUrls.map((url, index) => (
            <div key={index}>
            {url ? (
                <img src={url} alt={`Photo ${index}`} />
            ) : (
                <span>Error loading photo {index}</span>
            )}
            </div>
        ))}
        </div>
    );
};

export default PhotoModal;
