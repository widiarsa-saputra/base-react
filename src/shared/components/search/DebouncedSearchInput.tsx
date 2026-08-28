import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { FloatingInput } from "@/components/FloatingInput";

interface DebouncedSearchInputProps {
    value?: string;
    onChange: (value: string) => void;
    debounceTime?: number;
    className?: string;
    inputClassName?: string;
    icon?: React.ElementType;
    placeholder?: string;
    label?: string;
}

const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
    value = "",
    onChange,
    debounceTime = 300,
    className = "",
    inputClassName = "",
    placeholder = "Search",
    label = "Search",
    icon,
}) => {
    const [inputValue, setInputValue] = useState(value);

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            if (inputValue !== value) {
                onChange(inputValue);
            }
        }, debounceTime);

        return () => clearTimeout(handler);
    }, [inputValue, debounceTime, onChange, value]);

    // Sync internal state if parent value changes externally
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const clearButton = inputValue.length > 0 ? (
        <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => setInputValue('')}
            aria-label="Clear search"
        >
            <X className="w-3.5 h-3.5" />
        </button>
    ) : undefined;

    return (
        <div className={className}>
            <FloatingInput
                id="debounced-search"
                label={label}
                icon={icon ?? Search}
                watch={inputValue}
                rightSlot={clearButton}
                inputProps={{
                    value: inputValue,
                    onChange: (e) => setInputValue(e.target.value),
                    placeholder,
                    className: inputClassName,
                }}
            />
        </div>
    );
};

export default DebouncedSearchInput;

