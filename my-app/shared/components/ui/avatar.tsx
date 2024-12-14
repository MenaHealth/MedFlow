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
                "inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100",
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
    HTMLDivElement, // Change this to match the parent container (not the `Image` component).
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
            className={cn("object-cover w-full h-full", className)}
            {...props}
        >
            <Image
                src={src} // Ensure `src` is a valid string
                alt={alt}
                className="object-cover"
                width={40}
                height={40}
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
                "flex h-full w-full items-center justify-center bg-gray-300 text-gray-600 font-medium text-sm",
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