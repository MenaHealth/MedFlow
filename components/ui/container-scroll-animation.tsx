"use client";
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
        offset: ["start center", "end center"],
    });

    // Reduced rotation range to prevent upside-down state
    const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);

    // Adjusted scale and y values for smoother animation
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden">
            <div
                className="min-h-[100vh] w-full"
                style={{ perspective: "1000px" }}
            >
                <Header titleComponent={titleComponent} />
                <Card rotateX={rotateX} scale={scale} y={y}>
                    {children}
                </Card>
            </div>
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
                  children,
              }: {
    rotateX: MotionValue<number>;
    scale: MotionValue<number>;
    y: MotionValue<number>;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            style={{ rotateX, scale, y }}
            className="max-w-lg mx-auto"
        >
            {children}
        </motion.div>
    );
}

