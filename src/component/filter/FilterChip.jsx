// components/filters/FilterChip.jsx
import { X } from 'lucide-react';

export const FilterChip = ({ label, onRemove, bgColor = "bg-amber-50" }) => (
    <div className={`flex items-center gap-1 ${bgColor} text-amber-800 px-3 py-1.5 rounded-full text-[10px] sm:text-sm`}>
        <span>{label}</span>
        <button onClick={onRemove} className="text-amber-600 hover:text-amber-800 ml-1">
            <X size={14} />
        </button>
    </div>
);