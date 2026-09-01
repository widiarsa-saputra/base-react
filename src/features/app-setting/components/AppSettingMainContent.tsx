import React, { useMemo, useState } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';
import {
    useIndexAppSettings,
    useCreateAppSetting,
    useUpdateAppSetting,
    useDeleteAppSetting,
    appSettingQueryKey,
} from '@/services/app-setting/hooks/useAppSettingCRUD';
import {
    AppSettingEntity,
    AppSettingCreateSchema,
    AppSettingCreatePayload,
} from '@/services/app-setting/schema/AppSettingSchema';
import AppSettingMutationForm from './AppSettingMutationForm';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { Column } from '@/shared/components/table/BaseTable';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const AppSettingMainContent: React.FC = () => {
    const [search] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const queryClient = useQueryClient();

    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    const { data, isLoading } = useIndexAppSettings({
        search: debouncedSearch,
        page: currentPage,
        paginate: itemsPerPage,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const addMutation = useCreateAppSetting();
    const editMutation = useUpdateAppSetting(0); 
    const deleteMutation = useDeleteAppSetting(0); 

    const columns: Column<AppSettingEntity>[] = useMemo(() => [
        {
            title: 'Key',
            key: 'key',
            sortable: true,
            render: (item: AppSettingEntity) => (
                <div className="font-medium text-brand-navy">
                    {item.key || '-'}
                </div>
            )
        },
        {
            title: 'Value',
            key: 'value',
            sortable: true,
            render: (item: AppSettingEntity) => (
                <div className="truncate max-w-[200px]" title={String(item.value)}>
                    {item.value ? String(item.value) : '-'}
                </div>
            )
        },
        {
            title: 'Description',
            key: 'description',
            sortable: true,
            render: (item: AppSettingEntity) => (
                <div className="text-sm text-slate-500">
                    {item.description || '-'}
                </div>
            )
        },
        {
            title: 'Waktu Dibuat',
            key: 'created_at',
            sortable: true,
            render: (item: AppSettingEntity) => {
                if (!item.created_at) return '-';
                return new Date(item.created_at).toLocaleString('id-ID');
            }
        },
    ], []);

    const displayData = Array.isArray(data?.data) ? data.data : [];
    const totalItems = data?.pagination?.total ?? 0;

    return (
        <DataPageTemplate<AppSettingEntity, AppSettingCreatePayload>
            title="App Setting"
            description="Manajemen konfigurasi dan pengaturan aplikasi"
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
            mutationMode='modal'
            handleSort={(newSortBy, newSortOrder) => {
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
            }}
            mutationForm={{
                component: AppSettingMutationForm,
                resolver: zodResolver(AppSettingCreateSchema),
                emptyValues: {
                    key: '',
                    value: '',
                    description: '',
                },
                defaultValues: (entity) => ({
                    key: entity.key ?? '',
                    value: entity.value ?? '',
                    description: entity.description ?? '',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Setting',
                    modalTitle: 'Tambah App Setting',
                    modalDescription: 'Isi form di bawah ini untuk menambahkan data pengaturan baru.',
                    modalSize: 'lg',
                    onConfirm: async (payload) => {
                        await addMutation.mutateAsync(payload);
                        queryClient.invalidateQueries({ queryKey: [appSettingQueryKey] });
                        toast.success('Berhasil', { description: 'Pengaturan telah ditambahkan' });
                    },
                },
                edit: {
                    modalTitle: (entity) => `Edit Setting — ${entity.key}`,
                    modalSize: 'lg',
                    onConfirm: async (item, payload) => {
                        if (!item.id) return;
                        await editMutation.mutateAsync({ id: item.id, data: payload });
                        queryClient.invalidateQueries({ queryKey: [appSettingQueryKey] });
                        toast.success('Berhasil', { description: 'Pengaturan telah diperbarui' });
                    },
                },
                delete: {
                    onConfirm: async (item) => {
                        if (!item.id) return;
                        await deleteMutation.mutateAsync({ id: item.id });
                        queryClient.invalidateQueries({ queryKey: [appSettingQueryKey] });
                        toast.success('Berhasil', { description: 'Pengaturan telah dihapus' });
                    }
                }
            }}
        />
    );
};

export default AppSettingMainContent;
