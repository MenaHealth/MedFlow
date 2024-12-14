// components/WorldMap.jsx
"use client";
import {useRef, useEffect, useState, useMemo} from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import DottedMap from "dotted-map";
import Image from "next/image";

// Sender and receiver coordinates
const senders = [
    // Afghanistan
    { lat: 34.5553, lng: 69.2075 }, // Kabul
    { lat: 34.3529, lng: 62.2041 }, // Herat
    { lat: 31.6289, lng: 65.7372 }, // Kandahar
    // Lebanon
    { lat: 33.8938, lng: 35.5018 }, // Beirut
    { lat: 34.4367, lng: 35.8497 }, // Tripoli
    { lat: 33.5575, lng: 35.3720 }, // Sidon
    // Yemen
    { lat: 15.3694, lng: 44.1910 }, // Sana’a
    { lat: 12.7855, lng: 45.0187 }, // Aden
    { lat: 13.5789, lng: 44.0219 }, // Taiz
    // Gaza
    { lat: 31.5067, lng: 34.4670 }, // Gaza City
    { lat: 31.2870, lng: 34.2595 }, // Rafah
    { lat: 31.3402, lng: 34.3063 }, // Khan Yunis
];

const receivers = [
    // US
    { lat: 40.7357, lng: -74.1724 }, // Newark
    { lat: 29.7604, lng: -95.3698 }, // Houston
    { lat: 42.3223, lng: -83.1763 }, // Dearborn
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 41.8781, lng: -87.6298 }, // Chicago

    // Europe
    { lat: 55.7558, lng: 37.6173 }, // Moscow
    { lat: 41.0082, lng: 28.9784 }, // Istanbul
    { lat: 51.5074, lng: -0.1278 }, // London
    { lat: 48.8566, lng: 2.3522 }, // Paris
    { lat: 52.5200, lng: 13.4050 }, // Berlin
    { lat: 40.4168, lng: -3.7038 }, // Madrid
    { lat: 53.9006, lng: 27.5590 }, // Minsk

    // Australia
    { lat: -33.8688, lng: 151.2093 }, // Sydney

    // South America
    { lat: -23.5505, lng: -46.6333 }, // São Paulo
    { lat: -34.6037, lng: -58.3816 }, // Buenos Aires

    // China
    { lat: 31.2304, lng: 121.4737 }, // Shanghai

    // Russia
    { lat: 59.9343, lng: 30.3351 }, // Saint Petersburg
];

export function WorldMap({ lineColor = "#056E73" }) {
    const svgRef = useRef(null);
    const [currentRoute, setCurrentRoute] = useState({ start: null, end: null });

    // Create and cache SVG map once
    const memoizedSVGMap = useMemo(() => {
        const map = new DottedMap({ height: 100, grid: "diagonal" });
        return map.getSVG({
            radius: 0.22,
            color: "#00000040",
            shape: "circle",
            backgroundColor: "white",
        });
    }, []);

    const projectPoint = (lat, lng) => {
        const x = (lng + 180) * (800 / 360);
        const y = (90 - lat) * (400 / 180);
        return { x, y };
    };

    const pickRandomRoute = () => {
        const sender = senders[Math.floor(Math.random() * senders.length)];
        const receiver = receivers[Math.floor(Math.random() * receivers.length)];
        setCurrentRoute({ start: sender, end: receiver });
    };

    // Precompute start and end points only when currentRoute changes
    const startPoint = useMemo(
        () => currentRoute.start ? projectPoint(currentRoute.start.lat, currentRoute.start.lng) : null,
        [currentRoute.start]
    );

    const endPoint = useMemo(
        () => currentRoute.end ? projectPoint(currentRoute.end.lat, currentRoute.end.lng) : null,
        [currentRoute.end]
    );

    const progress = useMotionValue(0);
    const fill = useTransform(progress, [0, 0.5, 1], [lineColor, lineColor, "#ff0000"]);

    const x = useTransform(progress, v =>
        startPoint && endPoint
            ? startPoint.x + (endPoint.x - startPoint.x) * v
            : 0
    );

    const y = useTransform(progress, v =>
        startPoint && endPoint
            ? startPoint.y + (endPoint.y - startPoint.y) * v
            : 0
    );

    useEffect(() => {
        if (!startPoint || !endPoint) return;

        progress.set(0);

        const travelDuration = 1.5;
        const returnDuration = 1.5;

        // Forward trip
        animate(progress, 1, {
            duration: travelDuration,
            ease: "easeInOut",
        }).then(() => {
            // Wait at receiver
            setTimeout(() => {
                // Return trip
                animate(progress, 0, {
                    duration: returnDuration,
                    ease: "easeInOut",
                }).then(() => {
                    // Wait a bit before picking a new route
                    setTimeout(() => pickRandomRoute(), 1000);
                });
            }, 500);
        });
    }, [startPoint, endPoint, progress]);

    useEffect(() => {
        pickRandomRoute();
    }, []);

    return (
        <div className="w-full aspect-[2/1] bg-white rounded-lg relative font-sans">
            <div className="relative w-full h-full overflow-hidden">

                <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(memoizedSVGMap)}`}
                    className="h-full w-full pointer-events-none select-none"
                    alt="world map"
                    draggable={false}
                />
                <svg
                    ref={svgRef}
                    viewBox="0 0 800 400"
                    className="w-full h-full absolute inset-0 pointer-events-none select-none"
                >
                    {startPoint && (
                        <circle cx={startPoint.x} cy={startPoint.y} r="3" fill={lineColor}/>
                    )}
                    {endPoint && (
                        <circle cx={endPoint.x} cy={endPoint.y} r="3" fill={lineColor}/>
                    )}
                    {startPoint && endPoint && (
                        <motion.circle
                            cx={x}
                            cy={y}
                            r="4"
                            fill={fill}
                            style={{originX: 0.5, originY: 0.5}}
                        />
                    )}
                </svg>
            </div>
        </div>
        );
    }