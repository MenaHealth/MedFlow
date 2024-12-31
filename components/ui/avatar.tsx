import * as React from "react";
import Image from "next/image";
import { cn } from "../../utils/classNames";

const Avatar = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & {
    src?: string;
    alt?: string;
    initials?: string;
}
>(({ className, src, alt, initials, ...props }, ref) => {
    return (
        <span
            ref={ref}
            className={cn(
                "inline-block h-24 w-24 overflow-hidden rounded-full bg-gray-100",
                className
            )}
            {...props}
        >
            {src ? (
                <AvatarImage src={src} alt={alt || "Avatar"} />
            ) : (
                <AvatarFallback>{initials}</AvatarFallback>
            )}
        </span>
    );
});
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
    src?: string;
    alt?: string;
}
>(({ className, src = "", alt = "Avatar", ...props }, ref) => {
    if (!src) {
        console.warn("AvatarImage requires a valid src");
    }
    return (
        <div
            ref={ref}
            className={cn("relative h-full w-full", className)} // Ensures it matches the parent size
            {...props}
        >
            <Image
                src={src}
                alt={alt || "Avatar"}
                layout="fill" // Ensures the image covers the parent container
                objectFit="cover" // Keeps the aspect ratio intact
                className="rounded-full" // Ensures the circular shape
            />
        </div>
    );
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
    return (
        <span
            ref={ref}
            className={cn(
                "flex h-full w-full items-center justify-center bg-gray-300 text-gray-600 font-medium text-sm rounded-full",
                className
            )}
            {...props}
        >
            {children || "?"}
        </span>
    );
});
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };