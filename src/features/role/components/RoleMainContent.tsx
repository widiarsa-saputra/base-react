import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { KeyRound, Pencil, Plus, Shield, Trash2, Users } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useTopbarActions } from '@/shared/context/TopbarActionContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/shared/components/modal/Modal';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials, getDeterministicBgAndTextColor } from '@/lib/utils';

import { useRoleIndex, useRoleCreate, useRoleUpdate, useRoleDelete } from '@/services/role/hooks/useRoleCRUD';
import { RoleCreateSchema, RoleCreatePayload, RoleEntity } from '@/services/role/schema/RoleSchema';
import RoleMutationForm from './RoleMutationForm';

// ─── Filter ────────────────────────────────────────────────────────────────────

interface RoleFilterContentProps {
    isActive: boolean;
    setIsActive: (v: boolean) => void;
    isInactive: boolean;
    setIsInactive: (v: boolean) => void;
}

const RoleFilterContent: React.FC<RoleFilterContentProps> = ({ isActive, setIsActive, isInactive, setIsInactive }) => (
    <div className="flex flex-col gap-3 p-1 min-w-[200px]">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</span>
        <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox checked={isActive} onCheckedChange={(c) => setIsActive(!!c)} className="rounded border-slate-300 data-[state=checked]:bg-primary" />
            <span className="text-sm text-slate-700 group-hover:text-primary">Active</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer group">
            <Checkbox checked={isInactive} onCheckedChange={(c) => setIsInactive(!!c)} className="rounded border-slate-300 data-[state=checked]:bg-primary" />
            <span className="text-sm text-slate-700 group-hover:text-primary">Inactive</span>
        </label>
    </div>
);

// ─── Role Card Skeleton ────────────────────────────────────────────────────────

const RoleCardSkeleton = () => (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[160px]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-100/50 to-transparent">
            <Skeleton className="flex-shrink-0 w-10 h-10 rounded-lg" />
            <div className="min-w-0 flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>

        {/* User Assigned */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center -space-x-1.5">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-7 h-7 rounded-full border-2 border-white" />
                ))}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 flex items-center justify-between gap-2 mt-auto">
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
            </div>
        </div>
    </div>
);

// ─── Role Card ─────────────────────────────────────────────────────────────────

interface RoleCardProps {
    role: RoleEntity;
    onEdit: (role: RoleEntity) => void;
    onDelete: (role: RoleEntity) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit, onDelete }) => {
    const navigate = useNavigate();
    const users = role.users ?? [];

    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{role.display_name}</p>
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 mt-0.5 border-slate-200 text-slate-500">
                        {role.name}
                    </Badge>
                </div>
            </div>

            {/* User Assigned */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
                    <Users className="h-3.5 w-3.5" />
                    <span>Pengguna</span>
                </div>
                <div className="flex items-center -space-x-1.5">
                    {users.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Belum ada</span>
                    ) : (
                        users.slice(0, 5).map((user, idx) => {
                            const { bgColor } = getDeterministicBgAndTextColor(String(user.id) || user.name || '');
                            return (
                                <div
                                    key={idx}
                                    title={user.name ?? ''}
                                    className={`w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center text-[10px] font-semibold border-2 border-white`}
                                >
                                    {getInitials(user.name ?? '')}
                                </div>
                            );
                        })
                    )}
                    {users.length > 5 && (
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-semibold border-2 border-white">
                            +{users.length - 5}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 flex items-center justify-between gap-2 mt-auto">
                {/* Nav actions */}
                <div className="flex items-center gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1.5 text-xs text-slate-600 hover:text-primary hover:bg-primary/5 px-2"
                        onClick={() => navigate(`/roles/${role.id}/users`)}
                    >
                        <Users className="h-3.5 w-3.5" />
                        Users
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1.5 text-xs text-slate-600 hover:text-primary hover:bg-primary/5 px-2"
                        onClick={() => navigate(`/roles/${role.id}/permissions`)}
                    >
                        <KeyRound className="h-3.5 w-3.5" />
                        Permissions
                    </Button>
                </div>

                {/* Mutation actions */}
                <div className="flex items-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-500 hover:text-primary hover:bg-primary/5"
                        onClick={() => onEdit(role)}
                        aria-label="Edit"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(role)}
                        aria-label="Delete"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const RoleMainContent: React.FC = () => {
    const [search, setSearch] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isInactive, setIsInactive] = useState(false);

    // Modal state
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<RoleEntity | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<RoleEntity | null>(null);

    const addMutation = useRoleCreate();
    const editMutation = useRoleUpdate();
    const deleteMutation = useRoleDelete();

    const { data: roles, isLoading } = useRoleIndex({
        search,
        include: 'users',
        ...(isActive && { 'filter[is_active]': 'true' }),
        ...(isInactive && { 'filter[is_active]': 'false' }),
    });

    // Add form
    const addForm = useForm<RoleCreatePayload>({
        resolver: zodResolver(RoleCreateSchema),
        defaultValues: { display_name: '', name: '' },
    });

    // Edit form
    const editForm = useForm<RoleCreatePayload>({
        resolver: zodResolver(RoleCreateSchema),
    });

    const handleSearchChange = useCallback((value: string) => setSearch(value), []);

    const handleAddOpen = () => {
        addForm.reset({ display_name: '', name: '' });
        setIsAddOpen(true);
    };

    const handleEditOpen = (role: RoleEntity) => {
        editForm.reset({ display_name: role.display_name ?? '', name: role.name ?? '' });
        setEditTarget(role);
    };

    const handleAddSubmit = addForm.handleSubmit(async (data) => {
        await addMutation.mutateAsync(data);
        setIsAddOpen(false);
        addForm.reset();
    });

    const handleEditSubmit = editForm.handleSubmit(async (data) => {
        if (!editTarget) return;
        await editMutation.mutateAsync({ id: Number(editTarget.id), data });
        setEditTarget(null);
    });

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        await deleteMutation.mutateAsync({ id: Number(deleteTarget.id) });
        setDeleteTarget(null);
    };

    useTopbarActions({
        search: {
            value: search,
            onChange: handleSearchChange,
            placeholder: 'Cari Role...',
        },
        filter: {
            content: (
                <RoleFilterContent
                    isActive={isActive}
                    setIsActive={setIsActive}
                    isInactive={isInactive}
                    setIsInactive={setIsInactive}
                />
            ),
            onClear: () => { setIsActive(false); setIsInactive(false); },
        },
    });

    const roleList = Array.isArray(roles?.data) ? roles.data : [];

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-tight flex gap-2">
                        <span>Manajemen Role</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">Kelola role yang tersedia dalam sistem</p>
                </div>

                <Button variant={'secondary'} className="flex items-center gap-2 font-semibold" onClick={handleAddOpen}>
                    <Plus className="h-4 w-4" />
                    Tambah Role
                </Button>
            </div>
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <RoleCardSkeleton key={idx} />
                    ))}
                </div>
            ) : roleList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Shield className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">Belum ada role ditemukan</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {roleList.map((role) => (
                        <RoleCard
                            key={role.id}
                            role={role}
                            onEdit={handleEditOpen}
                            onDelete={setDeleteTarget}
                        />
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <Modal
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
                title="Tambah Role"
                description="Buat peran baru untuk sistem."
                size="md"
            >
                <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                    <RoleMutationForm form={addForm} />
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={addMutation.isPending}>
                            {addMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                open={!!editTarget}
                onOpenChange={(open) => { if (!open) setEditTarget(null); }}
                title={`Edit Role — ${editTarget?.display_name ?? ''}`}
                description="Perbarui informasi peran."
                size="md"
            >
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                    <RoleMutationForm form={editForm} />
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setEditTarget(null)}>Batal</Button>
                        <Button type="submit" disabled={editMutation.isPending}>
                            {editMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete AlertDialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Role "{deleteTarget?.display_name}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Semua pengguna yang memiliki peran ini akan terpengaruh.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => { e.preventDefault(); handleDeleteConfirm(); }}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default RoleMainContent;
