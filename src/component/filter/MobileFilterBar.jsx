import { useEffect, useId, useRef } from "react";
import { ArrowDownUp, Filter, X } from "lucide-react";
import { formatNumber } from "../../utils/index.js";
import { FilterChipList } from "./FilterChipList";

const actionClass = "min-h-11 rounded-xl px-3 text-sm font-bold";
const primaryClass = "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-hover)]";
const secondaryClass = "border border-[var(--brand-border)] bg-white text-[var(--brand-hover)]";

function FilterDialog({ title, onClose, children, footer }) {
    const dialogRef = useRef(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        document.body.style.overflow = "hidden";

        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            className="fixed inset-0 m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden border-0 bg-white p-0"
        >
            <div className="flex h-full flex-col">
                <div className="flex shrink-0 items-center justify-between border-b border-orange-100 bg-orange-50 px-4 py-2">
                    <h2 id={titleId} className="m-0 text-lg font-bold">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={`Close ${title.toLowerCase()}`}
                        className="grid h-11 w-11 place-items-center rounded-xl text-[var(--brand-hover)] hover:bg-orange-100"
                    >
                        <X size={22} aria-hidden="true" />
                    </button>
                </div>
                {children}
                {footer && (
                    <div className="flex shrink-0 gap-2 border-t border-orange-100 bg-white px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                        {footer}
                    </div>
                )}
            </div>
        </dialog>
    );
}

export function MobileFilterBar({
    isFilterPanelOpen,
    setIsFilterPanelOpen,
    isSortPanelOpen,
    setIsSortPanelOpen,
    getActiveFilterCount,
    sortBy,
    SORT_OPTIONS,
    allFilterSections,
    activeMobileFilter,
    setActiveMobileFilter,
    getSectionLabel,
    getSectionSelectionCount,
    renderFilterContent,
    clearAll,
    totalResults,
    resultsLoading,
    handleSortChange,
    getActiveChips,
}) {
    const count = getActiveFilterCount();
    const sortLabel = SORT_OPTIONS.find((option) => option.value === sortBy)?.label;

    return (
        <>
            <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-orange-200 bg-orange-50 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setIsFilterPanelOpen(true)}
                    className={`${actionClass} ${primaryClass} flex flex-1 items-center justify-center gap-2`}
                >
                    <Filter size={16} aria-hidden="true" />
                    Filters {count > 0 && `(${formatNumber(count, 0)})`}
                </button>
                <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setIsSortPanelOpen(true)}
                    className={`${actionClass} ${secondaryClass} flex flex-1 items-center justify-center gap-2`}
                >
                    <ArrowDownUp size={16} aria-hidden="true" />
                    {sortLabel || "Sort"}
                </button>
            </div>

            {isFilterPanelOpen && (
                <FilterDialog
                    title="Filters"
                    onClose={() => setIsFilterPanelOpen(false)}
                    footer={
                        <>
                            <button
                                type="button"
                                onClick={clearAll}
                                className={`${actionClass} ${secondaryClass} flex-1`}
                            >
                                Reset filters
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFilterPanelOpen(false)}
                                className={`${actionClass} ${primaryClass} flex-1`}
                            >
                                {resultsLoading ? "Show results" : `Show ${formatNumber(totalResults, 0)} results`}
                            </button>
                        </>
                    }
                >
                    <div className="flex min-h-0 flex-1">
                        <div className="w-2/5 shrink-0 overflow-y-auto border-r border-orange-100 bg-orange-50">
                            {allFilterSections.map((key) => {
                                const selected = activeMobileFilter === key;
                                const sectionCount = getSectionSelectionCount(key);

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() => setActiveMobileFilter(key)}
                                        className={`min-h-11 w-full break-words px-3 py-2 text-left text-sm ${
                                            selected ? "bg-orange-100 font-bold text-[var(--brand-hover)]" : "text-stone-700"
                                        }`}
                                    >
                                        {getSectionLabel(key)}
                                        {sectionCount > 0 && ` (${formatNumber(sectionCount, 0)})`}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="min-w-0 flex-1 overflow-y-auto p-2">
                            {activeMobileFilter && renderFilterContent(activeMobileFilter)}
                        </div>
                    </div>
                </FilterDialog>
            )}

            {isSortPanelOpen && (
                <FilterDialog title="Sort by" onClose={() => setIsSortPanelOpen(false)}>
                    <div className="flex-1 space-y-2 overflow-y-auto p-4">
                        {SORT_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                aria-pressed={sortBy === option.value}
                                onClick={() => handleSortChange(option.value)}
                                className={`${actionClass} w-full text-left ${
                                    sortBy === option.value ? "bg-orange-100 text-[var(--brand-hover)]" : "hover:bg-orange-50"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </FilterDialog>
            )}

            {(count > 0 || sortBy) && (
                <div className="rounded-xl border border-orange-100 bg-white p-2">
                    <FilterChipList
                        filters={getActiveChips()}
                        onClearAll={clearAll}
                        showClearAll={count > 0}
                    />
                </div>
            )}
        </>
    );
}
