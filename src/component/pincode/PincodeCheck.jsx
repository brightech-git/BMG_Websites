import React, { useState, useEffect } from "react";
import { useCheckPincode } from "../../hook/pincode/usePincode";
import "animate.css";

function PincodeChecker() {
    const [pincode, setPincode] = useState("");
    const [storedPincode, setStoredPincode] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    // Allowed starting digits for pincode
    const allowedStart = ["5", "6"];

    const { data, isLoading: loading, isError: error } = useCheckPincode(pincode);

    // Load stored pincode on initial render
    useEffect(() => {
        const savedPincode = localStorage.getItem("userPincode");
        if (savedPincode) {
            setStoredPincode(savedPincode);
            // Automatically check the saved pincode
            setPincode(savedPincode);
        }
    }, []);

    const handleChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // remove non-digits
        if (value.length > 6) return; // max 6 digits
        if (value && !allowedStart.includes(value[0])) return; // enforce starting digit
        setPincode(value);
    };

    const handleCheck = () => {
        if (pincode.length !== 6) {
            setStatusMessage("Please enter a valid 6-digit pincode!");
            setAnimationKey(prev => prev + 1);
            return;
        }

        setIsChecking(true);
        // The actual check will happen in the useEffect when pincode changes
    };

    const handleSavePincode = () => {
        if (pincode.length !== 6) {
            setStatusMessage("Please enter a valid 6-digit pincode!");
            setAnimationKey(prev => prev + 1);
            return;
        }

        // Save to localStorage
        localStorage.setItem("userPincode", pincode);
        setStoredPincode(pincode);
        setShowUpdateForm(false);

        // Show success message
        setStatusMessage(`Pincode ${pincode} saved successfully!`);
        setAnimationKey(prev => prev + 1);
    };

    const handleUpdateClick = () => {
        setShowUpdateForm(true);
        setPincode(storedPincode || "");
        setStatusMessage("");
    };

    const handleCancelUpdate = () => {
        setShowUpdateForm(false);
        setPincode(storedPincode || "");
        setStatusMessage("");
    };

    useEffect(() => {
        if (!pincode || pincode.length !== 6 || !isChecking) return;

        if (error) {
            setStatusMessage("Error checking pincode. Please try again.");
            setAnimationKey(prev => prev + 1);
            setIsChecking(false);
            return;
        }

        if (data) {
            const message = data.status ?
                `Available for shipping to ${pincode}` :
                `Not available for shipping to ${pincode}`;
            setStatusMessage(message);
            setAnimationKey(prev => prev + 1);
            setIsChecking(false);
        }
    }, [data, error, pincode, isChecking]);

    // Get animation classes based on status
    const getStatusAnimation = () => {
        if (!statusMessage) return "";

        if (error || pincode.length !== 6) {
            return "animate__animated animate__headShake";
        }

        if (data || statusMessage.includes("saved successfully")) {
            return "animate__animated animate__fadeIn";
        }

        return "animate__animated animate__fadeIn";
    };

    // Render delivery info if we have a stored pincode and not showing update form
    if (storedPincode && !showUpdateForm) {
        return (
            <div className="flex flex-col w-80 font-sans animate__animated animate__fadeIn">
                <div className="mb-2 font-semibold text-gray-700">
                    Delivery Information
                </div>

                <div className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-gray-50">
                    <div>
                        <div className="text-sm text-gray-600">Deliver to {storedPincode}</div>
                        {data?.status ? (
                            <div className="text-green-600 font-medium mt-1">
                                ✓ Available for shipping
                            </div>
                        ) : (
                            <div className="text-red-600 font-medium mt-1">
                                 Not available for shipping
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleUpdateClick}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                    >
                        Change
                    </button>
                </div>

            </div>
        );
    }

    // Render the pincode input form (for new users or when updating)
    return (
        <div className="flex flex-col w-80 font-sans">
            <label className="mb-2 font-semibold text-gray-700 animate__animated animate__fadeIn">
                {storedPincode ? "Update Your Delivery Pincode" : "Check Availability of Your Pincode"}
            </label>

            <div className="flex mb-2">
                <input
                    type="text"
                    value={pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    className={`flex-1 px-2 py-2 h-10 rounded-l-md bg-[var(--primary-color)] text-[var(--primary-text-color)] border border-gray-300 animate__animated animate__fadeInLeft ${pincode.length !== 6 && statusMessage ? 'animate__headShake' : ''}`}
                />
                <button
                    onClick={showUpdateForm ? handleSavePincode : handleCheck}
                    disabled={loading}
                    className={`px-4 py-2 rounded-r-md bg-[var(--primary-hover-color)] hover:bg-[var(--primary-hover-color)] text-white disabled:opacity-50 disabled:cursor-not-allowed animate__animated animate__fadeInRight ${loading ? 'animate__pulse' : ''}`}
                >
                    {loading ? "Checking..." : (showUpdateForm ? "Save" : "Check")}
                </button>
            </div>

            {/* {showUpdateForm && (
                <div className="flex gap-2 mb-3">
                    <button
                        onClick={handleCancelUpdate}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSavePincode}
                        className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    >
                        Save & Update
                    </button>
                </div>
            )} */}

            {/* Status messages */}
            {pincode.length === 6 && statusMessage && (
                <div
                    key={animationKey}
                    className={`flex items-center py-2 px-4 rounded-md border ${statusMessage.includes("Available") || statusMessage.includes("saved successfully") ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                        } ${getStatusAnimation()}`}
                >
                    <span
                        className={`font-medium ${statusMessage.includes("Available") || statusMessage.includes("saved successfully") ? "text-green-700" : "text-red-700"}`}
                    >
                        {statusMessage}
                    </span>
                </div>
            )}

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

            {/* Only show save option after successful check (for new users) */}
            {data && !storedPincode && !showUpdateForm && data.status && (
                <button
                    onClick={handleSavePincode}
                    className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors animate__animated animate__fadeInUp"
                >
                    ✓ Save this pincode for future
                </button>
            )}
        </div>
    );
}

export default PincodeChecker;