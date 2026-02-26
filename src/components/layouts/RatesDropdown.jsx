import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import silvericon from '../../assets/icons/silverIcon.png';
import goldicon from '../../assets/icons/goldIcon.png';

// Function to format metal names and display types
const formatMetalDisplay = (key, value) => {
    const metalTypes = {
        "gold_916": { display: "Gold", unit: "22KT/1g", label: "Gold (22KT) - ₹" },
        "gold_995": { display: "Gold", unit: "24KT/1g", label: "Gold (24KT) - ₹" },
        "silver": { display: "Silver", unit: "/1g", label: "Silver - ₹" },
        "gold_22kt": { display: "Gold", unit: "22KT/1g", label: "Gold (22KT) - ₹" },
        "gold_24kt": { display: "Gold", unit: "24KT/1g", label: "Gold (24KT) - ₹" }
    };

    const lowerKey = key.toLowerCase();

    // Find matching key
    for (const [metalKey, data] of Object.entries(metalTypes)) {
        if (lowerKey.includes(metalKey) || lowerKey.includes(data.display.toLowerCase())) {
            return {
                ...data,
                value,
                originalKey: key
            };
        }
    }

    // Default fallback
    return {
        display: key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        unit: "/1g",
        label: `${key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} - ₹`,
        value,
        originalKey: key
    };
};

const getMetalIcon = (key) => {
    const k = key.toLowerCase();
    if (k.includes("silver")) return silvericon;
    if (k.includes("gold")) return goldicon;
    return goldicon;
};

const RatesDropdown = ({ ratesData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    if (!ratesData || Object.keys(ratesData).length === 0) {
        return null;
    }

    // Process all rates
    const allRates = Object.entries(ratesData).map(([key, value]) => ({
        ...formatMetalDisplay(key, value),
        key
    }));

    // Separate gold and silver rates
    const goldRates = allRates.filter(rate =>
        rate.originalKey.toUpperCase().includes("gold")
    );
    const silverRates = allRates.filter(rate =>
        rate.originalKey.toUpperCase().includes("silver")
    );

    // Get top 2 rates for collapsed view (prefer 22KT and 24KT gold, then silver)
    const getInitialRates = () => {
        const rates = [...allRates];

        // Try to find 22KT and 24KT gold
        const gold22KT = rates.find(rate =>
            rate.unit.includes("22KT") || rate.originalKey.toUpperCase().includes("916")
        );
        const gold24KT = rates.find(rate =>
            rate.unit.includes("24KT") || rate.originalKey.toUpperCase().includes("995") ||
            rate.originalKey.toUpperCase().includes("24kt")
        );
        const silver = rates.find(rate =>
            rate.originalKey.toUpperCase().includes("silver")
        );

        const initialRates = [];
        if (gold22KT) initialRates.push(gold22KT);
        if (gold24KT) initialRates.push(gold24KT);
        if (initialRates.length < 2 && silver) initialRates.push(silver);

        // If we still don't have 2, fill with whatever's available
        while (initialRates.length < 2 && initialRates.length < rates.length) {
            const remainingRate = rates.find(rate => !initialRates.includes(rate));
            if (remainingRate) initialRates.push(remainingRate);
        }

        return initialRates;
    };

    const initialRates = getInitialRates();
    const displayRates = showAll ? allRates : initialRates;

    return (
        <div className="relative">
            {/* Main Rates Display - Always Visible */}
            <div className="flex items-center gap-2">
                {displayRates.map((rate, index) => (
                    <motion.div
                        key={rate.key}
                        className="flex items-center gap-2 bg-gradient-to-r from-white to-gray-50 px-3 py-1.5 rounded-full shadow-sm border border-gray-200"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <img
                            src={getMetalIcon(rate.originalKey)}
                            alt={rate.display}
                            className="w-4 h-4 animate-pulse"
                        />
                        <span className="font-semibold text-xs text-[var(--primary-text-color)] tracking-tight">
                            {rate.display} {rate.unit} - ₹{rate.value}
                        </span>
                    </motion.div>
                ))}

                {/* Dropdown Toggle */}
                {allRates.length > 2 && (
                    <motion.button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-amber-100 px-3 py-1.5 rounded-full shadow-sm border border-amber-200 hover:from-amber-100 hover:to-amber-200 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="text-xs font-semibold text-amber-800">
                            {showAll ? "Show Less" : `+${allRates.length - 2} more`}
                        </span>
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={14} className="text-amber-700" />
                        </motion.div>
                    </motion.button>
                )}
            </div>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop for mobile */}
                        <div
                            className="fixed inset-0 z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Content */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 min-w-[300px] max-w-md"
                        >
                            {/* Header */}
                            <div className="mb-3">
                                <h3 className="font-bold text-lg text-[var(--primary-text-color)]">
                                    Live Metal Rates
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Today's market rates per gram
                                </p>
                            </div>

                            {/* Gold Rates Section */}
                            {goldRates.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
                                        <h4 className="font-semibold text-sm text-gray-700">Gold Rates</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {goldRates.map(rate => (
                                            <div key={rate.key} className="flex items-center justify-between p-2 hover:bg-amber-50 rounded-lg transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={goldicon}
                                                        alt="Gold"
                                                        className="w-5 h-5"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {rate.unit.includes("22KT") ? "22 Karat Gold" :
                                                            rate.unit.includes("24KT") ? "24 Karat Gold" :
                                                                "Gold"}
                                                    </span>
                                                </div>
                                                <span className="font-bold text-[var(--primary-text-color)]">
                                                    ₹{rate.value}
                                                    <span className="text-xs text-gray-500 ml-1">/g</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Silver Rates Section */}
                            {silverRates.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-500" />
                                        <h4 className="font-semibold text-sm text-gray-700">Silver Rates</h4>
                                    </div>
                                    <div className="space-y-2">
                                        {silverRates.map(rate => (
                                            <div key={rate.key} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={silvericon}
                                                        alt="Silver"
                                                        className="w-5 h-5"
                                                    />
                                                    <span className="text-sm font-medium text-gray-800">
                                                        SILVER
                                                    </span>
                                                </div>
                                                <span className="font-bold text-[var(--primary-text-color)]">
                                                    ₹{rate.value}
                                                    <span className="text-xs text-gray-500 ml-1">/g</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Last updated: Today</span>
                                    <button
                                        onClick={() => {
                                            setShowAll(!showAll);
                                            setIsOpen(false);
                                        }}
                                        className="text-[var(--secondary-text-color)] hover:text-[var(--primary-hover-color)] font-medium transition-colors"
                                    >
                                        {showAll ? "Show only main rates" : "View all rates"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RatesDropdown;