import React, { useCallback, useState } from 'react';
// import { DashboardCard } from '@/shared/components/card/DashboardCard';
import {
    Download, Loader2,
    // UserRoundCheck, UserRoundPlus, UserRoundX, Users
} from 'lucide-react';
// import { useTranslation } from 'react-i18next';
import { useUserIndex as useIndexUser } from '@/services/user/hooks/useUserCRUD';
import AddUserModal from './AddUserModal';
import ImportUserModal from './ImportUserModal';
import { useExportUsers, useDownloadImportTemplate } from '@/services/user/hooks/useUserImportExport';
import { toast } from 'sonner';
import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { DataPageTemplate } from '@/components/ui/data-page-template';
import { type Column } from '@/shared/components/table/BaseTable';
import { UserEntity } from '@/services/user/schema/UserSchema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import EditUserModal from './EditUserModal';
import RemoveUser from './RemoveUser';
import AssignRoleModal from './AssignRoleModal';

// ─── Filter Content ────────────────────────────────────────────────────────────

interface UserFilterContentProps {
    isActive: boolean;
    setIsActive: (v: boolean) => void;
    isInactive: boolean;
    setIsInactive: (v: boolean) => void;
}

const UserFilterContent: React.FC<UserFilterContentProps> = ({ isActive, setIsActive, isInactive, setIsInactive }) => (
    <div className="flex flex-col gap-3 p-1 min-w-[200px]">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</span>
        <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
                className="rounded border-slate-300 data-[state=checked]:bg-primary"
            />
            <span className="text-sm text-slate-700 group-hover:text-primary">Active Users</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox
                checked={isInactive}
                onCheckedChange={(checked) => setIsInactive(!!checked)}
                className="rounded border-slate-300 data-[state=checked]:bg-primary"
            />
            <span className="text-sm text-slate-700 group-hover:text-primary">Inactive Users</span>
        </label>
    </div>
);

// ─── Columns ───────────────────────────────────────────────────────────────────

const userColumns: Column<UserEntity>[] = [
    {
        key: 'name',
        title: 'Name',
        render: (user) => <span className="font-medium text-slate-900">{user.name}</span>,
    },
    {
        key: 'email',
        title: 'Email',
        render: (user) => <span className="text-sm text-slate-600">{user.email}</span>,
    },
    {
        key: 'phone',
        title: 'Phone',
        render: (user) => <span className="text-sm text-slate-600">{user.phone ?? '-'}</span>,
    },
    {
        key: 'roles',
        title: 'Role',
        render: (user) =>
            user.roles && user.roles.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                        <Badge key={role.id} variant="outline">{role.display_name}</Badge>
                    ))}
                </div>
            ) : (
                <span className="text-slate-400 text-sm">No role</span>
            ),
    },
    {
        key: 'id',
        title: 'Aksi',
        copyValue: false,
        className: 'justify-end text-right',
        render: (user) => (
            <div className="flex items-center gap-1 justify-end">
                <AssignRoleModal user={user} />
                <EditUserModal user={user} />
                <RemoveUser user={user} />
            </div>
        ),
    },
];

// ─── Main Component ────────────────────────────────────────────────────────────

const UserManagementContent: React.FC = () => {
    // const { t } = useTranslation();
    const exportUsers = useExportUsers();
    const downloadTemplate = useDownloadImportTemplate();

    const [search, setSearch] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);

    const { data: users, isFetching, refetch } = useIndexUser({
        search,
        paginate: entriesPerPage,
        page: currentPage,
        include: 'roles,permissions',
        ...(isActive && { 'filter[is_active]': 'true' }),
        ...(isInactive && { 'filter[is_active]': 'false' }),
    });

    const handleDownloadTemplate = async () => {
        try {
            await downloadTemplate.mutateAsync();
            toast('Download Success', { description: 'Template impor user berhasil diunduh.' });
        } catch {
            toast.error('Download Failed', { description: 'Gagal mengunduh template impor.' });
        }
    };

    const handleExport = async () => {
        try {
            await exportUsers.mutateAsync();
            toast('Export Success', { description: 'Seluruh data pengguna berhasil diekspor ke file Excel.' });
        } catch {
            toast.error('Export Failed', { description: 'Terjadi kesalahan saat memproses ekspor data.' });
        }
    };

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
        setCurrentPage(1);
    }, []);

    // const dashboardCards = [
    //     {
    //         title: t('user-management.card.total-users'),
    //         icon: <Users className="h-4 w-4" />,
    //         iconBg: 'bg-slate-50 text-slate-400',
    //         value: String(users?.pagination?.total ?? 0),
    //         changeType: 'up' as const,
    //     },
    //     {
    //         title: t('user-management.card.active-users'),
    //         icon: <UserRoundCheck className="h-4 w-4" />,
    //         iconBg: 'bg-emerald-50 text-emerald-500',
    //         value: '0',
    //         changeType: 'up' as const,
    //     },
    //     {
    //         title: t('user-management.card.inactive-users'),
    //         icon: <UserRoundX className="h-4 w-4" />,
    //         iconBg: 'bg-red-50 text-red-500',
    //         value: '0',
    //         changeType: 'down' as const,
    //     },
    //     {
    //         title: t('user-management.card.recently-added'),
    //         icon: <UserRoundPlus className="h-4 w-4" />,
    //         iconBg: 'bg-blue-50 text-blue-500',
    //         value: '0',
    //         changeType: 'up' as const,
    //     },
    // ];

    useTopbarActions({
        search: {
            value: search,
            onChange: handleSearchChange,
            placeholder: 'Cari User...',
        },
        filter: {
            content: (
                <UserFilterContent
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
            <>
                <AddUserModal />
                <ImportUserModal onSuccess={() => refetch()} />

                <Button
                    variant="outline"
                    onClick={handleDownloadTemplate}
                    disabled={downloadTemplate.isPending}
                    className="h-9 gap-2"
                >
                    {downloadTemplate.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    <span className="hidden lg:inline">Import Template</span>
                </Button>

                <Button
                    variant="outline"
                    onClick={handleExport}
                    disabled={exportUsers.isPending}
                    className="h-9 gap-2"
                >
                    {exportUsers.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    <span className="hidden sm:inline">Export User</span>
                </Button>
            </>
        ),
    });

    return (
        <DataPageTemplate<UserEntity>
            title="Manajemen User"
            description="Kelola akun dan hak akses personil"
            columns={userColumns}
            data={users?.data ?? []}
            isLoading={isFetching}
            totalItems={users?.pagination?.total ?? 0}
            currentPage={currentPage}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(items) => { setEntriesPerPage(items); setCurrentPage(1); }}
            // additionalContent={
            //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            //         {dashboardCards.map((card, idx) => (
            //             <DashboardCard
            //                 key={idx}
            //                 {...card}
            //                 onDetailClick={() => console.log(`Detail clicked: ${card.title}`)}
            //             />
            //         ))}
            //     </div>
            // }
        />
    );
};

export default UserManagementContent;