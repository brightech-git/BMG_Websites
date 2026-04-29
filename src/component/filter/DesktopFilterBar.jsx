import React from "react";
import { FilterDropdown } from "./FilterDropdown";
import { FilterChipList } from "./FilterChipList";


export const DesktopFilterBar = ({
    filtersLoading, productFiltersLoading, allFilterSections,
    openDropdown, setOpenDropdown, isRangeFilter, getSectionLabel,
    getSectionHasSelection, renderFilterContent, sortBy, SORT_OPTIONS,
    handleSortChange, getActiveFilterCount, getActiveChips, clearAll
}) => (

   
    <>
        <div className="bg-[var(--primary-color)] border-b border-gray-200 px-4 py-1.5">
            <div className="flex items-center gap-4 flex-wrap">
                {(filtersLoading || productFiltersLoading) && (
                    <span className="text-sm text-gray-400 animate-pulse">Loading filters…</span>
                )}
                {allFilterSections.map((sectionKey) => (
                    <FilterDropdown
                        key={sectionKey}
                        label={getSectionLabel(sectionKey)}
                        isOpen={openDropdown === sectionKey}
                        onToggle={() => setOpenDropdown(openDropdown === sectionKey ? null : sectionKey)}
                        width={isRangeFilter(sectionKey) ? "w-80" : "w-56"}
                        hasSelection={getSectionHasSelection(sectionKey)}
                    >
                        {renderFilterContent(sectionKey)}
                    </FilterDropdown>
                ))}
                <div className="relative ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <FilterDropdown
                        label={SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Featured"}
                        isOpen={openDropdown === "sort"}
                        onToggle={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                        width="w-56"
                        direction="left"
                    >
                        <div className="p-2">
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${sortBy === option.value
                                        ? "bg-amber-50 text-amber-600 font-medium"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </FilterDropdown>
                </div>
            </div>
        </div>
        {(getActiveFilterCount() > 0 || sortBy) && (
            <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3">
                <FilterChipList
                    filters={getActiveChips()}
                    onClearAll={clearAll}
                    showClearAll={getActiveFilterCount() > 0}
                />
            </div>
        )}
    </>
);
