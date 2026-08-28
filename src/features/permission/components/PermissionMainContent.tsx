import React, { useCallback, useState } from 'react';
import { Download } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { DataPageTemplate } from '@/components/ui/data-page-template';
import { type Column } from '@/shared/components/table/BaseTable';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { usePermissionIndex, usePermissionCreate, usePermissionUpdate, usePermissionDelete } from '@/services/permission/hooks/usePermissionCRUD';
import { PermissionCreateSchema, PermissionCreatePayload, PermissionEntity } from '@/services/permission/schema/PermissionSchema';
import PermissionMutationForm from './PermissionMutationForm';

// ─── Filter Content ─────────────────────────────────────────────────────────────

interface PermissionFilterContentProps {
    isActive: boolean;
    setIsActive: (v: boolean) => void;
    isInactive: boolean;
    setIsInactive: (v: boolean) => void;
}

const PermissionFilterContent: React.FC<PermissionFilterContentProps> = ({ isActive, setIsActive, isInactive, setIsInactive }) => (
    <div className="flex flex-col gap-3 p-1 min-w-[200px]">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</span>
        <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
                className="rounded border-slate-300 data-[state=checked]:bg-primary"
            />
            <span className="text-sm text-slate-700 group-hover:text-primary">Active</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
                checked={isInactive}
                onCheckedChange={(checked) => setIsInactive(!!checked)}
                className="rounded border-slate-300 data-[state=checked]:bg-primary"
            />
            <span className="text-sm text-slate-700 group-hover:text-primary">Inactive</span>
        </label>
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────────

const PermissionMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    const addMutation = usePermissionCreate();
    const editMutation = usePermissionUpdate();
    const deleteMutation = usePermissionDelete();

    const handleSort = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
    }, []);

    const { data: permissions, isFetching } = usePermissionIndex({
        search,
        paginate: entriesPerPage,
        page: currentPage,
        ...(sortBy && { sort_by: sortBy }),
        ...(sortOrder && { sort_order: sortOrder }),
        ...(isActive && { 'filter[is_active]': 'true' }),
        ...(isInactive && { 'filter[is_active]': 'false' }),
    });

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setCurrentPage(1);
    }, []);

    useTopbarActions({
        search: {
            value: search,
            onChange: handleSearchChange,
            placeholder: 'Cari permission...',
        },
        filter: {
            content: (
                <PermissionFilterContent
                    isActive={isActive}
                    setIsActive={setIsActive}
                    isInactive={isInactive}
                    setIsInactive={setIsInactive}
                />
            ),
            onClear: () => {
                setIsActive(false);
                setIsInactive(false);
            },
        },
        extraActions: (
            <Button variant="outline" className="flex items-center gap-2 h-8 text-xs font-medium">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Download</span>
            </Button>
        ),
    });

    const columns: Column<PermissionEntity>[] = [
        {
            key: 'name',
            title: 'Name',
            sortable: true,
            render: (permission) => <span className="text-sm text-slate-500 font-mono">{permission.name}</span>,
        },
        {
            key: 'display_name',
            title: 'Display Name',
            sortable: true,
            render: (permission) => <span className="font-medium text-slate-900">{permission.display_name}</span>,
        },
        {
            key: 'group',
            sortable: true,
            title: 'Group',
        },
    ];

    return (
        <DataPageTemplate<PermissionEntity, PermissionCreatePayload>
            title="Manajemen Permission"
            description="Kelola izin akses (permissions) dalam sistem"
            columns={columns}
            data={Array.isArray(permissions?.data) ? permissions.data : []}
            isLoading={isFetching}
            totalItems={permissions?.pagination?.total ?? 0}
            currentPage={currentPage}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(items) => { setEntriesPerPage(items); setCurrentPage(1); }}
            handleSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            mutationMode="modal"
            mutationForm={{
                component: PermissionMutationForm,
                resolver: zodResolver(PermissionCreateSchema),
                emptyValues: { display_name: '', name: '', group: '' },
                defaultValues: (permission) => ({
                    display_name: permission.display_name ?? '',
                    name: permission.name ?? '',
                    group: permission.group ?? '',
                }),
            }}
            submitActions={{
                add: {
                    label: 'Tambah Permission',
                    modalTitle: 'Tambah Permission',
                    modalSize: 'md',
                    onConfirm: async (data) => { await addMutation.mutateAsync(data); },
                },
                edit: {
                    modalTitle: (permission) => `Edit Permission — ${permission.display_name}`,
                    modalSize: 'md',
                    onConfirm: async (permission, data) => { await editMutation.mutateAsync({ id: Number(permission.id), data }); },
                },
                delete: {
                    onConfirm: async (permission) => { await deleteMutation.mutateAsync({ id: Number(permission.id) }); },
                },
            }}
        />
    );
};

export default PermissionMainContent;
