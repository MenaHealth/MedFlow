// components/newPatient/aboutPage/StepItem.tsx
import React from "react";
import { motion } from "framer-motion";

interface Step {
    title: string;
    description: string;
}

interface StepItemProps {
    step: Step;
    index: number;
    controls: any; // Adjust the type as needed
}

const StepItem = React.memo(function StepItem({ step, index, controls }: StepItemProps) {
    return (
        <motion.div
            key={index}
            className="relative flex items-start pl-10"
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
        >
            <motion.div
                className="absolute left-0 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-[#056E73] text-white font-bold"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    duration: 0.4,
                    delay: 0.6 + index * 0.2,
                    ease: "easeOut",
                }}
            >
                {index + 1}
            </motion.div>
            <div>
                <h3 className="font-semibold text-lg text-gray-800 pb-1">
                    {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
            </div>
        </motion.div>
    );
});

// This approach automatically assigns the display name based on the function name
StepItem.displayName = "StepItem";

export default StepItem;