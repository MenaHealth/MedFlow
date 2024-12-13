// components/patientViewModels/image-gallery/FullScreenImageView.tsx
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from '@/components/ui/button';

interface FullScreenImageViewProps {
    photo: {
        url: string;
    };
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}

const FullScreenImageView: React.FC<FullScreenImageViewProps> = ({ photo, onClose, onPrev, onNext }) => {
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const minSwipeDistance = 50;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowLeft':
                    onPrev();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose, onPrev, onNext]);

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            onNext();
        } else if (isRightSwipe) {
            onPrev();
        }
    };

    const handleContainerClick = (e: React.MouseEvent) => {
        if (e.target === containerRef.current) {
            console.log("Clicked outside the photo. Closing full screen view.");
            onClose();
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onClick={handleContainerClick}
        >
            <Button
                className="absolute top-4 right-4 z-10"
                onClick={onClose}
                aria-label="Close full screen view"
                variant={'orangeOutline'}
            >
                <X size={24} />
            </Button>
            <Button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                onClick={onPrev}
                aria-label="Previous image"
                variant={'orangeOutline'}
            >
                <ChevronLeft size={36} />
            </Button>
            <Button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                onClick={onNext}
                aria-label="Next image"
                variant={'orangeOutline'}
            >
                <ChevronRight size={36} />
            </Button>

            <div className="relative">
                <TransformWrapper>
                    <TransformComponent>
                        <div
                            className="relative w-[80vw] h-[80vh]"
                            onClick={(e) => e.stopPropagation()} // Stops click inside image from closing view
                        >
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