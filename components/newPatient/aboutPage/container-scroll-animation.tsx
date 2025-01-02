// components/newPatient/aboutPage/container-scroll-animation.tsx
"use client"

import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export function ContainerScroll({
                                    titleComponent,
                                    children,
                                }: {
    titleComponent: React.ReactNode;
    children: React.ReactNode;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Adjust these values to control the intensity of each effect
    const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
    const y = useTransform(scrollYProgress, [0, 1], [100, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1]);

    return (
        <div ref={containerRef} className="relative w-full min-h-[50vh]" style={{ perspective: "1000px" }}>
            <Header titleComponent={titleComponent} />
            <Card rotateX={rotateX} scale={scale} y={y} opacity={opacity}>
                {children}
            </Card>
        </div>
    );
}

function Header({ titleComponent }: { titleComponent: React.ReactNode }) {
    return (
        <div className="py-10 text-center max-w-3xl mx-auto">
            {titleComponent}
        </div>
    );
}

function Card({
                  rotateX,
                  scale,
                  y,
                  opacity,
                  children,
              }: {
    rotateX: MotionValue<number>;
    scale: MotionValue<number>;
    y: MotionValue<number>;
    opacity: MotionValue<number>;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            style={{
                rotateX,
                scale,
                y,
                opacity,
                transformOrigin: "top center", // This ensures the zoom effect is towards the top center
            }}
            className="max-w-lg mx-auto mb-16"
        >
            {children}
        </motion.div>
    );
}
