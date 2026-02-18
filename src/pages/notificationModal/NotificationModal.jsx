// src/components/pages/notificationModal/NotificationModal.js
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "animate.css";
import { Bell, X, Check, AlertCircle, BellRing, Volume2, VolumeX } from "lucide-react";

const NotificationModal = ({ show, onClose, onAllow, title, message, image, type }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
                delay: 0.2
            }
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={handleOverlayClick}
                >
                    <motion.div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Orange Gradient */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 relative">
                            <motion.div
                                className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                                variants={iconVariants}
                            >
                                {type === "permission" ? (
                                    <BellRing size={26} className="text-white" />
                                ) : (
                                    <Bell size={26} className="text-white" />
                                )}
                            </motion.div>

                            {/* Close Button */}
                            <motion.button
                                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/30 transition-all backdrop-blur-sm"
                                onClick={onClose}
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X size={16} />
                            </motion.button>

                            {/* Decorative Elements */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-orange-300"></div>
                        </div>

                        {/* Content */}
                        <div className="p-3 md:p-4">
                            {/* Image (if provided) */}
                            {image && (
                                <motion.div
                                    className="mb-6 rounded-xl overflow-hidden shadow-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <img
                                        src={image}
                                        alt="notification"
                                        className="w-full h-40 object-cover"
                                    />
                                </motion.div>
                            )}

                            {/* Title */}
                            <motion.h2
                                className="text-lg font-bold text-orange-500 mb-2 text-center "
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {title || (
                                    type === "permission"
                                        ? "🔔 Stay Updated!"
                                        : "Notification"
                                )}
                            </motion.h2>

                            {/* Message */}
                            <motion.p
                                className=" text-center mb-4 leading-relaxed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {message || (
                                    type === "permission"
                                        ? "Get important updates, offers, and notifications about your orders and wishlist."
                                        : "Stay updated with important updates."
                                )}
                            </motion.p>

                            {/* Actions */}
                            {type === "permission" && (
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                   

                                    <motion.button
                                        className="flex-1 px-2 py-2 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        onClick={onClose}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <VolumeX size={16} />
                                        Not Now
                                    </motion.button>
                                    <motion.button
                                        className="flex-1 px-2 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-orange-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                                        onClick={onAllow}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Volume2 size={16} className="group-hover:animate-pulse" />
                                        Allow Notifications
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Simple notification type (just a message) */}
                            {type !== "permission" && (
                                <motion.div
                                    className="flex justify-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <motion.button
                                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-orange-200 hover:shadow-xl transition-all"
                                        onClick={onClose}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Got it
                                    </motion.button>
                                </motion.div>
                            )}

                            {/* Footer Note */}
                            {type === "permission" && (
                                <motion.p
                                    className="text-xs text-gray-400 text-center mt-6 flex items-center justify-center gap-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <AlertCircle size={12} />
                                    You can change this anytime in browser settings
                                </motion.p>
                            )}
                        </div>

                        {/* Progress Bar Animation for Auto-close (optional) */}
                        {type !== "permission" && (
                            <motion.div
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                onAnimationComplete={onClose}
                            />
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationModal;