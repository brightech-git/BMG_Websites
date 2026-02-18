// components/filters/FilterChipList.jsx
import { RotateCcw } from 'lucide-react';
import { FilterChip } from './FilterChip';

export const FilterChipList = ({ filters, onClearAll, showClearAll = true }) => (
    <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter, index) => (
            <FilterChip key={index} {...filter} />
        ))}
        {showClearAll && filters.length > 0 && (
            <button
                onClick={onClearAll}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors text-xs whitespace-nowrap"
            >
                <RotateCcw size={12} />
                Clear
            </button>
        )}
    </div>
);