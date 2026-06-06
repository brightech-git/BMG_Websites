import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { login, clearError } from "../../../redux/slices/userSlice";
import GoogleLoginButton from "../register/GoogleLoginButton";
import loginImage from '../../../assets/images/login.png';

const LoginContent = () => {
    const [contactOrEmailOrUsername, setContact] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!contactOrEmailOrUsername || !password) {
            setLocalError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const result = await dispatch(
                login({
                    contactOrEmailOrUsername,
                    password,
                })
            ).unwrap();

            if (result?.token) {
                setContact("");
                setPassword("");
                setLocalError(null);

                const lastVisited = JSON.parse(localStorage.getItem("lastVisited") || "{}");
                const redirectTo = lastVisited?.from || location.state?.from || "/";

                navigate(redirectTo);
            }
        } catch (err) {
            setLocalError(err || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (localError) {
            const timer = setTimeout(() => setLocalError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [localError]);

    useEffect(() => {
        dispatch(clearError());
    }, [location.pathname, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            const lastVisited = localStorage.getItem("lastVisited") || "/";
            navigate(lastVisited !== "/login" ? lastVisited : "/");
        }
    }, [isAuthenticated, navigate]);

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

    // Floating animation for illustration
    const floatingAnimation = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className=" flex bg-gradient-to-br from-orange-50 via-white to-orange-100">
            {/* Left Side - Illustration/Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-1/2 relative overflow-hidden  p-2 flex-col justify-between"
            >
                {/* Background Pattern */}
                <div>
                    <img src={loginImage} style={{ objectFit: 'cover' }} />
                </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-md w-full"

                >
                    {/* Main Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 border border-orange-100"
                    >

                        {/* Error Message */}
                        <AnimatePresence mode="wait">
                            {localError && (
                                <motion.div
                                    variants={errorVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3"

                                >

                                    <span className="text-sm text-red-700">{localError}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <motion.div
                            variants={itemVariants}
                            className="text-center mb-8"
                        >
                            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                                Sign In
                            </h2>
                            <p className="mt-1 text-xs text-gray-600">
                                Welcome back! Please enter your details
                            </p>
                        </motion.div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-6">
                            {/* Mobile Number Field */}
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter your mobile number"
                                        value={contactOrEmailOrUsername}
                                        onChange={(e) => setContact(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 h-10  rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none"
                                    />
                                </div>
                            </motion.div>

                            {/* Password Field */}
                            <motion.div variants={itemVariants}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 h-10 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none pr-12"
                                    />
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
                                </div>
                            </motion.div>

                            {/* Forgot Password */}
                            <motion.div
                                variants={itemVariants}
                                className="flex items-center justify-end"
                            >
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 text-white mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Signing in...
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </motion.div>

                            {/* Divider */}
                            <motion.div
                                variants={itemVariants}
                                className="relative my-6"
                            >
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

                            {/* Register Link */}
                            <motion.div
                                variants={itemVariants}
                                className="text-center mt-6"
                            >
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/register"
                                        className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                                    >
                                        Create Account
                                    </Link>
                                </p>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginContent;