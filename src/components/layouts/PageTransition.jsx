'use client';
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./PageTransition.css";

const PageTransition = ({ children, animation = "fade" }) => {
    const location = useLocation();

    const variants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slideUp: {
            initial: { opacity: 0, y: 40 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -40 },
        },
        slideLeft: {
            initial: { opacity: 0, x: 60 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -60 },
        },
        zoom: {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.96 },
        },
    };

    return (
        <div className="page-transition-wrapper">
            {/* Overlay fade layer */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    className="page-transition-inner"
                    variants={variants[animation] || variants.fade}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* Optional overlay fade between pages */}
            <AnimatePresence>
                <motion.div
                    key={`overlay-${location.pathname}`}
                    className="page-transition-overlay"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                />
            </AnimatePresence>
        </div>
    );
};

export default PageTransition;
