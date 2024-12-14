// components/patientViewModels/image-gallery/ImageGallery.tsx
import React from 'react';
import { useParams } from 'next/navigation';
import ImageGalleryView from './ImageGalleryView';

const ImageGallery: React.FC = () => {
    const { id } = useParams();

    if (!id || typeof id !== 'string') {
        return <div>Invalid patient ID</div>;
    }

    return <ImageGalleryView patientId={id} />;
};

export default ImageGallery;

