"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export const ProductFiltersNav = ({
    filtersData,
    onFilterClick,
}) => {
    const navigate = useNavigate();
    const [hoveredSectionIdx, setHoveredSectionIdx] = useState (null);
    const [showFilterCount , setShowFilterCount] = useState({
        page:0 ,item:5
    });
    console.log(filtersData,'showFilterCount');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1200px)');

        const handleMediaChange = (e) => {
            if (e.matches) {
                // Desktop: show more items
                setShowFilterCount(prev => ({ ...prev, item: 8 }));
            } else {
                // Mobile: show fewer items
                setShowFilterCount(prev => ({ ...prev, item: 5 }));
            }
        };

        // Initial check
        handleMediaChange(mediaQuery);

        // Listen for changes
        mediaQuery.addEventListener('change', handleMediaChange);

        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    // Transform the API data into sections with proper labels
    const transformFiltersToSections = ()=> {
        const sections = [];

        Object.entries(filtersData).forEach(([key, items]) => {
            if (items && items.length > 0) {
                // Format the label nicely
                let label = key;
                // Convert camelCase or PascalCase to readable format
                label = label.replace(/([A-Z])/g, ' $1').trim();
                // Capitalize first letter of each word
                label = label.replace(/\b\w/g, (char) => char.toUpperCase());

                sections.push({
                    label,
                    key,
                    items: items.filter(item => item.isActive),
                });
            }
        });

        // Sort sections by displayOrder if available, otherwise by label
        return sections
            .sort((a, b) => {
                const aOrder = a.items[0]?.displayOrder || 0;
                const bOrder = b.items[0]?.displayOrder || 0;
                return aOrder - bOrder;
            })
            .slice(showFilterCount.page,showFilterCount.item); // 👈 only first 5 sections
    };

    const sections = transformFiltersToSections();

    const handleFilterClick = (filterKey, filterId, filterValue, isRange, min, max) => {
      

        // Call the optional callback
        if (onFilterClick) {
            onFilterClick(filterKey, filterId, filterValue, isRange);
        }

        const params = new URLSearchParams();

        if (!isRange) {
            params.set('filterIds', filterId.toString());
        } else {
            params.set(`${filterKey.toLowerCase()}Range`, `${min}-${max}`);
        }

        navigate(`/products-page?${params.toString()}`);

        // Close the dropdown
        setHoveredSectionIdx(null);
    };
    const handleViewAll = (sectionLabel, filterKey) => {
        const params = new URLSearchParams();
        params.set('category', filterKey);
        params.set('viewAll', 'true');

        router.push(`/products-page?${params.toString()}`);
        setHoveredSectionIdx(null);
    };

   
    // Helper to get fallback text for items without images
    const getFallbackText = (filterTitle) => {
        return filterTitle.charAt(0).toUpperCase();
    };

    return (
        <div className="relative flex items-stretch flex-shrink-0 bg-white shadow-sm rounded-lg p-3">
            {sections.map((section) => (
                <div
                    key={section.key}
                    className="relative flex items-stretch flex-shrink-0 group"
                    onMouseEnter={() => setHoveredSectionIdx(section.key)}
                    onMouseLeave={() => setHoveredSectionIdx(null)}
                >
                    {/* Label button */}
                    <button
                        className="relative text-[15px] flex items-center gap-1 px-4 h-full font-medium tracking-wide whitespace-nowrap  text-stone-700 group-hover:text-amber-700 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                    >
                        {section.label}
                        {section.items?.length > 0 && (
                            <ChevronDown
                                size={13}
                                className="transition-transform duration-200 group-hover:rotate-180 flex-shrink-0"
                            />
                        )}
                        {/* Underline */}
                        <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-amber-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                    </button>

                    {/* Dropdown Panel */}
                    {section.items?.length > 0 && (
                        <div className={`
                            absolute top-full left-1/2 -translate-x-1/2
                            min-w-[250px]
                            max-w-[calc(100vw-20px)] bg-white
                            border border-gray-100
                            rounded-b-xl shadow-[0_12px_40px_rgba(0,0,0,0.10)]
                            p-1 z-50
                            transition-all duration-200 origin-top
                            ${hoveredSectionIdx === section.key
                                ? "opacity-100 scale-y-100 pointer-events-auto translate-y-0"
                                : "opacity-0 scale-y-95 pointer-events-none -translate-y-1"
                            }
                        `}>
                            {/* Items grid */}
                            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                                {section.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleFilterClick(
                                            section.key,
                                            item.id,
                                            item.filterValue,
                                            item.isRange,
                                            item.min,
                                            item.max
                                        )}
                                        className="group/item flex flex-row items-center gap-2 p-2 rounded-lg border border-transparent hover:border-amber-100 hover:bg-amber-50 transition-all duration-150 cursor-pointer bg-transparent w-full text-left"
                                    >
                                        {/* Circular image placeholder */}
                                        {/* <div className="w-8 h-8 overflow-hidden bg-amber-50 flex items-center justify-center flex-shrink-0 rounded-full group-hover/item:border-amber-400 transition-colors duration-150">
                                            <span className="text-amber-600 text-xs font-semibold">
                                                {getFallbackText(item.filterTitle)}
                                            </span>
                                        </div> */}

                                        {/* Item details */}
                                        <div className="flex-1">
                                            <span className="text-[13px] font-medium text-stone-700 group-hover/item:text-amber-700 transition-colors duration-150 block">
                                                {item.filterTitle}
                                            </span>
                                            {/* Show range info for price/weight filters */}
                                            {/* {item.isRange && (
                                                <span className="text-[10px] text-stone-400">
                                                    {item.min} - {item.max} {section.key === 'Weight' ? 'g' : section.key === 'Price' ? '₹' : ''}
                                                </span>
                                            )} */}
                                        </div>

                                        {/* Optional: Show count or additional info */}
                                        {item.isRange && (
                                            <span className="text-[10px] text-stone-400">
                                                {item.filterValue}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* View all button */}
                            <div className="flex justify-end mt-3 pt-2.5 border-t border-gray-100">
                                <button
                                    onClick={() => handleViewAll(section.label, section.key)}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-800 tracking-wide transition-colors duration-150 bg-transparent border-none cursor-pointer group/va"
                                >
                                    View all {section.label}
                                    <ChevronDown
                                        size={12}
                                        className="-rotate-90 group-hover/va:translate-x-0.5 transition-transform duration-150"
                                    />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};