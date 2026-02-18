// components/filters/RangeFilterContent.jsx
export const RangeFilterContent = ({
    SliderComponent,
    brackets,
    currentRange,
    onSelectBracket
}) => (
    <>
        <SliderComponent />
        <div className="mt-4 space-y-1">
            {brackets.map((bracket) => (
                <button
                    key={bracket.label}
                    onClick={() => onSelectBracket(bracket.min, bracket.max)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${currentRange[0] === bracket.min && currentRange[1] === bracket.max
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                >
                    {bracket.label}
                </button>
            ))}
        </div>
    </>
);