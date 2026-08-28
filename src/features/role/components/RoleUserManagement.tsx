import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Check, Info, Save, Shield, UserMinus, Users, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { ROUTES } from "@/router/AppRouter";
import { useRoleIndex as useIndexRole } from "@/services/role/hooks/useRoleCRUD";
import SectionLoader from "@/shared/components/loader/SectionLoader";
import { useUserRoleSyncUsers as useCreateUserRole } from "@/services/user-role/hooks/useUserRoleCRUD";
import { useFormSubmit } from "@/shared/hooks/useFormSubmit";
import { UserRoleSyncUsersPayload as CreateUserRole } from "@/services/user-role/schema/UserRoleSchema";
import { useUserIndex as useIndexUser } from "@/services/user/hooks/useUserCRUD";
import { UserEntity } from "@/services/user/schema/UserSchema";
import { getInitials, getDeterministicBgAndTextColor, cn } from "@/lib/utils";
import { toast } from "sonner";
import DebouncedSearchInput from "@/shared/components/search/DebouncedSearchInput";
import PaginationWithShow from "@/shared/components/pagination/PaginationWithShow";

// ─── Root component: resolve roleId from params ────────────────────────────────

const RoleUserManagement: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams<{ roleId: string }>();

    const { data: role, isSuccess: isRoleSuccess, isError, error } = useIndexRole({
        'filter[id]': params.roleId || undefined,
        include: "users",
    });

    if (isError && (error as { response?: { status?: number } })?.response?.status === 404) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Shield className="h-14 w-14 text-slate-300" />
                <p className="text-slate-500 font-medium">Role tidak ditemukan.</p>
                <Button variant="outline" onClick={() => navigate(ROUTES.ROLES.path)}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Roles
                </Button>
            </div>
        );
    }

    if (!isRoleSuccess || !role) return <SectionLoader className="min-h-[100dvh]" />;

    const roleData = Array.isArray(role.data)
        ? role.data.find(r => String(r.id) === String(params.roleId))
        : role.data;

    if (!roleData) return <SectionLoader className="min-h-[100dvh]" />;

    return (
        <RoleUserManagementContent
            roleId={Number(roleData.id)}
            roleName={roleData.name ?? ''}
            roleDisplayName={roleData.display_name ?? ''}
            initialUsers={roleData.users ?? []}
        />
    );
};

export default RoleUserManagement;

// ─── Inner Component ───────────────────────────────────────────────────────────

type RoleUserManagementContentProps = {
    roleId: number;
    roleName: string;
    roleDisplayName: string;
    initialUsers: UserEntity[];
};

const RoleUserManagementContent: React.FC<RoleUserManagementContentProps> = ({
    roleName,
    roleDisplayName,
    initialUsers,
}) => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const { data: allUsers, isFetching: isUserFetching } = useIndexUser({
        search,
        paginate: entriesPerPage,
        page: currentPage,
    });

    const { handleSubmit, reset, control, watch, setError } = useForm<CreateUserRole>({
        defaultValues: {
            user_ids: initialUsers.map(u => String(u.id)),
            role: roleName,
        }
    });

    useEffect(() => {
        reset({
            user_ids: initialUsers.map(u => String(u.id)),
            role: roleName,
        });
    }, [roleName, initialUsers, reset]);

    const { mutateAsync, isPending } = useCreateUserRole();

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Pengguna berhasil disinkronkan ke role.",
        errorMessage: "Gagal menyimpan perubahan.",
        queryKeyToRefetch: ["role-list"],
        onSuccess: () => navigate(ROUTES.ROLES.path),
    });

    const currentUserIds = watch("user_ids") as string[];
    const initialIds = useMemo(() => initialUsers.map(u => String(u.id)), [initialUsers]);
    const isDirty = useMemo(() => {
        const curr = [...currentUserIds].sort();
        const init = [...initialIds].sort();
        return JSON.stringify(curr) !== JSON.stringify(init);
    }, [currentUserIds, initialIds]);

    // Build a map of all users for fast lookup
    const allUsersMap = useMemo(() => {
        const map = new Map<string, UserEntity>();
        (allUsers?.data ?? []).forEach(u => map.set(String(u.id), u));
        initialUsers.forEach(u => map.set(String(u.id), u));
        return map;
    }, [allUsers, initialUsers]);

    const selectedUsers = useMemo(() =>
        currentUserIds.map(id => allUsersMap.get(id)).filter(Boolean) as UserEntity[],
        [currentUserIds, allUsersMap]
    );

    const userList = allUsers?.data ?? [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50">
            {/* Back button bar */}
            <div className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 bg-white border-b border-slate-100 shadow-sm">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-600 hover:text-slate-900"
                    onClick={() => navigate(ROUTES.ROLES.path)}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Button>
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-sm font-semibold text-slate-700">Assign Users to Role</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 mx-auto">

                {/* ── Section 1: Role + Selected Users ── */}
                <div className="flex flex-col gap-4">
                    {/* Role info card */}
                    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-primary/5 to-transparent border-b border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-900">{roleDisplayName}</p>
                                <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 mt-0.5 text-slate-500">
                                    {roleName}
                                </Badge>
                            </div>
                        </div>

                        <div className="px-5 py-3 flex items-center justify-between bg-slate-50/50 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                <Users className="h-3.5 w-3.5" />
                                <span>Pengguna terpilih ({selectedUsers.length})</span>
                            </div>
                            {isDirty && (
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isPending}
                                    className="h-7 gap-1.5 text-xs"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    {isPending ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            )}
                        </div>

                        {/* Selected user chips */}
                        <Controller
                            control={control}
                            name="user_ids"
                            render={({ field }) => (
                                <div className="px-5 py-4 flex flex-wrap gap-2 min-h-[80px]">
                                    {selectedUsers.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic self-center">
                                            Belum ada pengguna yang di-assign.
                                        </p>
                                    ) : (
                                        selectedUsers.map((user) => {
                                            const { bgColor } = getDeterministicBgAndTextColor(String(user.id));
                                            return (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 rounded-full pl-1 pr-2 py-1 transition-colors"
                                                >
                                                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0", bgColor)}>
                                                        {getInitials(user.name ?? '')}
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-700 max-w-[120px] truncate">
                                                        {user.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                                                        onClick={() => field.onChange(
                                                            (field.value as string[]).filter(id => id !== String(user.id))
                                                        )}
                                                        aria-label={`Remove ${user.name}`}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {isDirty && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                            <Info className="h-4 w-4 flex-shrink-0" />
                            <span>Ada perubahan yang belum disimpan.</span>
                        </div>
                    )}
                </div>

                {/* ── Section 2: User List ── */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                        {/* Search */}
                        <div className="px-5 pt-4 pb-3 border-b border-slate-100">
                            <DebouncedSearchInput
                                placeholder="Cari pengguna"
                                value={search}
                                onChange={(val) => {
                                    setSearch(val);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Info hint */}
                        <div className="flex items-center gap-2 px-5 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-600">
                            <Info className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>Klik pada pengguna untuk assign ke role <strong>{roleDisplayName}</strong></span>
                        </div>

                        {/* User list */}
                        <Controller
                            control={control}
                            name="user_ids"
                            render={({ field }) => {
                                const selectedSet = new Set(field.value as string[]);
                                return (
                                    <div className="divide-y divide-slate-50">
                                        {isUserFetching ? (
                                            <SectionLoader text="Memuat pengguna..." time={800} className="bg-transparent py-8" />
                                        ) : userList.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                                                <Users className="h-8 w-8 opacity-30" />
                                                <p className="text-sm">Tidak ada pengguna ditemukan</p>
                                            </div>
                                        ) : (
                                            userList.map((user) => {
                                                const isSelected = selectedSet.has(String(user.id));
                                                const { bgColor } = getDeterministicBgAndTextColor(String(user.id));
                                                return (
                                                    <button
                                                        key={user.id}
                                                        type="button"
                                                        className={cn(
                                                            "w-full flex items-center gap-3 px-5 py-3 text-left transition-all",
                                                            isSelected
                                                                ? "bg-primary/5 hover:bg-primary/10"
                                                                : "hover:bg-slate-50"
                                                        )}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                field.onChange((field.value as string[]).filter(id => id !== String(user.id)));
                                                                toast.info(`${user.name} dihapus dari role`);
                                                            } else {
                                                                field.onChange([...(field.value as string[]), String(user.id)]);
                                                                toast.success(`${user.name} ditambahkan ke role`);
                                                            }
                                                        }}
                                                    >
                                                        <div className={cn(
                                                            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0",
                                                            bgColor
                                                        )}>
                                                            {getInitials(user.name ?? '')}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                                                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                                        </div>
                                                        {isSelected ? (
                                                            <div className="flex items-center gap-1 text-primary text-xs font-medium flex-shrink-0">
                                                                <Check className="h-4 w-4" />
                                                                <span className="hidden sm:inline">Assigned</span>
                                                            </div>
                                                        ) : (
                                                            <UserMinus className="h-4 w-4 text-slate-300 flex-shrink-0" />
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                );
                            }}
                        />

                        {/* Pagination */}
                        {allUsers?.pagination && (
                            <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                                <PaginationWithShow
                                    totalItems={allUsers.pagination.total}
                                    itemsPerPage={entriesPerPage}
                                    currentPage={currentPage}
                                    onPageChange={(page) => setCurrentPage(page)}
                                    onItemsPerPageChange={(items) => {
                                        setEntriesPerPage(items);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </form>
    );
};