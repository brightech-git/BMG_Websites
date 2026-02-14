"use client";

import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
// Icon mapping for status icons
const iconMap = {
    'clock': Clock,
    'shopping-bag': CheckCircle,
    'loader': Clock,
    'box': CheckCircle,
    'package': CheckCircle,
    'truck': CheckCircle,
    'map-pin': CheckCircle,
    'home': CheckCircle,
    'x-circle': XCircle
};

const HorizontalTimeline = ({
    statuses,
    currentStatus,
    loading = false,
    error = null,
    emptyMessage = "No data available",
    onRetry,
    getIcon,
}) => {
    const timelineRefs = useRef([]);

    // Check if current status is cancelled
    const isCancelled = currentStatus?.toUpperCase() === "CANCELLED";

    // Filter statuses - only show cancelled if current status is cancelled
    const filteredStatuses = isCancelled
        ? statuses // Show all statuses including cancelled
        : statuses?.filter(status =>
            !status.key.toLowerCase().includes("cancelled") &&
            !status.label.toLowerCase().includes("cancelled")
        );

    const sortedStatuses = [...(filteredStatuses || [])].sort(
        (a, b) => a.sequence - b.sequence
    );

    const currentIndex = sortedStatuses.findIndex(
        (s) => s.key === currentStatus
    );

    // Get appropriate icon based on status
    const getStatusIcon = (status, index) => {
        const isCancelledStatus = status.key === currentStatus && isCancelled;

        if (isCancelledStatus) {
            return XCircle;
        }

        if (index < currentIndex) {
            return CheckCircle;
        }

        if (index === currentIndex) {
            return Clock;
        }

        // Use icon from status or fallback
        const IconComponent = iconMap[status.icon] || Clock;
        return IconComponent;
    };

    // Get status color scheme
    const getStatusColors = (index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isCancelledStatus = sortedStatuses[index]?.key === currentStatus && isCancelled;

        if (isCancelledStatus) {
            return {
                bg: "bg-red-500",
                border: "border-red-500",
                text: "text-red-600",
                light: "bg-red-100",
                gradient: "from-red-500 to-red-600",
                ring: "ring-red-500",
                pulse: "bg-red-700",
                line: "bg-gradient-to-r from-red-500 to-red-600"
            };
        }

        if (isPast) {
            return {
                bg: "bg-emerald-500",
                border: "border-emerald-500",
                text: "text-emerald-600",
                light: "bg-emerald-100",
                gradient: "from-emerald-500 to-emerald-600",
                ring: "ring-emerald-500",
                pulse: "bg-emerald-700",
                line: "bg-gradient-to-r from-emerald-500 to-emerald-600"
            };
        }

        if (isCurrent) {
            return {
                bg: "bg-white",
                border: "border-emerald-500",
                text: "text-emerald-600",
                light: "bg-emerald-50",
                gradient: "from-emerald-500 to-emerald-600",
                ring: "ring-emerald-500",
                pulse: "bg-emerald-700",
                line: "bg-gradient-to-r from-emerald-500 to-emerald-600"
            };
        }

        return {
            bg: "bg-white",
            border: "border-gray-300",
            text: "text-gray-400",
            light: "bg-gray-100",
            gradient: "from-gray-400 to-gray-500",
            ring: "ring-gray-400",
            pulse: "bg-gray-600",
            line: "bg-gradient-to-r from-gray-300 to-gray-400"
        };
    };

    // Get connector color for lines
    const getConnectorColor = (index) => {
        const isPast = index < currentIndex;
        const isCancelledStatus = isCancelled && currentIndex !== -1;

        if (isCancelledStatus) {
            // For cancelled status, all connectors up to current index should be red
            if (index < currentIndex) {
                return "bg-gradient-to-r from-red-500 to-red-600";
            }
        } else {
            // Normal flow - green for past steps
            if (isPast) {
                return "bg-gradient-to-r from-emerald-500 to-emerald-600";
            }
        }

        return "bg-gradient-to-r from-gray-300 to-gray-400";
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="w-full px-4 py-8">
                <div className="flex items-center justify-center gap-4 md:gap-8">
                    {Array.from({ length: 4 }).map((_, index) => {
                        const isLast = index === 3;

                        return (
                            <div
                                key={index}
                                className="relative flex flex-1 flex-col items-center"
                            >
                                {!isLast && (
                                    <div className="absolute top-4 left-1/2 w-full">
                                        <div className="h-[3px] w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
                                    </div>
                                )}

                                <div className="relative z-10">
                                    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                                </div>

                                <div className="mt-3 h-3 w-20 animate-pulse rounded bg-gray-200" />
                                <div className="mt-1 h-2 w-16 animate-pulse rounded bg-gray-100" />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full px-4 py-8">
                <div className="animate__animated animate__shakeX rounded-lg bg-red-50 p-6 text-center">
                    <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
                    <p className="text-sm font-medium text-red-700">{error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-4 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                            <span>Retry</span>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Empty state
    if (!sortedStatuses?.length) {
        return (
            <div className="w-full px-4 py-8">
                <div className="animate__animated animate__fadeIn rounded-lg bg-gray-50 p-8 text-center">
                    <Clock className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 py-6">
            {/* Desktop Horizontal Layout */}
            <div className="hidden md:flex md:items-center md:justify-center">
                {sortedStatuses.map((status, index) => {
                    const Icon = getStatusIcon(status, index);
                    const colors = getStatusColors(index);
                    const isPast = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const isLast = index === sortedStatuses.length - 1;
                    const isCancelledStatus = status.key === currentStatus && isCancelled;

                    // Determine connector color
                    let connectorColor = "bg-gradient-to-r from-gray-300 to-gray-400";
                    if (isCancelled) {
                        // For cancelled status, color all connectors up to current index red
                        if (index < currentIndex) {
                            connectorColor = "bg-gradient-to-r from-red-500 to-red-600";
                        }
                    } else {
                        // Normal flow - green for past steps
                        if (isPast) {
                            connectorColor = "bg-gradient-to-r from-emerald-500 to-emerald-600";
                        }
                    }

                    return (
                        <div
                            key={status.key}
                            ref={el => timelineRefs.current[index] = el}
                            className="relative flex flex-1 flex-col items-center"
                        >
                            {/* Connector line */}
                            {!isLast && (
                                <div className="absolute top-5 left-1/2 w-full">
                                    <div className="h-[3px] w-full bg-gray-200">
                                        <div
                                            className={clsx(
                                                "h-full transition-all duration-1000 ease-out",
                                                (isCancelled && index < currentIndex) || (!isCancelled && isPast)
                                                    ? `w-full ${connectorColor}`
                                                    : "w-0"
                                            )}
                                            style={{
                                                animation: (isCancelled && index < currentIndex) || (!isCancelled && isPast)
                                                    ? `lineFill 0.8s ease-out`
                                                    : 'none'
                                            }}
                                        />
                                    </div>
                                    {/* Glow effect for active connectors */}
                                    {((isCancelled && index < currentIndex) || (!isCancelled && isPast)) && (
                                        <div className={clsx(
                                            "absolute top-0 left-0 h-full w-full blur-sm opacity-30",
                                            isCancelled ? "bg-red-500" : "bg-emerald-500"
                                        )} />
                                    )}
                                </div>
                            )}

                            {/* Icon */}
                            <div
                                className={clsx(
                                    "relative z-20 flex h-10 w-10 transform items-center justify-center rounded-full border-2 transition-all duration-300",
                                    colors.bg,
                                    colors.border,
                                    (isCurrent || isCancelledStatus) && "scale-110 shadow-lg",
                                    isCurrent && !isCancelledStatus && "ring-4 ring-emerald-500/20 current-step-animate",
                                    isCancelledStatus && "ring-4 ring-red-500/20 current-step-animate"
                                )}
                            >
                                <Icon className={clsx(
                                    "h-5 w-5",
                                    isPast || isCancelledStatus || isCurrent ? "text-white" : "text-gray-400",
                                    isCurrent && !isCancelledStatus && "text-emerald-600"
                                )} />

                                {/* Pulse animation */}
                                {(isPast || isCancelledStatus) && (
                                    <div className="absolute inset-0">
                                        <div className={clsx(
                                            "h-full w-full animate-ping rounded-full opacity-30",
                                            isCancelledStatus ? "bg-red-500" : "bg-emerald-500"
                                        )} />
                                    </div>
                                )}
                            </div>

                            {/* Label and date */}
                            <div className="mt-3 text-center">
                                <span className={clsx(
                                    "block text-xs font-semibold transition-all duration-300",
                                    colors.text,
                                    (isCurrent || isCancelledStatus) && "scale-105 font-bold"
                                )}>
                                    {status.label}
                                </span>
                                {status.date && (
                                    <span className="mt-1 block text-[10px] text-gray-500">
                                        {status.date}
                                    </span>
                                )}
                            </div>

                            {/* Current indicator */}
                            {(isCurrent || isCancelledStatus) && (
                                <span className={clsx(
                                    "absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider animate__animated animate__pulse animate__infinite",
                                    isCancelledStatus ? "text-red-500" : "text-emerald-600"
                                )}>
                                    {isCancelledStatus ? 'Cancelled' : 'Current'}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile Vertical Layout */}
            <div className="md:hidden">
                <div className="flex flex-col gap-6">
                    {sortedStatuses.map((status, index) => {
                        const Icon = getStatusIcon(status, index);
                        const colors = getStatusColors(index);
                        const isPast = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isLast = index === sortedStatuses.length - 1;
                        const isCancelledStatus = status.key === currentStatus && isCancelled;

                        // Determine connector color for vertical
                        let connectorColor = "bg-gradient-to-b from-gray-300 to-gray-400";
                        if (isCancelled) {
                            if (index < currentIndex) {
                                connectorColor = "bg-gradient-to-b from-red-500 to-red-600";
                            }
                        } else {
                            if (isPast) {
                                connectorColor = "bg-gradient-to-b from-emerald-500 to-emerald-600";
                            }
                        }

                        return (
                            <div
                                key={status.key}
                                ref={el => timelineRefs.current[index] = el}
                                className="relative flex gap-4"
                            >
                                {/* Vertical line connector */}
                                {!isLast && (
                                    <div className="absolute left-5 top-8 h-full w-[2px] -translate-x-1/2 transform">
                                        <div className="h-full w-full bg-gray-200">
                                            <div
                                                className={clsx(
                                                    "h-full w-full transition-all duration-1000 ease-out",
                                                    (isCancelled && index < currentIndex) || (!isCancelled && isPast)
                                                        ? `w-full ${connectorColor}`
                                                        : "h-0"
                                                )}
                                                style={{
                                                    animation: (isCancelled && index < currentIndex) || (!isCancelled && isPast)
                                                        ? `lineFillVertical 0.8s ease-out`
                                                        : 'none'
                                                }}
                                            />
                                        </div>
                                        {/* Glow effect for vertical connectors */}
                                        {((isCancelled && index < currentIndex) || (!isCancelled && isPast)) && (
                                            <div className={clsx(
                                                "absolute top-0 left-0 h-full w-full blur-sm opacity-30",
                                                isCancelled ? "bg-red-500" : "bg-emerald-500"
                                            )} />
                                        )}
                                    </div>
                                )}

                                {/* Icon */}
                                <div className="relative z-10">
                                    <div
                                        className={clsx(
                                            "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                                            colors.bg,
                                            colors.border,
                                            (isCurrent || isCancelledStatus) && "scale-110 shadow-lg",
                                            isCurrent && !isCancelledStatus && "ring-4 ring-emerald-500/20",
                                            isCancelledStatus && "ring-4 ring-red-500/20"
                                        )}
                                    >
                                        <Icon className={clsx(
                                            "h-5 w-5",
                                            isPast || isCancelledStatus || isCurrent ? "text-white" : "text-gray-400",
                                            isCurrent && !isCancelledStatus && "text-emerald-600"
                                        )} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="flex flex-col">
                                        <span className={clsx(
                                            "text-sm font-semibold",
                                            colors.text
                                        )}>
                                            {status.label}
                                        </span>
                                        {status.date && (
                                            <span className="text-xs text-gray-500">
                                                {status.date}
                                            </span>
                                        )}
                                        {status.description && (
                                            <span className="mt-1 text-xs text-gray-600">
                                                {status.description}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status badge */}
                                    {(isCurrent || isCancelledStatus) && (
                                        <span className={clsx(
                                            "mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-bold uppercase",
                                            isCancelledStatus
                                                ? "bg-red-100 text-red-700"
                                                : "bg-emerald-100 text-emerald-700"
                                        )}>
                                            {isCancelledStatus ? 'Cancelled' : 'In Progress'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Global styles for animations */}
            <style jsx>{`
                @keyframes lineFill {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                
                @keyframes lineFillVertical {
                    from { height: 0%; }
                    to { height: 100%; }
                }
                
                .animate-shimmer {
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite linear;
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .current-step-animate {
                    animation: pulse-ring 2s infinite;
                }
                
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                
                .current-step-animate:has(.bg-red-500) {
                    animation: pulse-ring-red 2s infinite;
                }
                
                @keyframes pulse-ring-red {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>
        </div>
    );
};

export default HorizontalTimeline;