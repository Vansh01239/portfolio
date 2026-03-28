"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleHoverStart = () => setIsHovered(true);
        const handleHoverEnd = () => setIsHovered(false);

        window.addEventListener("mousemove", mouseMove);

        const interactiveElements = document.querySelectorAll('button, a, .group');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleHoverStart);
            el.addEventListener('mouseleave', handleHoverEnd);
        });

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleHoverStart);
                el.removeEventListener('mouseleave', handleHoverEnd);
            });
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            backgroundColor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        hover: {
            height: 64,
            width: 64,
            x: mousePosition.x - 32,
            y: mousePosition.y - 32,
            backgroundColor: "white",
            mixBlendMode: "difference" as const,
        }
    };

    return (
        <motion.div
            className="fixed top-0 left-0 h-8 w-8 rounded-full pointer-events-none z-9999 hidden lg:block"
            variants={variants}
            animate={isHovered ? "hover" : "default"}
            transition={{ type: "spring", damping: 25, stiffness: 250, mass: 0.5 }}
        />
    );
};
