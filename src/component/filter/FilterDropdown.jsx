// components/filters/FilterDropdown.jsx
import { ChevronDown } from "lucide-react";

export const FilterDropdown = ({
    label,
    isOpen,
    onToggle,
    children,
    width = 'w-80',
    direction = 'right', // 'right' or 'left'
    className = ''
}) => {
    const positionClass = direction === 'left' ? 'right-0' : 'left-0';

    return (
        <div className={`relative border border-[var(--primary-hover-color)] bg-[var(--primary-card-color)] rounded-full ${className}`}>
            <button
                onClick={onToggle}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
            >
                {label}
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className={`absolute top-full ${positionClass} mt-2 p-4  z-50 bg-white shadow-lg border border-gray-200 rounded-md ${width} animate__animated animate__fadeIn`}>
                    {children}
                </div>
            )}
        </div>
    );
};