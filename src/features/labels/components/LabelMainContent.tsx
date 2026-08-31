import React, { useMemo, useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    useIndexLabels,
    useCreateLabel,
    useUpdateLabel,
    useDeleteLabel,
    labelQueryKey,
} from '@/services/labels/hooks/useLabelCRUD';
import {
    LabelEntity,
    LabelCreateSchema,
    LabelCreatePayload,
} from '@/services/labels/schema/LabelSchema';
import LabelMutationForm from './LabelMutationForm';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { Column } from '@/shared/components/table/BaseTable';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const LabelMainContent: React.FC = () => {
    const [search] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const queryClient = useQueryClient();

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    const { data, isLoading } = useIndexLabels({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCreateLabel();
    const editMutation = useUpdateLabel(0); // the id will be overridden in mutation
    const deleteMutation = useDeleteLabel(0); // the id will be overridden in mutation

    const columns: Column<LabelEntity>[] = useMemo(() => [
        {
            title: 'Nama',
            key: 'name',
            sortable: true,
            render: (item: LabelEntity) => (
                <div className="font-medium text-brand-navy">
                    {item.name || '-'}
                </div>
            )
        },
        {
            title: 'Warna',
            key: 'color',
            sortable: true,
            render: (item: LabelEntity) => (
                <div className="flex items-center gap-2">
                    <div 
                        className="w-4 h-4 rounded-full border border-slate-200" 
                        style={{ backgroundColor: item.color || '#fff' }} 
                    />
                    <span className="text-sm font-mono text-slate-500">
                        {item.color || '-'}
                    </span>
                </div>
            )
        },
        {
            title: 'Waktu Dibuat',
            key: 'created_at',
            sortable: true,
            render: (item: LabelEntity) => {
                if (!item.created_at) return '-';
                return new Date(item.created_at).toLocaleString('id-ID');
            }
        },
    ], []);

    const displayData = Array.isArray(data?.data) ? data.data : [];
    const totalItems = data?.pagination?.total ?? 0;

    return (
        <DataPageTemplate<LabelEntity, LabelCreatePayload>
            title="Label"
            description="Manajemen data label"
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
            mutationMode='content'
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationForm={{
                component: LabelMutationForm,
                resolver: zodResolver(LabelCreateSchema),
                emptyValues: {
                    name: '',
                    color: '#000000',
                },
                defaultValues: (entity) => ({
                    name: entity.name ?? '',
                    color: entity.color ?? '#000000',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Label',
                    modalTitle: 'Tambah Label',
                    modalDescription: 'Isi form di bawah ini untuk menambahkan data label baru.',
                    modalSize: 'lg',
                    onConfirm: async (payload) => {
                        await addMutation.mutateAsync(payload);
                        queryClient.invalidateQueries({ queryKey: [labelQueryKey] });
                        toast.success('Berhasil', { description: 'Label telah ditambahkan' });
                    },
                },
                edit: {
                    modalTitle: (entity) => `Edit Label — ${entity.name}`,
                    modalSize: 'lg',
                    onConfirm: async (item, payload) => {
                        if (!item.id) return;
                        await editMutation.mutateAsync({ id: item.id, data: payload });
                        queryClient.invalidateQueries({ queryKey: [labelQueryKey] });
                        toast.success('Berhasil', { description: 'Label telah diperbarui' });
                    },
                },
                delete: {
                    onConfirm: async (item) => {
                        if (!item.id) return;
                        await deleteMutation.mutateAsync({ id: item.id });
                        queryClient.invalidateQueries({ queryKey: [labelQueryKey] });
                        toast.success('Berhasil', { description: 'Label telah dihapus' });
                    }
                }
            }}
        />
    );
};

export default LabelMainContent;
