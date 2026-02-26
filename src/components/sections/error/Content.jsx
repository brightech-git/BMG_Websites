import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
    AlertCircle,
    Home,
    Search,
    Clock,
    Sparkles
} from 'lucide-react';


const Content = () => {
    const [redirect, setRedirect] = useState(false);
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        // Start countdown for auto-redirect
        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Auto-redirect after 5 seconds
        const redirectTimeout = setTimeout(() => {
            setRedirect(true);
        }, 10000);

        // Cleanup
        return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimeout);
        };
    }, []);

    // Redirect to home after countdown
    if (redirect) {
        return <Navigate to="/home" replace />;
    }

    return (
        <section
            className="error-page min-h-screen flex items-center justify-center p-4"
        >
            <div className="container max-w-4xl mx-auto">
                <div className="error-content text-center text-white animate__animated animate__fadeInUp">

                    {/* Animated Alert Icon */}
                    <div className="mb-6 animate__animated animate__pulse animate__infinite">
                        <AlertCircle className="w-24 h-24 mx-auto text-red-400" strokeWidth={1.5} />
                    </div>

                    {/* Error Code with Sparkles */}
                    <div className="relative mb-4">
                        <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-4 -left-4 animate__animated animate__tada" />
                        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                            404
                        </h1>
                        <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-4 -right-4 animate__animated animate__tada animate__delay-1s" />
                    </div>

                    {/* Main Error Message */}
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Oops! Page Not Found
                    </h2>

                    <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                        The page you're looking for doesn't exist or has been moved.
                        You'll be redirected automatically in {countdown} seconds.
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex items-center justify-center gap-2 mb-8 text-yellow-300">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Redirecting in {countdown} seconds...</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/home"
                            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5" />
                            Back to Homepage
                        </Link>

                        <Link
                            to="/products-page"
                            className="flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300"
                        >
                            <Search className="w-5 h-5" />
                            Browse Products
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="mt-8 text-gray-400 text-sm">
                        Need help? Contact our support team or check our{' '}
                        <Link to="/help" className="text-blue-300 hover:text-blue-200 underline">
                            help center
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Content;