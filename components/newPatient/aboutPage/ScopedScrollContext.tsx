// components/newPatient/aboutPage/ScopedScrollContext.tsx
"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useScroll, ScrollMotionValues } from "framer-motion";

interface ScopedScrollContextValue extends ScrollMotionValues {}

const ScopedScrollContext = createContext<ScopedScrollContextValue | null>(null);

export const ScopedScrollProvider = ({ children }: { children: ReactNode }) => {
    const scroll = useScroll();

    return (
        <ScopedScrollContext.Provider value={scroll}>
            {children}
        </ScopedScrollContext.Provider>
    );
};

export const useScopedScrollContext = () => {
    const context = useContext(ScopedScrollContext);
    if (!context) {
        throw new Error("useScopedScrollContext must be used within a ScopedScrollProvider");
    }
    return context;
};