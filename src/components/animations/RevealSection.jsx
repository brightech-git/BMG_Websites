"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function RevealSection({ children, intensity = 0.2 }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 20%"],
    });

    // Motion transforms (depth, fade, and slight scale)
    const y = useTransform(scrollYProgress, [0, 1], [100 * intensity, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

    return (
        <motion.section
            ref={ref}
            style={{
                y,
                opacity,
                scale,
                filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.1))",
            }}
            transition={{
                type: "spring",
                stiffness: 80,
                damping: 20,
                mass: 0.8,
            }}
            className="relative w-full will-change-transform"
        >
            {children}
        </motion.section>
    );
}
