"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
}

export const Reveal = ({ children, width = "fit-content", delay = 0.25 }: RevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: "transform, opacity" }}
            >
                {children}
            </motion.div>
        </div>
    );
};
