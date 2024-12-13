// components/patientViewModels/image-gallery/FullScreenImageView.tsx
import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface FullScreenImageViewProps {
    photo: {
        url: string;
    };
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

const FullScreenImageView: React.FC<FullScreenImageViewProps> = ({ photo, onClose, onPrev, onNext }) => {
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <button
                className="absolute top-4 right-4 text-white"
                onClick={onClose}
                aria-label="Close full screen view"
            >
                <X size={24} />
            </button>
            <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
                onClick={onPrev}
            >
                <ChevronLeft size={36} />
            </button>
            <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                onClick={onNext}
            >
                <ChevronRight size={36} />
            </button>
            <div className="w-full h-full flex items-center justify-center">
                <TransformWrapper>
                    <TransformComponent>
                        <div className="relative w-[80vw] h-[80vh]">
                            <Image
                                src={photo.url}
                                alt="Full screen image"
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </div>
    );
};

export default FullScreenImageView;

