// components/filters/MobileFilterOptions.jsx
export const MobileCheckboxOption = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

export const MobileRadioOption = ({ label, name, value, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);