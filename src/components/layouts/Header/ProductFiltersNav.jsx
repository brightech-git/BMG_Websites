"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

const buildLink = (link) => {
    if (!link) return "/";
    return link.startsWith("/") ? link : `/${link}`;
};

const NavSkeleton = () => (
    <nav className="relative flex items-center p-2 gap-1">
        {[80, 110, 90, 130, 100, 95].map((w, i) => (
            <div
                key={i}
                className="mx-2 h-4 rounded-full bg-stone-200 animate-pulse"
                style={{ width: `${w}px` }}
            />
        ))}
    </nav>
);

// Recursive flyout: level 0 drops below its anchor, deeper levels open to the right.
// `anchorMap`/`anchorKey` are looked up lazily inside an effect so no ref is read during render.
const DropdownLevel = ({ items, go, level, anchorMap, anchorKey }) => {
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const itemRefs = useRef({});
    const hoverTimer = useRef(null);

    useEffect(() => {
        const anchorEl = anchorMap.current[anchorKey];
        if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            setPosition(
                level === 0
                    ? { top: rect.bottom, left: rect.left }
                    : { top: rect.top, left: rect.right + 4 }
            );
        }
    }, [anchorMap, anchorKey, level]);

    useEffect(() => () => clearTimeout(hoverTimer.current), []);

    const scheduleHover = (idx) => {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = setTimeout(() => setHoveredIdx(idx), 80);
    };
    const cancelHover = () => clearTimeout(hoverTimer.current);

    return (
        <div
            className="fixed z-[60] thin-scrollbar bg-white border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.13)] py-2"
            style={{
                minWidth: 240,
                maxWidth: 300,
                maxHeight: "70vh",
                overflowY: "auto",
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
            onMouseLeave={() => setHoveredIdx(null)}
        >
            {items.map((item, idx) => {
                const hasChildren = item.subLayers?.length > 0;
                const isHovered = hoveredIdx === idx;

                return (
                    <div
                        key={item.id}
                        ref={(el) => { itemRefs.current[idx] = el; }}
                        className="relative"
                        onMouseEnter={() => hasChildren && scheduleHover(idx)}
                        onMouseLeave={cancelHover}
                    >
                        <button
                            onClick={() => go(buildLink(item.link))}
                            className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-[12px] sm:text-[14px] font-medium text-left transition-colors duration-150 bg-transparent border-none cursor-pointer ${
                                isHovered ? "bg-amber-50 text-amber-700" : "text-stone-700 hover:bg-stone-50 hover:text-amber-700"
                            }`}
                        >
                            <span>{item.label}</span>
                            {hasChildren && (
                                <ChevronRight
                                    size={13}
                                    className={`flex-shrink-0 transition-colors ${isHovered ? "text-amber-500" : "text-stone-400"}`}
                                />
                            )}
                        </button>

                        {isHovered && hasChildren && (
                            <DropdownLevel
                                items={item.subLayers}
                                go={go}
                                level={level + 1}
                                anchorMap={itemRefs}
                                anchorKey={idx}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export const ProductFiltersNav = ({ headers = [], isLoading = false }) => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);
    const navRef = useRef(null);
    const headerRefs = useRef({});

    useEffect(() => {
        const onOutside = (e) => {
            if (!navRef.current?.contains(e.target)) {
                setActiveIndex(null);
            }
        };
        document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, []);

    const go = (path) => {
        setActiveIndex(null);
        navigate(path);
    };

    if (isLoading) return <NavSkeleton />;

    return (
        <nav ref={navRef} className="relative flex items-center p-2">
            {headers.map((header, hIdx) => {
                const isOpen = activeIndex === hIdx;
                const hasDropdown = header.subLayers?.length > 0;

                return (
                    <div
                        key={header.id}
                        ref={(el) => { headerRefs.current[hIdx] = el; }}
                        className="relative flex items-stretch flex-shrink-0"
                        onMouseEnter={() => hasDropdown && setActiveIndex(hIdx)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <button
                            onClick={() => go(buildLink(header.link))}
                            className="relative flex items-center gap-1 px-4 h-full text-[12px] sm:text-[14px] font-medium tracking-wide whitespace-nowrap text-stone-700 hover:text-amber-700 transition-colors duration-200 bg-transparent border-none cursor-pointer group"
                        >
                            {header.label}
                            {hasDropdown && (
                                <ChevronDown
                                    size={13}
                                    className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                />
                            )}
                            <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
                        </button>

                        {hasDropdown && isOpen && (
                            <DropdownLevel
                                items={header.subLayers}
                                go={go}
                                level={0}
                                anchorMap={headerRefs}
                                anchorKey={hIdx}
                            />
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default ProductFiltersNav;
