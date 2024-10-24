import * as React from "react"
import Image from "next/image"
import { cn } from "../../utils/classNames";

const Avatar = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { src?: string; alt?: string; initials?: string }
>(({ className, src, alt, initials, ...props }, ref) => {
    return (
        <span
            ref={ref}
            className={cn(
                "inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100",
                className || ''
            )}
            {...props}
        >
      {src ? (
          <Image
              src={src}
              alt={alt || "Avatar"}
              className="object-cover"
              layout="fill" // This makes the image take up the full span dimensions
          />
      ) : (
          <span className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600 font-medium text-sm">
          {initials || "?"}
        </span>
      )}
    </span>
    )
})
Avatar.displayName = "Avatar"

export { Avatar }