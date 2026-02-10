import React from "react";
import { Loader2, Check, X } from "lucide-react";

const SmartButton = ({
    type = "button",
    onClick,
    isLoading = false,
    isDisabled = false,
    variant = "primary", // primary | secondary | danger | success | outline
    size = "md",         // sm | md | lg
    children,
    icon: Icon,
    success = false,     // NEW: Show success state
    error = false,       // NEW: Show error state
    className = "",
    hover=false
}) => {
    const variants = {
        primary: {
            base: "bg-[#041f60] text-white hover:bg-[#f16137] shadow-lg hover:shadow-xl ",
            loading: "bg-[#041f60]/80",
            success: "bg-green-600",
            error: "bg-red-600",
            disabled: "bg-gray-400 text-gray-200 cursor-not-allowed",
        },
        secondary: {
            base: "bg-white border-2 border-[#041f60] text-[#041f60] hover:bg-[var(--white-color)] hover:text-[var(--primary-hover-color)]",
            loading: "bg-gray-100 border-gray-400 text-gray-500",
            success: "bg-green-50 border-green-600 text-green-600",
            error: "bg-red-50 border-red-600 text-red-600",
            disabled: "bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed",
        },
        danger: {
            base: "bg-red-600 text-white hover:bg-red-700",
            loading: "bg-red-500",
            success: "bg-green-600",
            error: "bg-red-700",
            disabled: "bg-red-300 text-red-100 cursor-not-allowed",
        },
        outline: {
            base: "bg-transparent border-2 border-[#f16137] text-[#f16137] hover:bg-[#fff] hover:text-[primary-text-color]",
            loading: "border-gray-400 text-gray-400",
            disabled: "border-gray-300 text-gray-400 cursor-not-allowed",
        },
        arrow :{
            base: "bg-[#041f60] text-white hover:bg-[#f16137] shadow-lg hover:shadow-xl",
            loading: "bg-[#041f60]/80",
            success: "bg-green-600",
            error: "bg-red-600",
            disabled: "bg-gray-400 text-gray-200 cursor-not-allowed",
        },
         success: {
            base: "bg-[#1E5128] border-1 border-[#1E5128] hover:bg-[var(--green-color)] text-[#FFF] ",
            loading: "border-gray-400 text-gray-400",
            disabled: "border-gray-300 text-gray-400 cursor-not-allowed",
        },
        ghost:{
            base: "bg-none border-none  text-[var(--red-color)] ",
            loading: "border-none text-red-800",
            disabled: "border-none text-red-800 cursor-not-allowed",
        }
    };

    const sizes = {
        sm: "px-2 py-1.8 text-xs",
        md: "px-3 py-2 text-xs",
        lg: "px-4 py-2.5 text-sm",
    };

    const { base, loading: loadStyle, success: successStyle, error: errorStyle, disabled } = variants[variant];
    const padding = sizes[size];

    const isActuallyDisabled = isDisabled || isLoading;

    // Animation classes
    const animation = success
        ? "animate-pulse-success"
        : error
            ? "animate-shake"
            : isLoading
                ? "animate-shimmer"
                : "";

    return (
        <>
            {/* Tailwind Animation Keyframes */}
            <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse-success {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .animate-pulse-success { animation: pulse-success 0.6s ease-in-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>

            <button
                type={type}
                onClick={onClick}
                disabled={isActuallyDisabled}
                className={`
                            ${padding}
                            ${isActuallyDisabled ? disabled : success ? successStyle : error ? errorStyle : isLoading ? loadStyle : base}
                            ${className}
                            ${animation}

                            rounded-lg
                            ${hover ? "hover:rounded-full hover:scale-105" : ""}

                            font-semibold
                            flex items-center justify-center gap-2
                            transition-all duration-300 ease-out
                            focus:outline-none focus:ring-4 focus:ring-orange-100
                            disabled:pointer-events-none
                            whitespace-nowrap
                            relative overflow-hidden
                            min-w-fit
                            `}

            >
                {/* Loading State */}
                {isLoading && (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                    </>
                )}

                {/* Success State */}
                {success && !isLoading && (
                    <>
                        <Check className="w-5 h-5" />
                        <span>{children || "Saved!"}</span>
                    </>
                )}

                {/* Error State */}
                {error && !isLoading && !success && (
                    <>
                        <X className="w-5 h-5" />
                        <span>Failed</span>
                    </>
                )}

                {/* Normal State */}
                {!isLoading && !success && !error && (
                    <>
                        {Icon && <Icon className="w-5 h-5" />}
                        <span className="text-xs sm:text-sm">{children}</span>
                    </>
                )}
            </button>
        </>
    );
};

export default SmartButton;