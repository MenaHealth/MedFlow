// types/ScrollContextTypes.ts
import { MotionValue } from "framer-motion";

export interface ScrollContextValue {
    scrollX: MotionValue<number>;
    scrollY: MotionValue<number>;
    scrollXProgress: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
}