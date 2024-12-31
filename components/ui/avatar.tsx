import React from "react";
import Image from "next/image";
import { cn } from "../../utils/classNames";

const AvatarFallback = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }
>(({ className, children, ...props }, ref) => (
    <span
        ref={ref}
        className={cn(
            "flex items-center justify-center h-full w-full text-sm font-medium text-gray-400",
            className
        )}
        {...props}
    >
    {children}
  </span>
));

AvatarFallback.displayName = "AvatarFallback";

const Avatar = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & {
    src?: string;
    alt?: string;
    initials?: string;
    user?: any;
}
>(({ className, src, alt, initials, user, ...props }, ref) => {
    const imageSrc = user?.image || user?.googleImage || src;
    const userInitials = initials || (user?.firstName?.[0] + user?.lastName?.[0]) || '';

    return (
        <span
            ref={ref}
            className={cn(
                "inline-block h-24 w-24 overflow-hidden rounded-full bg-gray-100",
                className
            )}
            {...props}
        >
      {imageSrc ? (
          <AvatarImage src={imageSrc} alt={alt || user?.name || "Avatar"} />
      ) : (
          <AvatarFallback>{userInitials}</AvatarFallback>
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
    const [imageError, setImageError] = React.useState(false);

    if (!src || imageError) {
        return <AvatarFallback>{alt[0]}</AvatarFallback>;
    }

    return (
        <div
            ref={ref}
            className={cn("relative h-full w-full", className)}
            {...props}
        >
            <Image
                src={src}
                alt={alt}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                onError={() => setImageError(true)}
            />
        </div>
    );
});

AvatarImage.displayName = "AvatarImage";

export { Avatar, AvatarImage, AvatarFallback };

