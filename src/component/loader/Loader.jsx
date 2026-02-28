// Loader.jsx
import React from "react";
import "animate.css";
import PropTypes from "prop-types";

const Loader = ({ message = "Processing your order...", size = 16, color = "blue" }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 animate__animated animate__fadeIn"
            role="alert"
            aria-busy="true"
            aria-label="Loading"
        >
            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
                {/* Spinner */}
                <div
                    className={`w-${size} h-${size} border-4 border-t-${color}-500 border-gray-200 rounded-full animate-spin mb-4`}
                ></div>

                {/* Pulsating dots */}
                <div className="flex space-x-1 mb-4">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-600"></span>
                </div>

                {/* Message */}
                <p className="text-gray-700 font-semibold text-center text-lg">
                    {message}
                </p>
            </div>
        </div>
    );
};

Loader.propTypes = {
    message: PropTypes.string,
    size: PropTypes.number, // size in Tailwind units (e.g., 16 => w-16 h-16)
    color: PropTypes.string, // Tailwind color (blue, green, red, etc.)
};

export default Loader;