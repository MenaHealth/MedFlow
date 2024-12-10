// components/WorldMap.jsx
"use client";
import { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

export function WorldMap({
                             dots = [],
                             lineColor = "#0ea5e9"
                         }) {
    const svgRef = useRef(null);
    const map = new DottedMap({ height: 100, grid: "diagonal" });

    const svgMap = map.getSVG({
        radius: 0.22,
        color: "#00000040",
        shape: "circle",
        backgroundColor: "white",
    });

    const projectPoint = (lat, lng) => {
        const x = (lng + 180) * (800 / 360);
        const y = (90 - lat) * (400 / 180);
        return { x, y };
    };

    const createCurvedPath = (start, end) => {
        const midX = (start.x + end.x) / 2;
        const midY = Math.min(start.y, end.y) - 50;
        return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
    };

    const controls = useAnimation();

    useEffect(() => {
        const animate = async () => {
            await controls.start({ pathLength: 1, transition: { duration: 1.5, ease: "easeInOut" } });
            await controls.start({ pathLength: 0, transition: { duration: 0.5, ease: "easeInOut" } });
            animate();
        };
        animate();
    }, [controls]);

    return (
        <div className="w-full aspect-[2/1] bg-white rounded-lg relative font-sans">
            <Image
                src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
                className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
                alt="world map"
                height="495"
                width="1056"
                draggable={false}
            />
            <svg
                ref={svgRef}
                viewBox="0 0 800 400"
                className="w-full h-full absolute inset-0 pointer-events-none select-none"
            >
                {dots.map((dot, i) => {
                    const startPoint = projectPoint(dot.start.lat, dot.start.lng);
                    const endPoint = projectPoint(dot.end.lat, dot.end.lng);
                    return (
                        <g key={`path-group-${i}`}>
                            <motion.path
                                d={createCurvedPath(startPoint, endPoint)}
                                fill="none"
                                stroke="url(#path-gradient)"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                animate={controls}
                            />
                        </g>
                    );
                })}

                <defs>
                    <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
                        <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {dots.map((dot, i) => (
                    <g key={`points-group-${i}`}>
                        <motion.circle
                            cx={projectPoint(dot.start.lat, dot.start.lng).x}
                            cy={projectPoint(dot.start.lat, dot.start.lng).y}
                            r="2"
                            fill={lineColor}
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: [1, 3, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.circle
                            cx={projectPoint(dot.end.lat, dot.end.lng).x}
                            cy={projectPoint(dot.end.lat, dot.end.lng).y}
                            r="2"
                            fill={lineColor}
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: [1, 3, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
}

