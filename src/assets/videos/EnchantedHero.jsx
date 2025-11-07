"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import video from "../../assets/videos/3.mp4";
import image from "../../assets/videos/clouds-back.jpg";

export default function EnchantedHero() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Smooth animation transforms
    const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.7]);
    const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const cloudY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

    // Initialize Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            smooth: true,
            lerp: 0.08,
            wheelMultiplier: 1.2,
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }, []);

    return (
        <div
            ref={sectionRef}
            className="relative min-h-[350vh] bg-gradient-to-b from-sky-300 via-pink-100 to-white overflow-hidden"
        >
            {/* 🌟 Hero Video or Image */}
            <motion.div
                style={{ scale, opacity }}
                className="fixed top-0 left-0 w-full h-screen flex justify-center items-center pointer-events-none"
            >
                <video
                    src={video} // your video path
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
            </motion.div>

            {/* ☁️ Parallax Clouds (multiple layers) */}
            <motion.img
                src={image}
                alt="Cloud Layer Back"
                style={{ y: cloudY }}
                className="absolute bottom-0 left-0 w-full opacity-70 z-0"
            />
            <motion.img
                src={image}
                alt="Cloud Layer Front"
                style={{
                    y: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                }}
                className="absolute bottom-0 left-0 w-full opacity-90 z-10"
            />

            {/* ✨ Main Content (revealed after scroll) */}
            <div className="relative z-20 pt-[130vh] flex flex-col items-center text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-6xl md:text-7xl font-serif text-sky-900"
                >
                    Whispers of Enchantment
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed"
                >
                    Where fantastical flowers unfurl in brilliance, and mystical beings move as keepers of dreams.
                    Discover the delicate craftsmanship that transcends imagination.
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="mt-10 px-8 py-3 rounded-full bg-rose-700 text-white text-lg shadow-lg hover:bg-rose-800 transition"
                >
                    View Collection
                </motion.button>
            </div>
        </div>
    );
}
