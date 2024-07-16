// components/PhotoModal.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';  // Import Next.js Image component

const PhotoModal = ({ photos }) => {
    const [imageUrls, setImageUrls] = useState([]);

    useEffect(() => {
        if (!photos || photos.length === 0) {
            setImageUrls([]);
            return;
        }

        const urls = photos.map((photo, index) => {
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
            urls.forEach(URL.revokeObjectURL);
        };
    }, [photos]);

    return (
        <div>
            {imageUrls.map((url, index) => (
                <div key={index}>
                    {url ? (
                        <Image
                            src={url}
                            alt={`Photo ${index}`}
                            width={500} // Specify width
                            height={300} // Specify height
                            layout="responsive"
                        />
                    ) : (
                        <span>Error loading photo {index}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default PhotoModal;