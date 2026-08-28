import React, { forwardRef } from 'react';

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { label: string; value: string | number }[];
}

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
    ({ options, className, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        );
    }
);

NativeSelect.displayName = 'NativeSelect';

export default NativeSelect;
