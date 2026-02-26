import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { forgotPassword, resetPassword, clearError } from '../../../../redux/slices/userSlice';
import {
    FaMobile, FaKey, FaLock, FaCheckCircle,
    FaArrowLeft, FaRedoAlt, FaExclamationTriangle,
    FaShieldAlt, FaClock, FaUserLock, FaEnvelope
} from 'react-icons/fa';
import { MdOutlineMarkEmailUnread } from 'react-icons/md';
import 'animate.css';
import forgotImg from '../../../../assets/images/forgot.jpeg';

const ForgotPassword = () => {
    const [contactNumber, setContactNumber] = useState('');
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [otpFocused, setOtpFocused] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.user);

    // OTP input refs
    const otpRefs = Array(6).fill(0).map(() => React.createRef());

    useEffect(() => {
        dispatch(clearError());
        setErrors({});
    }, [dispatch]);

    useEffect(() => {
        if (errors.general || error) {
            const timer = setTimeout(() => {
                setErrors({ ...errors, general: '' });
                dispatch(clearError());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errors, dispatch, error]);

    // Resend timer effect
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Password strength checker
    const checkPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength += 1;
        if (pass.length >= 8) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[a-z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
        setPasswordStrength(Math.min(strength, 5));
    };

    const validateSendOtp = () => {
        const newErrors = {};
        if (!contactNumber) {
            newErrors.contactNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(contactNumber)) {
            newErrors.contactNumber = 'Mobile number must be exactly 10 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateResetPassword = () => {
        const newErrors = {};
        const otpString = otp.join('');

        if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
            newErrors.otp = 'Please enter a valid 6-digit OTP';
        }
        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase, lowercase and number';
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        if (!validateSendOtp()) return;

        try {
            await dispatch(forgotPassword(contactNumber)).unwrap();
            setStep(2);
            setErrors({});
            setResendTimer(30);
        } catch (err) {
            setErrors({ general: err.message || 'Failed to send OTP' });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!validateResetPassword()) return;

        try {
            const otpString = otp.join('');
            await dispatch(resetPassword({ contactNumber, otp: otpString, newPassword })).unwrap();
            setErrors({});
            // Show success message before redirect
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setErrors({ general: err.message || 'Failed to reset password' });
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        await handleSendOtp();
        setResendTimer(30);
    };
    const handleVerifyOtp = async (e) => {
        e?.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setErrors({ ...errors, otp: 'Please enter complete 6-digit OTP' });
            return;
        }

        try {
            // Call your OTP verification API here
            // await dispatch(verifyOtp({ contactNumber, otp: otpString })).unwrap();

            // If successful, move to next step
            setStep(3);
            setErrors({});
        } catch (err) {
            setErrors({ otp: 'Invalid OTP. Please try again.' });
        } finally {

        }
    };
    // const handleOtpChange = (index, value) => {
    //     if (value.length > 1) {
    //         // Handle paste
    //         const pastedValue = value.slice(0, 6).split('');
    //         const newOtp = [...otp];
    //         pastedValue.forEach((char, i) => {
    //             if (i < 6 && /^\d*$/.test(char)) {
    //                 newOtp[i] = char;
    //             }
    //         });
    //         setOtp(newOtp);

    //         // Focus next empty or last field
    //         const nextEmptyIndex = newOtp.findIndex(v => !v);
    //         if (nextEmptyIndex !== -1 && otpRefs[nextEmptyIndex]?.current) {
    //             otpRefs[nextEmptyIndex].current.focus();
    //         } else if (otpRefs[5]?.current) {
    //             otpRefs[5].current.focus();
    //         }
    //     } else if (/^\d*$/.test(value)) {
    //         const newOtp = [...otp];
    //         newOtp[index] = value;
    //         setOtp(newOtp);

    //         // Auto-focus next input
    //         if (value && index < 5 && otpRefs[index + 1]?.current) {
    //             otpRefs[index + 1].current.focus();
    //         }
    //     }

    //     if (errors.otp) setErrors({ ...errors, otp: '' });
    // };
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && otpRefs[index - 1]?.current) {
            otpRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        if (pastedData.length > 0) {
            const newOtp = [...otp];
            pastedData.slice(0, 6).split('').forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
        }
    };

    // Get strength color and text
    const getStrengthInfo = () => {
        const strengths = [
            { color: 'bg-red-500', text: 'Weak', bg: 'bg-red-50', textColor: 'text-red-700' },
            { color: 'bg-orange-500', text: 'Fair', bg: 'bg-orange-50', textColor: 'text-orange-700' },
            { color: 'bg-yellow-500', text: 'Good', bg: 'bg-yellow-50', textColor: 'text-yellow-700' },
            { color: 'bg-blue-500', text: 'Strong', bg: 'bg-blue-50', textColor: 'text-blue-700' },
            { color: 'bg-green-500', text: 'Very Strong', bg: 'bg-green-50', textColor: 'text-green-700' }
        ];
        return strengths[passwordStrength - 1] || { color: 'bg-gray-200', text: 'Enter password', bg: 'bg-gray-50', textColor: 'text-gray-700' };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className=" flex bg-gradient-to-br from-orange-50 via-white to-orange-100">
            {/* Left Side - Branding/Illustration */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-2 flex-col justify-between"
            >
                <img src={forgotImg} className='object-cover rounded-2xl' />

            </motion.div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full max-w-md"
                >
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-orange-100"
                    >
                        {/* Header */}
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <div className="inline-block p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
                                {step === 1 ? (
                                    <FaKey className="w-8 h-8 text-white" />
                                ) : step === 2 ? (
                                    <MdOutlineMarkEmailUnread className="w-8 h-8 text-white" />
                                ) : (
                                    <FaLock className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                                {step === 1 ? 'Forgot Password?' :
                                    step === 2 ? 'Verify OTP' : 'Reset Password'}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {step === 1
                                    ? 'Enter your mobile number to receive OTP'
                                    : step === 2
                                        ? 'Enter the 6-digit code sent to your mobile'
                                        : 'Create a new strong password'}
                            </p>
                        </motion.div>

                        {/* Progress Steps */}
                        <motion.div variants={itemVariants} className="mb-6 sm:mb-10">
                            <div className="relative flex justify-between items-center">

                                {/* Background Line */}
                                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full" />

                                {/* Active Progress Line */}
                                <div
                                    className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                                    style={{ width: `${(step - 1) * 50}%` }}
                                />

                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="relative z-10 flex flex-col items-center">
                                        <div
                                            className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold
          transition-all duration-300
          ${step >= s
                                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-110'
                                                    : 'bg-white border-2 border-gray-300 text-gray-500'
                                                }
        `}
                                        >
                                            {step > s ? <FaCheckCircle className="w-5 h-5" /> : s}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>


                        {/* Error Alert */}
                        <AnimatePresence>
                            {(error || errors.general) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3"
                                >
                                    <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                                    <p className="text-sm text-red-700">{error || errors.general}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Success Message for Password Reset */}
                        <AnimatePresence>
                            {step === 3 && !loading && !error && newPassword && confirmPassword && newPassword === confirmPassword && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3"
                                >
                                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                    <p className="text-sm text-green-700">Password meets all requirements!</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Forms */}
                        <motion.div variants={itemVariants}>
                            <AnimatePresence mode="wait">
                                {step === 1 ? (
                                    <motion.form
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onSubmit={handleSendOtp}
                                        className="space-y-3 sm:space-y-6"
                                    >
                                        {/* Mobile Number Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <FaMobile className="text-orange-500" />
                                                Mobile Number
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 text-sm">+91</span>
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={contactNumber}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value.length <= 10) setContactNumber(value);
                                                        if (errors.contactNumber) setErrors({ ...errors, contactNumber: '' });
                                                    }}
                                                    placeholder="98765 43210"
                                                    className={`
                                                        w-full pl-12 pr-4 py-3 h-12 rounded-lg border-2 outline-none transition-all
                                                        ${errors.contactNumber
                                                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                            : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                                                        }
                                                    `}
                                                    maxLength={10}
                                                />
                                            </div>
                                            {errors.contactNumber && (
                                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <FaExclamationTriangle size={10} />
                                                    {errors.contactNumber}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`
                                                w-full py-3 px-4 rounded-lg text-white font-medium
                                                transition-all duration-300 transform
                                                ${loading
                                                    ? 'bg-orange-300 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:scale-105 hover:shadow-lg'
                                                }
                                            `}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Sending OTP...
                                                </span>
                                            ) : (
                                                'Send OTP'
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <Link
                                                to="/login"
                                                className="text-sm text-gray-600 hover:text-orange-500 transition-colors inline-flex items-center gap-1 group"
                                            >
                                                <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                                                Back to Login
                                            </Link>
                                        </div>
                                    </motion.form>
                                ) : step === 2 ? (
                                    <motion.form
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleVerifyOtp}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        {/* OTP Input - Single Field */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <MdOutlineMarkEmailUnread className="text-orange-500" />
                                                Enter OTP
                                            </label>

                                            <div className="flex justify-center">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={otp.join('')}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                        const newOtp = [...Array(6)].map((_, i) => value[i] || '');
                                                        setOtp(newOtp);
                                                        if (errors.otp) setErrors({ ...errors, otp: '' });

                                                        // Auto-submit if 6 digits are entered
                                                        if (value.length === 6) {
                                                            handleVerifyOtp(e);
                                                        }
                                                    }}
                                                    onPaste={handlePaste}
                                                    placeholder="Enter 6-digit OTP"
                                                    className={`
                    w-full max-w-xs px-4 py-3 h-12 text-center text-2xl tracking-[0.5em] font-semibold 
                    rounded-lg border-2 outline-none transition-all duration-200
                    ${errors.otp
                                                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                            : otp.join('').length === 6
                                                                ? 'border-orange-500 bg-orange-50'
                                                                : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                                                        }
                `}
                                                    autoFocus
                                                />
                                            </div>

                                            {/* Visual OTP Indicator */}
                                            <div className="flex justify-center gap-2 mt-3">
                                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                                    <div
                                                        key={index}
                                                        className={`
                        w-3 h-3 rounded-full transition-all duration-200
                        ${otp[index]
                                                                ? 'bg-orange-500 scale-110'
                                                                : index < otp.join('').length
                                                                    ? 'bg-orange-300'
                                                                    : 'bg-gray-200'
                                                            }
                    `}
                                                    />
                                                ))}
                                            </div>

                                            {errors.otp && (
                                                <p className="text-xs text-red-500 flex items-center justify-center gap-1 mt-1">
                                                    <FaExclamationTriangle size={10} />
                                                    {errors.otp}
                                                </p>
                                            )}
                                        </div>

                                        {/* Timer */}
                                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                            <FaClock className="text-orange-500" />
                                            OTP expires in:
                                            <span className="font-semibold text-orange-600">
                                                {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading || otp.join('').length !== 6}
                                            className={`
            w-full py-3 px-4 rounded-lg text-white font-medium
            transition-all duration-300 transform
            ${loading || otp.join('').length !== 6
                                                    ? 'bg-orange-300 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:scale-105 hover:shadow-lg'
                                                }
        `}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Verifying...
                                                </span>
                                            ) : (
                                                'Verify OTP'
                                            )}
                                        </button>

                                        {/* Resend OTP */}
                                        <div className="text-center space-y-2">
                                            <p className="text-sm text-gray-600">
                                                Didn't receive OTP?{' '}
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={resendTimer > 0}
                                                    className={`
                    font-medium inline-flex items-center gap-1
                    ${resendTimer > 0
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-orange-500 hover:text-orange-600'
                                                        }
                `}
                                                >
                                                    <FaRedoAlt size={12} className={resendTimer > 0 ? '' : 'group-hover:rotate-180 transition-transform'} />
                                                    Resend {resendTimer > 0 && `(${resendTimer}s)`}
                                                </button>
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-sm text-gray-500 hover:text-orange-500 transition-colors inline-flex items-center gap-1 group"
                                            >
                                                <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                                                Change mobile number
                                            </button>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.form
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onSubmit={handleResetPassword}
                                        className="space-y-4 sm:space-y-6"
                                    >
                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <FaLock className="text-orange-500" />
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => {
                                                        setNewPassword(e.target.value);
                                                        checkPasswordStrength(e.target.value);
                                                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                                                    }}
                                                    placeholder="Enter new password"
                                                    className={`
                                                        w-full px-4 py-3 h-12 rounded-lg border-2 outline-none transition-all pr-12
                                                        ${errors.newPassword
                                                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                            : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                                                        }
                                                    `}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                                                >
                                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>

                                            {/* Password Strength Indicator */}
                                            {newPassword && (
                                                <div className="mt-3">
                                                    <div className="flex gap-1 h-1.5">
                                                        {[1, 2, 3, 4, 5].map((level) => (
                                                            <div
                                                                key={level}
                                                                className={`flex-1 h-full rounded-full transition-all duration-300 ${level <= passwordStrength
                                                                    ? getStrengthInfo().color
                                                                    : 'bg-gray-200'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className={`text-xs mt-2 ${getStrengthInfo().textColor}`}>
                                                        {getStrengthInfo().text}
                                                    </p>
                                                </div>
                                            )}

                                            {errors.newPassword && (
                                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <FaExclamationTriangle size={10} />
                                                    {errors.newPassword}
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <FaLock className="text-orange-500" />
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value);
                                                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                                    }}
                                                    placeholder="Confirm new password"
                                                    className={`
                                                        w-full px-4 py-3 h-12 rounded-lg border-2 outline-none transition-all pr-12
                                                        ${errors.confirmPassword
                                                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                            : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                                                        }
                                                    `}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
                                                >
                                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                    <FaExclamationTriangle size={10} />
                                                    {errors.confirmPassword}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password match indicator */}
                                        {newPassword && confirmPassword && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`
                                                    p-3 rounded-lg text-sm flex items-center gap-2
                                                    ${newPassword === confirmPassword
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-red-50 text-red-700'
                                                    }
                                                `}
                                            >
                                                {newPassword === confirmPassword ? (
                                                    <>
                                                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                                        <span>Passwords match</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                                                        <span>Passwords do not match</span>
                                                    </>
                                                )}
                                            </motion.div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`
                                                w-full py-3 px-4 rounded-lg text-white font-medium
                                                transition-all duration-300 transform
                                                ${loading
                                                    ? 'bg-orange-300 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:scale-105 hover:shadow-lg'
                                                }
                                            `}
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Resetting...
                                                </span>
                                            ) : (
                                                'Reset Password'
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="text-sm text-gray-500 hover:text-orange-500 transition-colors inline-flex items-center gap-1 group"
                                            >
                                                <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                                                Back to OTP verification
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>

                    {/* Support Link */}
                    <motion.p
                        variants={itemVariants}
                        className="text-center mt-4 text-xs text-gray-500"
                    >
                        Having trouble?{' '}
                        <Link to="/contact-support" className="text-orange-500 hover:text-orange-600 font-medium">
                            Contact Support
                        </Link>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;