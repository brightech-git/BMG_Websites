import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { signup, verifyOtp, clearError } from '../../../redux/slices/userSlice';
import GoogleLoginButton from './GoogleLoginButton';
import 'animate.css';
import registerImg from '../../../assets/images/register.jpeg'

const RegisterContent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [tempContactNumber, setTempContactNumber] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, error, loading } = useSelector((state) => state.user);

    const roles = ["ROLE_USER"];

    // Password strength checker
    const checkPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength += 1;
        if (pass.length >= 8) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
        setPasswordStrength(strength);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!username.trim() || username.length < 3) newErrors.username = 'Username must be at least 3 characters';
        if (!email) newErrors.email = 'Email is required';
        else if (!email.endsWith('@gmail.com')) newErrors.email = 'Email must be a Gmail address';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
        if (!contactNumber) newErrors.contactNumber = 'Mobile number is required';
        else if (!/^\d{10}$/.test(contactNumber)) newErrors.contactNumber = 'Must be exactly 10 digits';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (loading) return;
        if (validateForm()) {
            dispatch(signup({ username, email, contactNumber, password, roles }))
                .unwrap()
                .then(() => {
                    setShowOtpModal(true);
                    setTempContactNumber(contactNumber);
                })
                .catch(() => { });
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (loading) return;
        if (!/^\d{6}$/.test(otp)) {
            setErrors({ ...errors, otp: 'Please enter a valid 6-digit OTP' });
            return;
        }
        dispatch(verifyOtp({ contactNumber: tempContactNumber || contactNumber, otp }))
            .unwrap()
            .then(() => {
                setShowOtpModal(false);
                navigate('/');
            })
            .catch(() => { });
    };

    useEffect(() => {
        if (isAuthenticated && !showOtpModal) {
            const lastVisited = localStorage.getItem('lastVisited') || '/';
            navigate(lastVisited !== '/register' ? lastVisited : '/');
        }
    }, [isAuthenticated, showOtpModal, navigate]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => dispatch(clearError()), 3000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    useEffect(() => {
        setErrors({});
        dispatch(clearError());
    }, [location.pathname, dispatch]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const errorVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    // Get strength color and text
    const getStrengthInfo = () => {
        const strengths = [
            { color: 'bg-red-500', text: 'Weak' },
            { color: 'bg-orange-500', text: 'Fair' },
            { color: 'bg-yellow-500', text: 'Good' },
            { color: 'bg-blue-500', text: 'Strong' },
            { color: 'bg-green-500', text: 'Very Strong' }
        ];
        return strengths[passwordStrength - 1] || { color: 'bg-gray-200', text: 'Enter password' };
    };

    const formFields = [
        { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username', value: username, setter: setUsername, icon: '👤' },
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your Gmail address', value: email, setter: setEmail, icon: '📧' },
        { name: 'contactNumber', label: 'Mobile Number', type: 'text', placeholder: 'Enter 10-digit mobile number', value: contactNumber, setter: setContactNumber, icon: '📱' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a strong password', value: password, setter: setPassword, icon: '🔒' }
    ];

    return (
        <div className="flex bg-gradient-to-br from-orange-50 via-white to-orange-100">
            {/* Left Side - Illustration/Branding */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-2 flex-col justify-between"
            >
                <img src={registerImg} className='object-cover rounded-2xl' />
            </motion.div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-lg w-full"
                >
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-8 border border-orange-100"
                    >
                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {(error || Object.keys(errors).length > 0) && !showOtpModal && (
                                <motion.div
                                    variants={errorVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z" />
                                        </svg>
                                        <span className="text-sm text-red-700">{error || Object.values(errors)[0]}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                                {showOtpModal ? 'Verify Your Account' : 'Create Account'}
                            </h2>
                            <p className="mt-1 text-xs text-gray-600">
                                {showOtpModal
                                    ? 'Enter the 6-digit code sent to your mobile'
                                    : 'Fill in your details to get started'}
                            </p>
                        </motion.div>

                        {/* Form */}
                        {!showOtpModal ? (
                            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-6" autoComplete="off">
                                {formFields.map((f) => {
                                    const isPassword = f.name === 'password';
                                    return (
                                        <motion.div variants={itemVariants} key={f.name} className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {f.label}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={isPassword ? (showPassword ? "text" : "password") : f.type}
                                                    placeholder={f.placeholder}
                                                    value={f.value}
                                                    maxLength={f.name === 'contactNumber' ? 10 : undefined}
                                                    onChange={(e) => {
                                                        if (f.name === 'contactNumber') {
                                                            f.setter(e.target.value.replace(/\D/g, ''));
                                                        } else if (f.name === 'password') {
                                                            f.setter(e.target.value);
                                                            checkPasswordStrength(e.target.value);
                                                        } else {
                                                            f.setter(e.target.value);
                                                        }
                                                    }}
                                                    className={`w-full p-2  h-12 rounded-lg border ${errors[f.name]
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                                                        } focus:ring-2 transition-all duration-200 outline-none pl-8`}
                                                />
                                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    {f.icon}
                                                </span>

                                                {isPassword && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors"
                                                    >
                                                        {showPassword ? (
                                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 5c-7 0-10 7-10 7s3 7 10 7c2.3 0 4.2-.7 5.8-1.7l1.4 1.4 1.4-1.4L4.3 4.3 2.9 5.7 6 8.8C4.3 10.1 3 12 3 12s3 7 10 7c1.6 0 3-.3 4.3-.8l2.6 2.6 1.4-1.4L4.3 4.3 2.9 5.7 6 8.8M12 7a5 5 0 015 5c0 .6-.1 1.1-.3 1.6l-1.5-1.5A3 3 0 0012 9c-.4 0-.8.1-1.1.2L9.4 7.7A5 5 0 0112 7z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Password Strength Indicator */}
                                            {isPassword && password && (
                                                <div className="mt-2">
                                                    <div className="flex gap-1 h-1">
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
                                                    <p className={`text-xs mt-1 ${passwordStrength > 3 ? 'text-green-600' : 'text-gray-500'
                                                        }`}>
                                                        {getStrengthInfo().text}
                                                    </p>
                                                </div>
                                            )}

                                            {errors[f.name] && (
                                                <p className="text-xs text-red-600 mt-1">{errors[f.name]}</p>
                                            )}
                                        </motion.div>
                                    );
                                })}

                                {/* Terms */}
                                <motion.div variants={itemVariants} className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        className="mt-1 mr-2 h-4 w-4"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        I agree to the{' '}
                                        <a href="/terms-conditions" className="text-orange-600 hover:text-orange-500">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="/privacypolicy" className="text-orange-600 hover:text-orange-500">Privacy Policy</a>
                                    </label>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Creating Account...
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </motion.div>

                                {/* Divider */}
                                <motion.div variants={itemVariants} className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </motion.div>

                                {/* Google Button */}
                                <motion.div variants={itemVariants}>
                                    <GoogleLoginButton />
                                </motion.div>

                                {/* Login Link */}
                                <motion.div variants={itemVariants} className="text-center mt-6">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link
                                            to="/login"
                                            className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    </p>
                                </motion.div>
                            </form>
                        ) : (
                            // OTP Verification Form
                            <form onSubmit={handleVerifyOtp} className="space-y-2 sm:space-y-6">
                                <motion.div className="text-center">
                                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        We've sent a verification code to<br />
                                        <span className="font-semibold text-orange-600">{tempContactNumber}</span>
                                    </p>
                                </motion.div>

                                <motion.div variants={itemVariants} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        maxLength={6}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full px-4 py-3 h-12 text-center text-2xl tracking-widest rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
                                        autoFocus
                                    />
                                    {errors.otp && (
                                        <p className="text-xs text-red-600 mt-1">{errors.otp}</p>
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Verifying...
                                            </div>
                                        ) : (
                                            'Verify OTP'
                                        )}
                                    </button>
                                </motion.div>

                                <motion.div variants={itemVariants} className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Didn't receive the code?{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // Resend OTP logic here
                                            }}
                                            className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                                        >
                                            Resend
                                        </button>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowOtpModal(false)}
                                        className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        ← Back to registration
                                    </button>
                                </motion.div>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterContent;