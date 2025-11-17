"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4, // Smooth duration (tune this)
            smooth: true,
            lerp: 0.08, // Lower = smoother, higher = snappier
            wheelMultiplier: 0.8, // reduce scroll speed
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return <div >{children}</div>;
}
 