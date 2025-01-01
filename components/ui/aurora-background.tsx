// components/ui/aurora-background.tsx
"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends Omit<React.HTMLProps<HTMLDivElement>, 'style'> {
    children: ReactNode;
    showRadialGradient?: boolean;
    backgroundColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    auroraStyle?: 'orange' | 'grey' | 'none';
}

export const AuroraBackground = ({
                                     className,
                                     children,
                                     showRadialGradient = true,
                                     backgroundColor,
                                     gradientFrom,
                                     gradientTo,
                                     auroraStyle = 'none',
                                     ...props
                                 }: AuroraBackgroundProps) => {
    const getStyleColors = (style: string) => {
        switch (style) {
            case 'orange':
                return 'bg-[image:repeating-linear-gradient(100deg,var(--orange-300)_10%,var(--orange-200)_20%,var(--orange-100)_30%,var(--orange-400)_40%,var(--orange-500)_50%)]';
            case 'grey':
                return 'bg-[image:repeating-linear-gradient(100deg,var(--gray-300)_10%,var(--gray-200)_20%,var(--gray-100)_30%,var(--gray-400)_40%,var(--gray-500)_50%)]';
            default:
                return '';
        }
    };

    const backgroundStyle = backgroundColor || (gradientFrom && gradientTo)
        ? `bg-gradient-to-b from-${gradientFrom} to-${gradientTo}`
        : '';

    return (
        <main className={cn("relative min-h-screen overflow-hidden", className)}>
            <div
                className={cn(
                    "relative flex flex-col h-[100vh] items-center justify-center text-slate-950 transition-bg",
                    backgroundStyle,
                    className
                )}
                {...props}
            >
                {auroraStyle !== 'none' && (
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className={cn(
                                `absolute inset-0 opacity-50
                                bg-[length:300%_200%]
                                animate-aurora
                                blur-[10px]`,
                                getStyleColors(auroraStyle),
                                showRadialGradient &&
                                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
                            )}
                        ></div>
                    </div>
                )}
                {children}
            </div>
        </main>
    );
};

