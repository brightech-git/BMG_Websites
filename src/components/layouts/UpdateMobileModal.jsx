import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateMobileNumber, verifyOtp } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "./UpdateMobileModal.css";

const UpdateMobileModal = ({ open: propOpen, onClose: propOnClose }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);


    const [contactNumber, setContactNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [timer, setTimer] = useState(0);
    const [errors, setErrors] = useState({});
    const modalRef = useRef(null);

    // Always show modal for design
    useEffect(() => {
        setOpen(true);
    }, []);

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

    if (!isAuthenticated) {
        return null;
    }

    if (user?.contactNumber) {
        return null;
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="mobile-modal-overlay">
                    <motion.div
                        ref={modalRef}
                        className="mobile-modal-container"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <div className="mobile-modal-header">
                            <h2 className="mobile-modal-title">
                                {showSuccess ? "Success!" : showOtpSection ? "Verify OTP" : "Update Mobile Number"}
                            </h2>
                            {!showSuccess && (
                                <button className="mobile-close-button" onClick={handleClose}>
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="mobile-modal-content">
                            {showSuccess ? (
                                <div className="mobile-success-animation">
                                    <div className="mobile-success-icon">✓</div>
                                    <div className="mobile-success-message">Verified Successfully!</div>
                                    <div className="mobile-success-submessage">
                                        Your mobile number has been updated and verified
                                    </div>
                                </div>
                            ) : !showOtpSection ? (
                                <>
                                    <div className="mobile-input-group">
                                        <label className="mobile-input-label">Mobile Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter your 10-digit mobile number"
                                            className={`mobile-phone-input ${errors.contactNumber ? 'mobile-input-error' : ''}`}
                                            value={contactNumber}
                                            onChange={(e) => {
                                                setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                                                if (errors.contactNumber) {
                                                    setErrors({});
                                                }
                                            }}
                                            disabled={loading}
                                        />
                                        {errors.contactNumber && (
                                            <div className="mobile-error-message">{errors.contactNumber}</div>
                                        )}
                                    </div>

                                    <div className="mobile-modal-actions">
                                        <button
                                            className="mobile-btn mobile-btn-cancel"
                                            onClick={handleClose}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="mobile-btn mobile-btn-primary"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? "Sending OTP..." : "Send OTP"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mobile-otp-section">
                                        <div className="mobile-otp-info">
                                            Enter the 6-digit OTP sent to <strong>+91 {contactNumber}</strong>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            className={`mobile-otp-input ${errors.otp ? 'mobile-input-error' : ''}`}
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                                if (errors.otp) {
                                                    setErrors({});
                                                }
                                            }}
                                            disabled={loading}
                                        />
                                        {errors.otp && (
                                            <div className="mobile-error-message">{errors.otp}</div>
                                        )}

                                        <div className="mobile-otp-timer">
                                            {timer > 0 ? (
                                                `Resend OTP in ${formatTimer(timer)}`
                                            ) : (
                                                <button
                                                    className="mobile-resend-button"
                                                    onClick={resendOtp}
                                                    disabled={loading}
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mobile-modal-actions">
                                        <button
                                            className="mobile-btn mobile-btn-cancel"
                                            onClick={() => {
                                                setShowOtpSection(false);
                                                setErrors({});
                                            }}
                                            disabled={loading}
                                        >
                                            Back
                                        </button>
                                        <button
                                            className="mobile-btn mobile-btn-primary"
                                            onClick={handleVerifyOtp}
                                            disabled={loading}
                                        >
                                            {loading ? "Verifying..." : "Verify OTP"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpdateMobileModal;