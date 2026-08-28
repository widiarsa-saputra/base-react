import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { UserRoleSyncUsersPayload, UserRoleSyncRolesPayload } from "../schema/UserRoleSchema";
import { UserRoleSyncUsersResponse, UserRoleSyncRolesResponse, UserRoleSyncUsersResponseSchema, UserRoleSyncRolesResponseSchema } from "../response/UserRoleResponse";

const API_VERSION = "v1";

export function useUserRoleSyncUsers() {
    return useBaseCreate<UserRoleSyncUsersPayload, UserRoleSyncUsersResponse, any>({
        queryKey: "user-list",
        endpoint: `${API_VERSION}/user-roles/sync-users`,
        schema: UserRoleSyncUsersResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                console.error("Error syncing users to role:", error);
                throw error;
            },
        }
    });
}

export function useUserRoleSyncRoles() {
    return useBaseCreate<UserRoleSyncRolesPayload, UserRoleSyncRolesResponse, any>({
        endpoint: `${API_VERSION}/user-roles/sync-roles`,
        queryKey: 'user-list',
        schema: UserRoleSyncRolesResponseSchema,
        contentType: "application/json",
    });
}
