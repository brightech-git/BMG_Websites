import { useEffect, useId, useRef } from "react";
import { ChevronDown } from "lucide-react";

export function FilterDropdown({
    label,
    isOpen,
    onToggle,
    children,
    hasSelection = false,
    width = "w-80",
    direction = "right",
    className = "",
}) {
    const containerRef = useRef(null);
    const triggerRef = useRef(null);
    const panelId = useId();
    const position = direction === "left" ? "right-0" : "left-0";

    useEffect(() => {
        if (!isOpen) return;

        function closeOutside(event) {
            if (!containerRef.current?.contains(event.target)) onToggle();
        }

        document.addEventListener("pointerdown", closeOutside);
        return () => document.removeEventListener("pointerdown", closeOutside);
    }, [isOpen, onToggle]);

    function handleKeyDown(event) {
        if (!isOpen || event.key !== "Escape") return;
        event.stopPropagation();
        onToggle();
        triggerRef.current?.focus();
    }

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`} onKeyDown={handleKeyDown}>
            <button
                ref={triggerRef}
                type="button"
                aria-expanded={isOpen}
                aria-controls={isOpen ? panelId : undefined}
                onClick={onToggle}
                className={`flex min-h-10 items-center gap-2 rounded-xl border px-3 text-sm font-medium text-[var(--brand-hover)] ${
                    hasSelection || isOpen
                        ? "border-orange-300 bg-orange-100"
                        : "border-orange-200 bg-orange-50 hover:bg-orange-100"
                }`}
            >
                {label}
                <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className={isOpen ? "rotate-180" : ""}
                />
            </button>

            {isOpen && (
                <div
                    id={panelId}
                    className={`absolute top-full z-20 mt-2 rounded-xl border border-orange-100 bg-white p-3 shadow-lg ${position} ${width}`}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
