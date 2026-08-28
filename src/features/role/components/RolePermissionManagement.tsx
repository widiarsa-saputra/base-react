import React, { useEffect } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BaseTable } from "@/shared/components/table/BaseTable";
import { Controller, useForm } from "react-hook-form";
import { RolePermissionCreatePayload as CreateRolePermission, RolePermissionCreateSchema as CreateRolePermissionSchema } from "@/services/role-permission/schema/RolePermissionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePermissionIndex as useIndexPermission } from "@/services/permission/hooks/usePermissionCRUD";
import { useRolePermissionCreate as useCreateRolePermission } from "@/services/role-permission/hooks/useRolePermissionCRUD";
import { useFormSubmit } from "@/shared/hooks/useFormSubmit";
import { useNavigate, useParams } from "react-router";
import { ROUTES } from "@/router/AppRouter";
import { useRoleIndex as useIndexRole } from "@/services/role/hooks/useRoleCRUD";
import SectionLoader from "@/shared/components/loader/SectionLoader";
import { PermissionEntity as SinglePermissionResponse } from "@/services/permission/schema/PermissionSchema";
import { CheckboxAllToggle } from "@/shared/components/form/CheckboxAllToggle";
import { CheckboxItemList } from "@/shared/components/form/CheckboxItemList";
import { useCheckboxSelectCrossRow } from "@/shared/hooks/useCheckboxSelectCrossRow";
import { AxiosError } from "axios";

const GroupedPermissions = () => {
    const { data: permissions, isFetching, isSuccess } = useIndexPermission({
        params: {
            sort_by: "created_at",
            sort_order: "desc"
        }
    });

    const groupedPermissions = permissions?.data.reduce((acc: Record<string, { id: string; group: string; permissions: { key: string; display_name: string }[] }>, permission) => {
        const group = permission.group || "Ungrouped";
        if (!acc[group]) {
            acc[group] = { id: group, group, permissions: [] };
        }
        acc[group].permissions.push({
            key: permission.name || '',
            display_name: permission.display_name || '',
        });
        return acc;
    }, {});

    return { groupedPermissions, isFetching, isSuccess };
}

type PermissionGroupSelectAllProps = {
    value: string[];
    onChange: (value: string[]) => void;
    allKeys: string[];
};

const PermissionGroupSelectAll: React.FC<PermissionGroupSelectAllProps> = ({ value, onChange, allKeys }) => {
    const { allSelected, toggleAll } = useCheckboxSelectCrossRow(value, allKeys);

    return (
        <CheckboxAllToggle
            allSelected={allSelected}
            toggleAll={() => onChange(toggleAll())}
            label={'Select All'}
        />
    );
};

const RolePermissionManagement: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams<{ roleId: string }>();

    const { data: role, isSuccess: isRoleSuccess, isError, error } = useIndexRole({
        params: {
            'filter[id]': params.roleId || undefined,
            include: "permissions",
        }
    });

    if (isError && (error as AxiosError)?.response?.status === 404) {
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

    if (isRoleSuccess && role) {
        const roleData = Array.isArray(role.data)
            ? role.data.find(r => String(r.id) === String(params.roleId))
            : role.data;

        if (!roleData) {
            // Jika data kosong, bisa return fallback atau null
            return <div>Role data not found</div>;
        }

        return (
            <RolePermissionManagementTable roleName={roleData.name || ''} roleDisplayName={roleData.display_name || ''} initialPermissions={roleData.permissions ?? undefined} />
        );
    }

    return <SectionLoader className="p-6 min-h-[100dvh]" />;
}

type Props = {
    roleName?: string;
    roleDisplayName?: string;
    initialPermissions?: SinglePermissionResponse[];
}

const RolePermissionManagementTable: React.FC<Props> = ({ roleName, roleDisplayName, initialPermissions }) => {
    const navigate = useNavigate();
    const { groupedPermissions, isFetching } = GroupedPermissions();

    const { control, handleSubmit, setError, reset } = useForm<CreateRolePermission>({
        resolver: zodResolver(CreateRolePermissionSchema),
        defaultValues: {
            permissions: [],
            role: roleName
        }
    })

    useEffect(() => {
        if (roleName && roleDisplayName && Array.isArray(initialPermissions)) {
            // Set default permissions if provided
            const initialPermissionKeys = initialPermissions.map(permission => permission.name);
            reset({
                permissions: initialPermissionKeys.filter((k): k is string => Boolean(k)),
                role: roleName
            });
        }
        // Reset form when roleName or roleDisplayName changes
    }, [roleName, roleDisplayName, initialPermissions]);

    const { mutateAsync, isPending } = useCreateRolePermission();

    const { onSubmit } = useFormSubmit({
        mutate: mutateAsync,
        isPending,
        setError,
        successMessage: "Role permissions created successfully.",
        errorMessage: "Failed to create role permissions.",
        queryKeyToRefetch: ["role-list"],
        onSuccess: () => {
            navigate(ROUTES.ROLES.path);
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50 min-h-screen">
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
                <span className="text-sm font-semibold text-slate-700">Manajemen Hak Akses Role</span>
            </div>

            <div className="p-4">
                <BaseTable<{ id: string; group: string; permissions: { key: string; display_name: string }[] }>
                    data={groupedPermissions ? Object.values(groupedPermissions) : []}
                    columns={[
                        { title: "No", key: "index", render: (_, index) => index + 1, className: "w-12" },
                        { title: "Group", key: "group" },
                        {
                            title: "Select All", key: "selectAll", render: (item) => (
                                <Controller
                                    control={control}
                                    name="permissions"
                                    render={({ field }) => {
                                        const allKeys = item.permissions.map((d: { key: string; display_name: string }) => d.key);
                                        return (
                                            <PermissionGroupSelectAll
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                allKeys={allKeys}
                                            />
                                        );
                                    }}
                                />
                            )
                        },
                        {
                            title: "Permissions",
                            key: "permissions",
                            render: (item) => (
                                <div className="flex flex-wrap gap-2">
                                    <Controller
                                        control={control}
                                        name="permissions"
                                        render={({ field }) => {
                                            const toggleItem = (key: string) => {
                                                const newValue = field.value?.includes(key)
                                                    ? field.value.filter((k: string) => k !== key)
                                                    : [...(field.value ?? []), key];
                                                field.onChange(newValue);
                                            };
                                            return (
                                                <CheckboxItemList
                                                    data={item.permissions}
                                                    selectedKeys={field.value ?? []}
                                                    toggleItem={toggleItem}
                                                    keySelector={(item: { key: string; display_name: string }) => item.key}
                                                    labelSelector={(item: { key: string; display_name: string }) => item.display_name}
                                                    className="flex flex-row gap-2"
                                                />
                                            )
                                        }}
                                    />
                                </div>
                            )
                        }
                    ]}
                    isLoading={isFetching}
                    renderHeader={() => (
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
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
                                <div className="flex items-center justify-end gap-2">
                                    <Button type="button" onClick={() => navigate(ROUTES.ROLES.path)} variant="outline">Batal</Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? 'Menyimpan...' : 'Simpan'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                />
            </div>
        </form>
    );
}

export default RolePermissionManagement