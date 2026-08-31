import React, { useState, useMemo } from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { VariantProps } from 'class-variance-authority';
import { UseQueryResult } from '@tanstack/react-query';
import { BaseResponse } from '@/services/base/response/BaseResponseSchema';
import { cn } from '@/lib/utils';

export interface DataSelectBadgeProps<T> {
    /** The currently selected value display text. */
    value?: string;
    /** Placeholder if no value is selected. */
    placeholder?: string;

    // -- Data Sources (At least one should be provided) --

    /** Static array of options */
    options?: T[];
    /** API hook that returns data */
    useApiHook?: (params?: object) => UseQueryResult<BaseResponse<T[]>, unknown>;

    // -- Mapping and Selection --

    /** Function to get the display label from an item */
    getLabel: (item: T) => string;
    /** Function to render the item */
    renderItem?: (item: T) => React.ReactNode;
    /** Function to get the unique key from an item */
    getKey: (item: T) => string | number;
    /** Callback when an item is selected */
    onSelect: (item: T) => void;

    // -- UI Configuration --

    title?: string;
    description?: string;
    badgeProps?: VariantProps<typeof badgeVariants> & Omit<React.ComponentProps<"span">, "onSelect">;
}

// Sub-component to safely call the API hook without breaking Rules of Hooks
function ApiDataLoader<T>({
    useApiHook,
    search,
    render
}: {
    useApiHook: (params?: object) => UseQueryResult<BaseResponse<T[]>, unknown>;
    search: string;
    render: (data: T[], isLoading: boolean) => React.ReactNode;
}) {
    const { data: response, isLoading } = useApiHook({ search, paginate: 30 }); // Pass search and a sensible pagination limit
    const data = response?.data || [];
    return <>{render(data, isLoading)}</>;
}

export function DataSelectBadge<T>({
    value,
    placeholder = "Pilih Data",
    options,
    useApiHook,
    getLabel,
    renderItem,
    getKey,
    onSelect,
    title = "Pilih Data",
    description = "Cari dan pilih data dari daftar di bawah ini.",
    badgeProps,
}: DataSelectBadgeProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const handleSelect = (item: T) => {
        onSelect(item);
        setIsOpen(false);
        setSearch(''); // Reset search on close
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSearch(''); // Reset search when closed externally
        }
    };

    const renderList = (data: T[], isLoading: boolean) => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                    <p className="text-sm font-medium">Memuat data...</p>
                </div>
            );
        }

        if (data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                    <Search className="w-8 h-8 mb-4 opacity-50" />
                    <p className="text-sm font-medium">Data tidak ditemukan.</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-1">
                {data.map((item, index) => (
                    <>
                        <button
                            key={getKey(item)}
                            onClick={() => handleSelect(item)}
                            className="flex items-center w-full px-4 py-3 text-left text-sm rounded-md transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none"
                        >
                            {
                                renderItem !== undefined
                                    ? renderItem(item)
                                    : getLabel(item)
                            }
                        </button>
                        {
                            data.length !== index + 1 && (
                                <div className='border-b'></div>
                            )
                        }
                    </>
                ))}
            </div>
        );
    };

    const staticData = useMemo(() => {
        if (!options) return [];
        if (!search) return options;
        const lowerSearch = search.toLowerCase();
        return options.filter(opt => getLabel(opt).toLowerCase().includes(lowerSearch));
    }, [options, search, getLabel]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Badge
                    variant="outline"
                    {...badgeProps}
                    className={cn("cursor-pointer hover:bg-slate-100 transition-colors", badgeProps?.className)}
                >
                    {value || placeholder}
                </Badge>
            </DialogTrigger>

            <DialogContent className="max-w-md p-0 overflow-hidden flex flex-col max-h-[85vh]">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}

                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </DialogHeader>

                <div className="overflow-y-auto p-2">
                    {useApiHook ? (
                        <ApiDataLoader
                            useApiHook={useApiHook}
                            search={debouncedSearch}
                            render={renderList}
                        />
                    ) : (
                        renderList(staticData, false)
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
