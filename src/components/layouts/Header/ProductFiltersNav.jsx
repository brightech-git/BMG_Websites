"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

const FILTER_ITEM_LIMIT = 6;

const buildDirectLink = (header) => {
    const p = new URLSearchParams();
    p.set(header.linkKey, header.linkValue);
    return `/products-page?${p.toString()}`;
};

const buildMenuItemLink = (menuItem) => {
    console.log(menuItem,'menuItem');
    const p = new URLSearchParams();
    if (menuItem.filterContentId) p.set("filterIds", menuItem.filterContentId.toString());
    return `/products-page?${p.toString()}`;
};

const buildCategoryAllLink = (menuItem) => {
    const p = new URLSearchParams();
    if (menuItem.menuKey && menuItem.value) p.set(menuItem.menuKey, menuItem.value);
    return `/products-page?${p.toString()}`;
};

const buildFilterLeafLink = (menuItem, filterKey, filterContentItem) => {

    console.log("triggers")
    console.log(menuItem,filterKey, filterContentItem,'filterKey');
    const p = new URLSearchParams();
    if (menuItem.menuKey && menuItem.value) p.set(menuItem.menuKey, menuItem.value);
    if (filterKey.range) {
        p.set(`${filterKey?.filterKeys?.toLowerCase()}Range`, `${filterContentItem.min}-${filterContentItem.max}`);
    } else {
        p.set("filterIds", filterContentItem.id.toString());
    }
    return `/products-page?${p.toString()}`;
};

