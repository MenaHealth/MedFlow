// components/ui/text.tsx
import * as React from "react"
import {cn} from "@/lib/utils";

export interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    weight?: "normal" | "bold";
}

const Text = React.forwardRef<HTMLDivElement, TextProps>(
    ({ size, weight, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "text-foreground-primary",
                    {
                        "text-xs": size === "xs",
                        "text-sm": size === "sm",
                        "text-md": size === "md",
                        "text-lg": size === "lg",
                        "text-xl": size === "xl",
                        "font-normal": weight === "normal",
                        "font-bold": weight === "bold",
                    },
                    props.className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Text.displayName = 'Text';

export default Text;