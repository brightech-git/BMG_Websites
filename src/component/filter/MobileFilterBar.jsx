
import { FilterChipList } from "./FilterChipList";
import { X, Filter, ChevronUp } from "lucide-react";

export const MobileFilterBar = ({
    isFilterPanelOpen, setIsFilterPanelOpen,
    isSortPanelOpen, setIsSortPanelOpen,
    getActiveFilterCount, sortBy, SORT_OPTIONS,
    allFilterSections, activeMobileFilter, setActiveMobileFilter,
    getSectionLabel, getSectionSelectionCount, renderFilterContent,
    clearAll, totalResults, handleSortChange,
    getActiveChips
}) => (
    <>
        <div className="fixed bottom-0 left-0 w-full bg-[var(--primary-card-color)] border-t border-gray-200 z-20 flex justify-around items-center p-2">
            <button
                onClick={() => setIsFilterPanelOpen(true)}
                className="flex items-center gap-2 border border-[var(--primary-hover-color)] bg-[var(--primary-hover-color)] text-white px-4 py-2 rounded-full text-sm font-medium"
            >
                <Filter size={16} />
                Filters
                {getActiveFilterCount() > 0 && (
                    <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {getActiveFilterCount()}
                    </span>
                )}
            </button>
            <button
                onClick={() => setIsSortPanelOpen(true)}
                className="flex items-center gap-2 border border-gray-300 bg-[var(--primary-hover-color)] px-4 py-2 rounded-full text-sm font-medium text-white"
            >
                Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Featured"}
                <ChevronUp size={16} />
            </button>
        </div>

        {isFilterPanelOpen && (
            <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
                <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-[var(--primary-card-color)] to-[var(--primary-color)] flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-900">Filter</h3>
                    <button onClick={() => setIsFilterPanelOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-2/5 border-r border-gray-200 overflow-y-auto bg-[var(--primary-card-color)]">
                        {allFilterSections.map((sectionKey) => {
                            const cnt = getSectionSelectionCount(sectionKey);
                            return (
                                <button
                                    key={sectionKey}
                                    onClick={() => setActiveMobileFilter(sectionKey)}
                                    className={`w-full text-left px-4 py-3 border-b border-gray-200 text-sm ${activeMobileFilter === sectionKey
                                            ? "bg-gray-50 text-amber-600 font-medium"
                                            : "text-gray-700"
                                        }`}
                                >
                                    {getSectionLabel(sectionKey)}
                                    {cnt > 0 && (
                                        <span className="ml-1 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                            {cnt}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 min-h-full">
                        {activeMobileFilter && renderFilterContent(activeMobileFilter)}
                    </div>
                </div>
                <div className="border-t border-gray-200 p-2 flex gap-2">
                    <button onClick={clearAll} className="flex-1 bg-red-500 hover:bg-red-700 text-white text-sm py-2 rounded-lg font-medium transition-colors">
                        Reset Filters
                    </button>
                    <button onClick={() => setIsFilterPanelOpen(false)} className="flex-1 text-white text-sm py-2 bg-[#d1721f] rounded-lg font-medium transition-colors">
                        Show {totalResults} {totalResults === 1 ? "Item" : "Items"}
                    </button>
                </div>
            </div>
        )}

        {isSortPanelOpen && (
            <div className="fixed inset-0 bg-white z-[2000] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
                    <button onClick={() => setIsSortPanelOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={`w-full text-left px-4 py-3 rounded-md text-sm transition-colors ${sortBy === option.value
                                    ? "bg-amber-50 text-amber-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {(getActiveFilterCount() > 0 || sortBy) && (
            <div className="flex items-center justify-between bg-white border-b border-gray-200 px-2 py-2">
                <FilterChipList
                    filters={getActiveChips()}
                    onClearAll={clearAll}
                    showClearAll={getActiveFilterCount() > 0}
                />
            </div>
        )}
    </>
);