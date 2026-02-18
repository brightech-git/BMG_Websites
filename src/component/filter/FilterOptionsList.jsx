// components/filters/FilterOptionsList.jsx
import { Check } from "lucide-react";

export const FilterOptionsList = ({ options, selectedValue, onSelect, renderLabel }) => (
    <div className="max-h-80 overflow-y-auto ">
        {options.map((option) => {
            const optionValue = option.value || option.sizeName || option.label || option;
            const isSelected = selectedValue === optionValue;
            const displayLabel = renderLabel ? renderLabel(option) : option.label || option.sizeName || option.name || option;

            return (
                <button
                    key={option.id || optionValue}
                    onClick={() => onSelect(option)}
                    className={`
                        w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs transition-all
                        ${isSelected
                            ? "bg-amber-100  font-medium shadow-sm border-l-4 border-amber-500"
                            : "hover:bg-gray-100  hover:pl-4"
                        }
                    `}
                >
                    <span>{displayLabel}</span>
                    {isSelected && (
                        <Check size={16} className="text-amber-600 flex-shrink-0" />
                    )}
                </button>
            );
        })}
    </div>
);