import React, { useState, useEffect } from "react";
import "animate.css";
import SmartButton from "../ui/SmartButton";
import { ChevronDown } from "lucide-react";
import { MapPin } from "lucide-react";

const DeliveryPincodeHeader = () => {
    // Load initial pincode from localStorage
    const [pincode, setPincode] = useState(localStorage.getItem("userPincode") || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempPincode, setTempPincode] = useState(pincode);
    const [statusMessage, setStatusMessage] = useState("");
    const [animationKey, setAnimationKey] = useState(0);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsSmallScreen(width < 992); // lg breakpoint
            setIsMobile(width < 768); // md breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Save pincode to localStorage
    const savePincode = (newPincode) => {
        localStorage.setItem("userPincode", newPincode);
        setPincode(newPincode);
        setStatusMessage("Pincode updated successfully!");
        setAnimationKey(prev => prev + 1);

        // Close modal after success
        setTimeout(() => {
            setIsModalOpen(false);
            setStatusMessage("");
        }, 1500);
    };

    // Simulate pincode validation (replace with your actual API call)
    const validatePincode = async (pincode) => {
        // This is a mock validation - replace with your actual API
        if (pincode.length !== 6) {
            throw new Error("Please enter a valid 6-digit pincode");
        }

        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock validation logic - pincodes starting with 5 or 6 are valid
        const allowedStarts = ["5", "6"];
        const isValid = allowedStarts.includes(pincode[0]);

        return {
            valid: isValid,
            message: isValid
                ? "Available for delivery in your area!"
                : "Sorry, we don't deliver to this pincode yet"
        };
    };

    const handleOpenModal = () => {
        setTempPincode(pincode);
        setStatusMessage("");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setStatusMessage("");
        setTempPincode(pincode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (tempPincode.length !== 6) {
            setStatusMessage("Please enter a valid 6-digit pincode");
            setAnimationKey(prev => prev + 1);
            return;
        }

        try {
            setStatusMessage("Checking pincode availability...");
            const result = await validatePincode(tempPincode);

            if (result.valid) {
                savePincode(tempPincode);
            } else {
                setStatusMessage(result.message);
                setAnimationKey(prev => prev + 1);
            }
        } catch (error) {
            setStatusMessage(error.message || "Error checking pincode");
            setAnimationKey(prev => prev + 1);
        }
    };

   
 

    return (
        <>
            {/* Header Pincode Display - Different layout for small screens */}
            {isSmallScreen ? (
                // Small screen: Single line compact view
                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 px-2 py-1"
                >
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="text-sm font-medium whitespace-nowrap truncate max-w-[120px]">
                        {pincode ? `Deliver to ${pincode}` : "Set Delivery Pincode"}
                    </span>
                    <ChevronDown
                        size={14}
                        className="text-gray-400 flex-shrink-0 transition-transform duration-300"
                    />
                </button>
            ) : (
                // Normal screen: Full view
                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 border border-gray-300 rounded-lg px-2 py-2 w-50 h-[45px] hover:border-amber-400 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                    <MapPin size={14} className="text-amber-600 flex-shrink-0" />
                    <div className="flex-1 text-left">
                            <div className="text-xs text-[var(--primary-hover-color)]">Where to Deliver?</div>
                        <div className="text-sm font-semibold ">
                            {pincode ? `Deliver to ${pincode}` : "Enter your pincode"}
                        </div>
                    </div>
                    <ChevronDown
                        size={14}
                        className="text-gray-400 flex-shrink-0 transition-transform duration-300"
                    />
                </button>
            )}

            {/* Modal Overlay */}
            {isModalOpen && (
             
                <div
                    className={`fixed inset-0 z-50 ${isMobile ? 'flex items-end bottom-0' : 'flex items-start justify-center p-4 top-[90px]'} animate__animated animate__fadeIn animate__faster `}
                    onClick={handleCloseModal}
                >
                

                    {/* Modal Content */}
                    <div
                        className={`relative bg-white rounded-lg w-full max-w-md ${isMobile
                            ? 'rounded-b-none animate__animated animate__slideInUp animate__faster'
                            : 'animate__animated animate__zoomIn animate__faster shadow-2xl'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Mobile handle indicator */}
                        {isMobile && (
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                            </div>
                        )}

                        <div className={`${isMobile ? 'p-2 pb-2' : 'p-3'}`}>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                    <div className="bg-amber-50 rounded-full">
                                        <MapPin size={15} className="text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 ">Delivery Pincode</h3>
                        
                                    </div>
                                </div>
                                {!isMobile && (
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-600 text-xl p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Close"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>

                            {/* Pincode Input Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-2">
                                  
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={tempPincode}
                                        onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder="e.g., 600069"
                                        className="w-full border  h-[45px] bg-[var(--primary-color)] text-[var(--primary-text-color)] border-gray-300 rounded-lg px-2 py-2 text-base focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 transition-all duration-300"
                                        autoFocus
                                    />
                                    
                                </div>

                                {/* Status Message */}
                                {statusMessage && (
                                    <div
                                        key={animationKey}
                                        className={`mb-2 p-2 rounded-lg border animate__animated animate__fadeIn ${statusMessage.includes("successfully") || statusMessage.includes("Available")
                                            ? "border-green-200 bg-green-50 text-green-700"
                                            : statusMessage.includes("Checking")
                                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                                : "border-red-200 bg-red-50 text-red-700"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {statusMessage.includes("successfully") || statusMessage.includes("Available") ? (
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-green-600 text-sm">✓</span>
                                                </div>
                                            ) : statusMessage.includes("Checking") ? (
                                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-blue-600 text-sm animate-spin">⟳</span>
                                                </div>
                                            ) : (
                                                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-red-600 text-sm">✗</span>
                                                </div>
                                            )}
                                            <span className="text-xs">{statusMessage}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <SmartButton
                                        type="button"
                                        onClick={handleCloseModal}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        Cancel
                                    </SmartButton>
                                    <SmartButton
                                        type="submit"
                                        variant="primary"
                                        className="flex-1"
                                        loading={statusMessage.includes("Checking")}
                                        disabled={statusMessage.includes("Checking")}
                                    >
                                        {statusMessage.includes("Checking") ? "Checking..." : "Check & Update"}
                                    </SmartButton>
                                </div>
                            </form>

                         
                        </div>
                    </div>
              
                </div>
            )}
        </>
    );
};

export default DeliveryPincodeHeader;