// components/ui/InfiniteScroll.tsx

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

interface InfiniteScrollProps {
    children: React.ReactNode;
    hasMore: boolean;
    isLoading: boolean;
    next: () => void;
    dataLength: number;
    threshold?: number;
    className?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
                                                           children,
                                                           hasMore,
                                                           isLoading,
                                                           next,
                                                           threshold = 300,
                                                           className = '',
                                                       }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [showBounceAnimation, setShowBounceAnimation] = useState(false);
    const bounceControls = useAnimation();

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop - clientHeight < threshold && hasMore && !isLoading) {
            next();
        }

        // Show bounce animation when reaching the bottom
        if (scrollHeight - scrollTop - clientHeight < 1) {
            setShowBounceAnimation(true);
            bounceControls.start({
                y: [0, -20, 0],
                transition: { duration: 0.5, ease: "easeInOut" }
            });
            setTimeout(() => setShowBounceAnimation(false), 500);
        }
    }, [hasMore, isLoading, next, threshold, bounceControls]);

    useEffect(() => {
        const currentContainer = containerRef.current;
        if (currentContainer) {
            currentContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentContainer) {
                currentContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    return (
        <div className="relative flex-grow overflow-hidden">
            <div
                ref={containerRef}
                className={`h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ${className}`}
            >
                {children}
                {isLoading && (
                    <div className="flex justify-center items-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                    </div>
                )}
                <motion.div
                    animate={bounceControls}
                    className={`h-16 ${showBounceAnimation ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-100/50 to-transparent pointer-events-none" />
        </div>
    );
};

export default InfiniteScroll;

