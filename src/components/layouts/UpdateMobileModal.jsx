import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateMobileNumber, verifyOtp } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "animate.css";

// Icons
import {
    X,
    Phone,
    Key,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Clock,
    Send,
    Shield
} from "lucide-react";

const UpdateMobileModal = ({ open: propOpen, onClose: propOnClose }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const [contactNumber, setContactNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [timer, setTimer] = useState(0);
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    // Allow parent to control modal
    useEffect(() => {
        if (propOpen !== undefined) setOpen(propOpen);
    }, [propOpen]);

    // OTP timer effect
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleClose = () => {
        setOpen(false);
        setShowOtpSection(false);
        setShowSuccess(false);
        setOtp("");
        setTimer(0);
        setErrors({});
        if (propOnClose) propOnClose();
    };

    const startOtpTimer = () => {
        setTimer(60);
    };

    const resendOtp = async () => {
        if (timer > 0) return;

        try {
            setLoading(true);
            const result = await dispatch(updateMobileNumber({
                userId: user?.id,
                contactNumber
            })).unwrap();

            if (result.message === "Incorrect mobile number") {
                setErrors({ contactNumber: "Please enter a valid mobile number" });
                return;
            }

            if (result.message === "Contact number already exists") {
                setErrors({ contactNumber: "This mobile number is already registered" });
                return;
            }

            startOtpTimer();
            toast.success("OTP resent successfully!");
        } catch (err) {
            console.error('Resend OTP error:', err);
            if (err?.message === "Incorrect mobile number") {
                setErrors({ contactNumber: "Please enter a valid mobile number" });
            } else if (err?.message === "Contact number already exists") {
                setErrors({ contactNumber: "This mobile number is already registered" });
            } else {
                toast.error("Failed to resend OTP");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setErrors({});

        if (!contactNumber || contactNumber.length !== 10) {
            setErrors({ contactNumber: "Please enter a valid 10-digit mobile number" });
            return;
        }

        if (!isAuthenticated || !user?.id) {
            toast.error("Please login to update mobile number");
            handleClose();
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(updateMobileNumber({
                userId: user.id,
                contactNumber
            })).unwrap();

            if (result.message === "Incorrect mobile number") {
                setErrors({ contactNumber: "Please enter a valid mobile number" });
                return;
            }

            if (result.message === "Contact number already exists") {
                setErrors({ contactNumber: "This mobile number is already registered" });
                return;
            }

            toast.success("OTP sent to your mobile number!");
            setShowOtpSection(true);
            startOtpTimer();
        } catch (err) {
            console.error('Update mobile error:', err);
            if (err?.message === "Incorrect mobile number") {
                setErrors({ contactNumber: "Please enter a valid mobile number" });
            } else if (err?.message === "Contact number already exists") {
                setErrors({ contactNumber: "This mobile number is already registered" });
            } else {
                toast.error(err?.message || "Failed to update mobile number");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setErrors({});

        if (!otp || otp.length !== 6) {
            setErrors({ otp: "Please enter a valid 6-digit OTP" });
            return;
        }

        if (!isAuthenticated) {
            toast.error("Session expired. Please login again.");
            handleClose();
            return;
        }

        setLoading(true);
        try {
            await dispatch(verifyOtp({ contactNumber, otp })).unwrap();

            setShowSuccess(true);
            toast.success("Mobile number verified successfully!");

            setTimeout(() => {
                handleClose();
            }, 2000);

        } catch (err) {
            console.error('Verify OTP error:', err);
            setErrors({ otp: "Invalid OTP. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
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
            y: 50,
            transition: { duration: 0.3 }
        }
    };

    const successIconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
                duration: 0.6
            }
        }
    };

    if (!isAuthenticated || user?.contactNumber) {
        return null;
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={handleClose}
                >
                    <motion.div
                        ref={modalRef}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-orange-100"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header with Orange Gradient */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 relative">
                            <h2 className="text-lg font-bold text-white text-center ">
                                {showSuccess ? "✨ Success!" : showOtpSection ? "🔐 Verify OTP" : " Update Mobile Number"}
                            </h2>
                            {!showSuccess && (
                                <motion.button
                                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/30 transition-all backdrop-blur-sm"
                                    onClick={handleClose}
                                    whileHover={{ rotate: 90, scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={18} />
                                </motion.button>
                            )}

                            {/* Decorative Elements */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-orange-300"></div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 md:p-6">
                            <AnimatePresence mode="wait">
                                {showSuccess ? (
                                    /* Success State */
                                    <motion.div
                                        key="success"
                                        className="text-center py-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div
                                            className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
                                            variants={successIconVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            <CheckCircle size={40} className="text-white" />
                                        </motion.div>

                                        <h3 className="text-xl font-bold text-gray-800 mb-2 animate__animated animate__fadeIn">
                                            Verified Successfully!
                                        </h3>

                                        <p className="text-gray-600 animate__animated animate__fadeIn animate__delay-1s">
                                            Your mobile number has been updated and verified
                                        </p>

                                        <motion.div
                                            className="mt-6 w-16 h-16 mx-auto"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto"></div>
                                        </motion.div>
                                    </motion.div>
                                ) : !showOtpSection ? (
                                    /* Phone Number Input State */
                                    <motion.div
                                        key="phone"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="relative">
                                            <label className="absolute -top-2 left-3 bg-white px-2 text-sm font-medium text-orange-600 z-10">
                                                Mobile Number
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="Enter 10-digit mobile number"
                                                    className={`w-full pl-10 pr-4 py-3 h-12 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all ${errors.contactNumber
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-gray-200 focus:border-orange-500'
                                                        } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                                                    value={contactNumber}
                                                    onChange={(e) => {
                                                        setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                                                        if (errors.contactNumber) setErrors({});
                                                    }}
                                                    disabled={loading}
                                                />
                                            </div>
                                            {errors.contactNumber && (
                                                <motion.p
                                                    className="flex items-center gap-1 text-red-500 text-sm"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <AlertCircle size={14} />
                                                    {errors.contactNumber}
                                                </motion.p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <motion.button
                                                className="flex-1 px-2 py-2 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
                                                onClick={handleClose}
                                                disabled={loading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Cancel
                                            </motion.button>
                                            <motion.button
                                                className="flex-1 px-2 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-orange-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <motion.span
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        Sending...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Send size={16} />
                                                        Send OTP
                                                    </span>
                                                )}
                                            </motion.button>
                                        </div>

                                            <p className="text-xs text-orange-500 text-center  flex items-center justify-center gap-1">
                                                <Shield size={12} className="text-orange-500" />
                                                We'll send a verification code to this number
                                            </p>
                                    </motion.div>
                                ) : (
                                    /* OTP Verification State */
                                    <motion.div
                                        key="otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <div className="bg-orange-50 p-2 rounded-xl border border-orange-100">
                                            <p className="text-sm text-gray-600 text-center">
                                                Enter the 6-digit OTP sent to <br />
                                                <span className="font-bold text-orange-600">+91 {contactNumber}</span>
                                            </p>
                                        </div>

                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Enter 6-digit OTP"
                                                className={`w-full pl-10 pr-4 h-12 py-3 border-2 rounded-xl bg-gray-50 focus:bg-white transition-all text-center tracking-widest text-lg ${errors.otp
                                                        ? 'border-red-500 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-orange-500'
                                                    } focus:outline-none focus:ring-2 focus:ring-orange-200`}
                                                value={otp}
                                                onChange={(e) => {
                                                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                    if (errors.otp) setErrors({});
                                                }}
                                                disabled={loading}
                                                maxLength={6}
                                            />
                                            {errors.otp && (
                                                <motion.p
                                                    className="flex items-center gap-1 text-red-500 text-sm mt-1"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <AlertCircle size={14} />
                                                    {errors.otp}
                                                </motion.p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {timer > 0 ? (
                                                <motion.div
                                                    className="flex items-center gap-2 text-gray-600"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <Clock size={16} className="text-orange-500" />
                                                    <span>Resend in <span className="font-mono font-bold text-orange-600">{formatTimer(timer)}</span></span>
                                                </motion.div>
                                            ) : (
                                                <motion.button
                                                    className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
                                                    onClick={resendOtp}
                                                    disabled={loading}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Resend OTP
                                                </motion.button>
                                            )}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <motion.button
                                                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
                                                onClick={() => {
                                                    setShowOtpSection(false);
                                                    setErrors({});
                                                }}
                                                disabled={loading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    <ArrowLeft size={16} />
                                                    Back
                                                </span>
                                            </motion.button>
                                            <motion.button
                                                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium shadow-lg shadow-orange-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={handleVerifyOtp}
                                                disabled={loading}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <motion.span
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        Verifying...
                                                    </span>
                                                ) : (
                                                    "Verify OTP"
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Note */}
                        {!showSuccess && !showOtpSection && (
                            <div className="px-2 pb-2 text-center">
                                <p className="text-xs ">
                                    By continuing, you agree to receive SMS from BMG Jewellers
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UpdateMobileModal;