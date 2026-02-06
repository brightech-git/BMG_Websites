import React, { useState, useEffect } from "react";
import { useCheckPincode } from "../../hook/pincode/usePincode";
import "animate.css";

function PincodeChecker() {
    const [pincode, setPincode] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [animationKey, setAnimationKey] = useState(0); // For forcing re-animation

    // Allowed starting digits for pincode
    const allowedStart = ["5", "6"]; // example: allow pincodes starting with 5 or 6

    const { data, isLoading: loading, isError: error } = useCheckPincode(pincode);

    const handleChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // remove non-digits
        if (value.length > 6) return; // max 6 digits
        if (value && !allowedStart.includes(value[0])) return; // enforce starting digit
        setPincode(value);
    };

    const handleCheck = () => {
        if (pincode.length !== 6) {
            setStatusMessage("Please enter a valid 6-digit pincode!");
            setAnimationKey(prev => prev + 1); // Trigger shake animation
            return;
        }
    };

    useEffect(() => {
        if (!pincode || pincode.length !== 6) {
            setStatusMessage("");
            return;
        }

        if (error) {
            setStatusMessage("Error checking pincode. Please try again.");
            setAnimationKey(prev => prev + 1);
            return;
        }

        if (data) {
            setStatusMessage(data.status ? "Available for shipping" : "Not available for shipping");
            setAnimationKey(prev => prev + 1); // Trigger fade-in animation
        }
    }, [data, error, pincode]);

    // Get animation classes based on status
    const getStatusAnimation = () => {
        if (!statusMessage) return "";

        if (error || pincode.length !== 6) {
            return "animate__animated animate__headShake";
        }

        if (data) {
            return "animate__animated animate__fadeIn";
        }

        return "animate__animated animate__fadeIn";
    };

    return (
        <div className="flex flex-col w-80 font-sans">
            <label className="mb-2 font-semibold text-gray-700 animate__animated animate__fadeIn">
                Check Availability of Your Pincode
            </label>

            <div className="flex mb-2">
                <input
                    type="text"
                    value={pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    className={`flex-1 px-2 py-2 h-10 rounded-l-md bg-[var(--primary-color)] text-[var(--primary-text-color)] border border-gray-300  animate__animated animate__fadeInLeft ${pincode.length !== 6 && statusMessage ? 'animate__headShake' : ''}`}
                    onAnimationEnd={() => {/* Optional: Reset animation state */ }}
                />
                <button
                    onClick={handleCheck}
                    disabled={loading}
                    className={`px-4 py-2 rounded-r-md bg-[var(--primary-hover-color)] hover:bg-[var(--primary-hover-color)] text-white disabled:opacity-50 disabled:cursor-not-allowed animate__animated animate__fadeInRight ${loading ? 'animate__pulse' : ''}`}
                >
                    {loading ? "Checking..." : "Check"}
                </button>
            </div>

            {pincode.length === 6 && statusMessage && (
                <div
                    key={animationKey} // Re-render to trigger animation
                    className={`flex items-center  py-2 px-4  rounded-md border ${data?.status ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                        } ${getStatusAnimation()}`}
                >
                    <span
                        className={`font-medium ${data?.status ? "text-green-700" : "text-red-700"}`}
                    >
                        {statusMessage}
                    </span>
                </div>
            )}

            {/* Optional: Add animation for invalid pincode length */}
            {pincode.length !== 6 && statusMessage && (
                <div
                    key={animationKey}
                    className="flex items-center py-2 px-4 rounded-md border border-yellow-300 bg-yellow-50 animate__animated animate__headShake"
                >
                    <span className="font-medium text-yellow-700">
                        {statusMessage}
                    </span>
                </div>
            )}
        </div>
    );
}

export default PincodeChecker;