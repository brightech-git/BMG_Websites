// FilterDropdown.jsx — add this
import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";


export const FilterDropdown = ({
    label, isOpen, onToggle, children,
    width = 'w-80', direction = 'right', className = ''
}) => {
    const positionClass = direction === 'left' ? 'right-0' : 'left-0';
    const containerRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return; // only listen when open

        const h = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onToggle(); // close it
            }
        };

        // Small delay so the opening click doesn't immediately trigger close
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", h);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", h);
        };
    }, [isOpen]); // ← re-run only when open state changes

    return (
        <div
            ref={containerRef}
            className={`relative inline-block  border border-[var(--primary-hover-color)] bg-[var(--primary-card-color)] rounded-full  ${className}`}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-hover-color)] transition-colors"
            >
                {label}
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className={`absolute top-full ${positionClass} mt-2 p-4 z-20 bg-white shadow-lg border border-gray-200 rounded-md ${width} animate__animated animate__fadeIn`}>
                    {children}
                </div>
            )}
        </div>
    );
};