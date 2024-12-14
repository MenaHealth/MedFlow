// components/patientViewModels/image-gallery/ImageGalleryView.tsx
import React, { useRef, useState } from 'react';
import { Box, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useImageGalleryViewModel, ImageGalleryViewModelProps } from './ImageGalleryViewModel';
import FullScreenImageView from './FullScreenImageView';

const ImageGalleryView: React.FC<ImageGalleryViewModelProps> = ({ patientId }) => {
    const {
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
    } = useImageGalleryViewModel({ patientId });

    const carouselRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [clickZoomIn, setClickZoomIn] = React.useState(false);
    const [clickZoomOut, setClickZoomOut] = React.useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

    return (
        <div className="bg-grey-100">
            <div className="w-full max-w-4xl mx-auto pb-16 text-darkBlue">
                <div className="border border-gray-300 p-8 my-2 bg-grey-100 text-darkBlue shadow rounded-lg">
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
                                                                src={photos[currentPhotoIndex].url}
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
                                                            <button
                                                                className="border-none bg-transparent text-white"
                                                                onClick={toggleFullScreen}
                                                            >
                                                                <Maximize2 />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </TransformWrapper>
                                        </Box>
                                        {photos.length > 1 && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                <IconButton onClick={handlePrevClick} sx={{ flex: '0 0 auto' }}>
                                                    <ChevronLeft />
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
                                                                src={photo.url}
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
                                                    <ChevronRight />
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

                {isDoctor && (
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
                )}
            </div>
            {isFullScreen && (
                <FullScreenImageView
                    photo={photos[currentPhotoIndex]}
                    onClose={toggleFullScreen}
                    onPrev={handlePrevClick}
                    onNext={handleNextClick}
                />
            )}
        </div>
    );
};

export default ImageGalleryView;

