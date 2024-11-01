// components/ui/InfiniteScroll.tsx

import React, { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
    children: React.ReactNode;
    hasMore: boolean;
    isLoading: boolean;
    next: () => void;
    threshold?: number; // Optional threshold for triggering the next function
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
                                                           children,
                                                           hasMore,
                                                           isLoading,
                                                           next,
                                                           threshold = 300
                                                       }) => {
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !isLoading) {
                next();
            }
        },
        [hasMore, isLoading, next]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            rootMargin: `${threshold}px`,
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [handleObserver, threshold]);

    return (
        <div>
            {children}
            <div ref={loaderRef}>
                {isLoading && (
                    <div className="flex justify-center my-4">
                        <svg
                            className="animate-spin h-8 w-8 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InfiniteScroll;