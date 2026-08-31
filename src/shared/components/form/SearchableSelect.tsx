import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X, Info } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/shared/hooks/useDebounce";
import LabelComp from "@/components/LabelComp";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export type SelectOption<T> = {
    label: string;
    value: string;
    render?: React.ReactNode;
    data?: T;
};

interface SearchableSelectProps<T> {
    id?: string;
    label?: string;
    icon?: React.ElementType;
    error?: string;
    required?: boolean;
    tooltipMessage?: string;
    options: SelectOption<T>[];
    value?: string | string[];
    placeholder?: string;
    onChange: (value: string | string[]) => void;
    isMulti?: boolean;
    className?: string;
    disabled?: boolean;
    searchValue?: string;
    onSearchChange?: (search: string) => void;
    serverSideSearch?: boolean;
    isPending?: boolean;
}

export const SearchableSelect = <T,>({
    id = "searchable-select",
    label,
    icon: Icon,
    error,
    required,
    tooltipMessage,
    options,
    value,
    placeholder = "Select...",
    onChange,
    isMulti = false,
    className,
    disabled = false,
    searchValue,
    onSearchChange,
    serverSideSearch = false,
    isPending = false,
}: SearchableSelectProps<T>) => {
    const [open, setOpen] = React.useState(false);
    const [focused, setFocused] = React.useState(false);
    
    // Manage local search for debouncing
    const [localSearch, setLocalSearch] = React.useState(searchValue || "");
    const debouncedSearch = useDebounce(localSearch, 500);

    React.useEffect(() => {
        if (onSearchChange) {
            onSearchChange(debouncedSearch);
        }
    }, [debouncedSearch, onSearchChange]);

    React.useEffect(() => {
        if (searchValue !== undefined && searchValue !== localSearch) {
            setLocalSearch(searchValue);
        }
    }, [searchValue]);

    const isSelected = (val: string) => {
        if (isMulti && Array.isArray(value)) {
            return value.includes(val);
        }
        return value === val;
    };

    const handleSelect = (val: string) => {
        if (isMulti) {
            const current = Array.isArray(value) ? value : [];
            const isAlreadySelected = current.includes(val);

            const newValues = isAlreadySelected
                ? current.filter((v) => v !== val)
                : [...current, val];
            onChange(newValues);
        } else {
            onChange(val);
            setOpen(false);
        }
    };

    const displayValue = () => {
        if (isMulti && Array.isArray(value) && value.length > 0) {
            if (value.length > 2) {
                return `${value.length} items selected`;
            }
            return options
                .filter((opt) => value.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ");
        } else if (!isMulti) {
            const selected = options.find((opt) => opt.value === value);
            return selected?.label || "";
        }
        return "";
    };

    const hasValue = isMulti ? Array.isArray(value) && value.length > 0 : !!value;
    const isFloating = open || focused || hasValue;
    const displayPlaceholder = (label && !isFloating) ? "" : placeholder;

    return (
        <div className={cn("w-full space-y-2", className)}>
            <div className={`relative group/${id}`}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            disabled={disabled}
                            aria-expanded={open}
                            onFocus={() => setFocused(true)}
                            onBlur={() => {
                                setTimeout(() => setFocused(false), 300);
                            }}
                            className={cn(
                                "w-full h-11 justify-between font-normal rounded tracking-wide bg-slate-50/30 focus:bg-white text-left",
                                Icon ? "pl-10 pr-10" : "px-4",
                                (!displayValue() && (!label || isFloating)) && "text-muted-foreground",
                                (!displayValue() && label && !isFloating) && "text-transparent"
                            )}
                        >
                            <span className="truncate">{displayValue() || displayPlaceholder}</span>
                            <div className="flex items-center gap-1">
                                {displayValue() 
                                ? (
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onChange(isMulti ? [] : "");
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onChange(isMulti ? [] : "");
                                            }
                                        }}
                                    >
                                        <X className="h-full w-full" />
                                    </div>
                                )
                                : <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                            }
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command
                            filter={serverSideSearch ? () => 1 : undefined}
                        >
                            <CommandInput
                                placeholder="Search..."
                                className="h-9"
                                value={localSearch}
                                onValueChange={setLocalSearch}
                            />
                            <CommandEmpty>
                                {isPending ? (
                                    <div className="flex items-center justify-center py-2 text-sm text-muted-foreground gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading...
                                    </div>
                                ) : (
                                    "No options found."
                                )}
                            </CommandEmpty>
                            <CommandGroup className="max-h-40 overflow-y-auto" onWheel={e => e.stopPropagation()}>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => handleSelect(option.value)}
                                        className={cn(
                                            isSelected(option.value)
                                                ? "!bg-primary/10"
                                                : ""
                                        )}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected(option.value)
                                                    ? "opacity-100"
                                                    : "hidden"
                                            )}
                                        />
                                        {option.render || option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>

                {label && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {Icon && <Icon className="h-4 w-4 text-gray-400" />}
                        <LabelComp
                            htmlFor={id}
                            required={required}
                            className={cn(
                                `absolute whitespace-nowrap top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1`,
                                `bg-white px-2 duration-500 transition-all`,
                                Icon ? "left-8" : "left-2",
                                isFloating
                                    ? Icon ? '!left-4 !top-0 !text-[10px] bg-white'
                                        : '!top-0 !text-[10px] !left-1 bg-white'
                                    : ''
                            )}
                        >
                            {label}
                        </LabelComp>
                    </div>
                )}
                {tooltipMessage && (
                    <div className={cn("absolute inset-y-0 right-0 flex items-center pointer-events-auto", "pr-10")}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-3 w-3 text-muted-foreground cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltipMessage}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase">{error}</p>}
        </div>
    );
};

export default SearchableSelect;