// Sub-dropdown component
const SubDropdown = ({ menuItem, mIdx, scheduleHover, setHoveredMenuIdx, go, parentDropdownRef }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (parentDropdownRef?.current) {
            const rect = parentDropdownRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top,
                left: rect.right + 4, // Position to the right of the parent dropdown
            });
        }
    }, [parentDropdownRef]);

    return (
        <div
            ref={dropdownRef}
            className="fixed z-[60] thin-scrollbar bg-white border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.13)] p-2 sm:p-3"
            style={{
                minWidth: 260,
                maxHeight: '60vh',
                overflowY: 'auto',
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            onMouseEnter={() => scheduleHover(mIdx, parentDropdownRef)}
            onMouseLeave={() => setHoveredMenuIdx(null)}
        >
            {/* "All X" heading */}
            <button
                className=" text-[12px] sm:text-[14px] font-semibold text-stone-800 mb-3 hover:text-amber-700 transition-colors bg-transparent border-none cursor-pointer p-0 block"
                onClick={() => go(buildCategoryAllLink(menuItem))}
            >
                All {menuItem.label}
            </button>

            <div className="grid grid-cols-1 gap-4">
                {menuItem.filterKeys.map((fk) => (
                    <div key={fk.id}>
                        <p className="text-[10px] sm:text-[12px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                            {fk.filterLabel}
                        </p>
                        <div className="flex flex-col gap-0.5">
                            {fk.filterContent.map((fc) => (
                                <button
                                    key={fc.id}
                                    onClick={() => go(buildFilterLeafLink(menuItem, fk, fc))}
                                    className="text-left text-[12px] sm:text-[14px] text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded px-1.5 py-[5px] transition-colors duration-150 bg-transparent border-none cursor-pointer w-full"
                                >   
                                {console.log(fk,'fiterContent')}
                                    {fc.filterTitle}
                                    {fc.isRange && (
                                        <span className="ml-1 text-[10px] sm:text-[12px] text-stone-400">
                                            ({fc.filterValue})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProductFiltersNav = ({ headers = [] }) => {
    

    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);
    const [hoveredMenuIdx, setHoveredMenuIdx] = useState(null);
    const navRef = useRef(null);
    const hoverTimer = useRef(null);
    const leftPanelRefs = useRef({});

    useEffect(() => {
        const onOutside = (e) => {
            if (!navRef.current?.contains(e.target)) {
                setActiveIndex(null);
                setHoveredMenuIdx(null);
            }
        };
        document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, []);

    const go = (path) => {
        setActiveIndex(null);
        setHoveredMenuIdx(null);
        navigate(path);
    };

    const scheduleHover = (idx, parentRef) => {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setHoveredMenuIdx(idx), 80);
    };

    return (
        <nav
            ref={navRef}
            className="relative flex items-center p-2"
        >   
            <button 
                className="relative flex items-center gap-1 px-4 h-full text-[12px] sm:text-[14px] font-medium tracking-wide whitespace-nowrap text-stone-700 hover:text-amber-700 transition-colors duration-200 bg-transparent border-none cursor-pointer group"
                onClick={() => navigate('/')}
            >
                Home
            </button>
            {headers.map((header, hIdx) => {
                const isOpen = activeIndex === hIdx;
                const isDirect = !header.filterId && header.menuList.length === 0;
                const hasDropdown = header.menuList.length > 0 || !!header.filterId;

                return (
                    <div
                        key={hIdx}
                        className="relative flex items-stretch flex-shrink-0"
                        onMouseEnter={() => !isDirect && setActiveIndex(hIdx)}
                        onMouseLeave={() => {
                            setActiveIndex(null);
                            setHoveredMenuIdx(null);
                        }}
                    >
                        {/* Pill */}
                        <button
                            onClick={() => isDirect ? go(buildDirectLink(header)) : setActiveIndex(isOpen ? null : hIdx)}
                            className="relative flex items-center gap-1 px-4 h-full text-[12px] sm:text-[14px] font-medium tracking-wide whitespace-nowrap text-stone-700 hover:text-amber-700 transition-colors duration-200 bg-transparent border-none cursor-pointer group"
                        >
                            {header.name}
                            {hasDropdown && (
                                <ChevronDown
                                    size={13}
                                    className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                />
                            )}
                            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                        </button>

                        {/* Dropdown */}
                        {hasDropdown && isOpen && (
                            <div className="absolute top-full left-0 z-50 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-visible min-w-[200px] max-w-[260px] w-max">
                                {header.menuList.some(m => m.menuKey && m.value) ? (
                                    <div className="flex">
                                        {/* LEFT: menu item list */}
                                        <div
                                            ref={(el) => { leftPanelRefs.current[hIdx] = el; }}
                                            className="w-48 border-r border-gray-100 py-2 flex-shrink-0"
                                        >
                                            {header.menuList.map((menuItem, mIdx) => {
                                                const isCategory = !!menuItem.menuKey && !!menuItem.value;
                                                const hasSubFilters = menuItem.filterKeys?.length > 0;
                                                const isHovered = hoveredMenuIdx === mIdx;

                                                return (
                                                    <div
                                                        key={mIdx}
                                                        className="relative"
                                                        onMouseEnter={() => hasSubFilters && scheduleHover(mIdx, leftPanelRefs.current[hIdx])}
                                                        onMouseLeave={() => clearTimeout(hoverTimer.current)}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                isCategory
                                                                    ? go(buildCategoryAllLink(menuItem))
                                                                    : menuItem.filterContentId
                                                                        ? go(buildMenuItemLink(menuItem))
                                                                        : null
                                                            }
                                                            className={`w-full flex items-center justify-between px-4 py-2.5 text-[12px] sm:text-[14px] font-medium transition-colors duration-150 bg-transparent border-none cursor-pointer text-left ${isHovered
                                                                    ? "bg-amber-50 text-amber-700"
                                                                    : "text-stone-700 hover:bg-stone-50 hover:text-amber-700"
                                                                }`}
                                                        >
                                                            {menuItem.label}
                                                            {hasSubFilters && (
                                                                <ChevronRight
                                                                    size={13}
                                                                    className={`flex-shrink-0 transition-colors ${isHovered ? "text-amber-500" : "text-stone-400"
                                                                        }`}
                                                                />
                                                            )}
                                                        </button>

                                                        {/* Sub-dropdown */}
                                                        {isHovered && hasSubFilters && (
                                                            <SubDropdown
                                                                menuItem={menuItem}
                                                                mIdx={mIdx}
                                                                scheduleHover={scheduleHover}
                                                                setHoveredMenuIdx={setHoveredMenuIdx}
                                                                go={go}
                                                                parentDropdownRef={{ current: leftPanelRefs.current[hIdx] }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    /* Scenario 2: filterId on header, simple list */
                                    <div className="py-2">
                                        {header.menuList.map((menuItem, mIdx) => (
                                            <button
                                                key={mIdx}
                                                onClick={() =>
                                                    menuItem.filterContentId
                                                        ? go(buildMenuItemLink(menuItem))
                                                        : null
                                                }
                                                className="w-full text-left px-4 py-2.5 text-[12px] sm:text-[14px] text-stone-700 hover:bg-amber-50 hover:text-amber-700 transition-colors duration-150 bg-transparent border-none cursor-pointer"
                                            >
                                                {menuItem.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default ProductFiltersNav;