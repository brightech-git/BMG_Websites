// components/modals/LogoutModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { FaSignOutAlt, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import 'animate.css';

const LogoutModal = ({
    isOpen = false,
    onClose = () => { },
    onConfirm = () => { },
    title = "Confirm Logout",
    message = "Are you sure you want to logout?",
    confirmText = "Logout",
    cancelText = "Cancel",
    icon = <FaSignOutAlt className="text-4xl text-[#F97316]" />,
    confirmButtonClass = "bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#F97316]",
    cancelButtonClass = "border-2 border-[#FED7AA] hover:bg-[#FFF7ED] text-[#7C2D12]",
    size = "md",
    closeOnBackdropClick = true,
    showCloseButton = true,
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    const handleBackdropClick = (e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate__animated animate__fadeIn"
            onClick={handleBackdropClick}
        >
            <div
                className={`
                    relative bg-white rounded-2xl shadow-2xl border-2 border-[#FED7AA] 
                    animate__animated animate__fadeInUp animate__faster
                    ${sizeClasses[size]} w-full
                `}
            >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-1 bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full"></div>
                </div>

                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-[#FFF7ED] text-[#9A3412] hover:text-[#F97316] transition-all duration-300 hover:rotate-90 flex items-center justify-center"
                    >
                        <FaTimes size={16} />
                    </button>
                )}

                <div className="p-6 text-center">
                    <div className="mb-4 animate__animated animate__pulse animate__infinite animate__slow">
                        <div className="w-20 h-20 mx-auto bg-[#FFF7ED] rounded-full flex items-center justify-center border-2 border-[#FED7AA]">
                            {icon}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#7C2D12] mb-2 animate__animated animate__fadeInDown">
                        {title}
                    </h3>

                    <p className="text-sm text-[#9A3412] mb-6 animate__animated animate__fadeInUp animate__delay-1s">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className={`
                                flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                                hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20
                                animate__animated animate__fadeInLeft
                                ${cancelButtonClass}
                            `}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`
                                flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white
                                transition-all duration-300 hover:scale-105 hover:shadow-lg
                                focus:outline-none focus:ring-2 focus:ring-[#F97316]/20
                                animate__animated animate__fadeInRight
                                ${confirmButtonClass}
                            `}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <FaSignOutAlt size={14} />
                                {confirmText}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-4 text-center">
                    <p className="text-[10px] text-[#9A3412]/60 animate__animated animate__fadeIn">
                        This action will end your current session
                    </p>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

// Destructive variant
export const DestructiveLogoutModal = (props) => (
    <LogoutModal
        {...props}
        title={props.title || "⚠️ Warning: Logout"}
        message={props.message || "Are you sure you want to logout? You'll need to login again to access your account."}
        confirmButtonClass={props.confirmButtonClass || "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"}
        icon={props.icon || <FaExclamationTriangle className="text-4xl text-red-500" />}
    />
);

export default LogoutModal;