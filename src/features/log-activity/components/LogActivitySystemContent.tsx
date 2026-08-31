import React, { useMemo, useState, useEffect } from 'react';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useIndexLogs } from '@/services/log-activity/hooks/useLogActivityCRUD';
import { LogActivityEntity } from '@/services/log-activity/schema/LogActivitySchema';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { Badge } from '@/components/ui/badge';

const LogActivitySystemContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isLoading } = useIndexLogs({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        filter: {
            subject_type: 'system', // We use subject_type 'system' to conceptually split the tabs
        }
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, itemsPerPage, sortBy, sortOrder]);

    const topbarConfig = useMemo(() => ({
        search: {
            placeholder: 'Cari log sistem...',
            value: search,
            onChange: setSearch,
        }
    }), [search]);

    useTopbarActions(topbarConfig);

    const columns = useMemo(() => [
        {
            title: 'Waktu',
            key: 'created_at',
            sortable: true,
            render: (item: LogActivityEntity) => {
                if (!item.created_at) return '-';
                return new Date(item.created_at).toLocaleString('id-ID');
            }
        },
        {
            title: 'Event',
            key: 'event',
            sortable: true,
            render: (item: LogActivityEntity) => (
                <Badge variant="outline" className="capitalize">
                    {item.event || '-'}
                </Badge>
            )
        },
        {
            title: 'Tipe Subjek',
            key: 'subject_type',
            sortable: true,
            render: (item: LogActivityEntity) => item.subject_type || 'Unknown'
        },
        {
            title: 'ID Subjek',
            key: 'subject_id',
            sortable: false,
            render: (item: LogActivityEntity) => item.subject_id || '-'
        },
        {
            title: 'Keterangan',
            key: 'description',
            sortable: false,
            expand: true,
            render: (item: LogActivityEntity) => item.description || '-'
        },
    ], []);

    const displayData = Array.isArray(data?.data) ? data.data : [];
    const totalItems = data?.pagination?.total ?? 0;

    return (
        <DataPageTemplate<LogActivityEntity, Record<string, never>>
            title="Aktivitas Sistem"
            description="Pantau log operasional yang dijalankan oleh sistem."
            columns={columns}
            data={displayData}
            isLoading={isLoading}
            enableColumnToggle
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            sortBy={sortBy}
            sortOrder={sortOrder}
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationMode="content"
        />
    );
};

export default LogActivitySystemContent;
