import React, { useRef, useEffect } from 'react';

interface AutoExpandingInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    minRows?: number;
    maxRows?: number;
}

export const AutoExpandingInput = React.forwardRef<HTMLTextAreaElement, AutoExpandingInputProps>(
    ({ minRows = 1, maxRows = 5, ...props }, forwardedRef) => {
        const textareaRef = useRef<HTMLTextAreaElement | null>(null);

        useEffect(() => {
            const textarea = textareaRef.current;
            if (textarea) {
                const adjustHeight = () => {
                    textarea.style.height = 'auto';
                    const newHeight = Math.min(
                        Math.max(textarea.scrollHeight, minRows * 24),
                        maxRows * 24
                    );
                    textarea.style.height = `${newHeight}px`;
                };

                textarea.addEventListener('input', adjustHeight);
                adjustHeight();

                return () => textarea.removeEventListener('input', adjustHeight);
            }
        }, [minRows, maxRows]);

        return (
            <textarea
                ref={(node) => {
                    textareaRef.current = node;
                    if (typeof forwardedRef === 'function') {
                        forwardedRef(node);
                    } else if (forwardedRef) {
                        forwardedRef.current = node;
                    }
                }}
                {...props}
                className="flex w-full rounded-md border border-black bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden"
            />
        );
    }
);

AutoExpandingInput.displayName = 'AutoExpandingInput';

