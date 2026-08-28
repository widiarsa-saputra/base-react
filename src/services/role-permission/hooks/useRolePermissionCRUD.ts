import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { RolePermissionCreatePayload, RolePermissionEntity } from "../schema/RolePermissionSchema";
import { RolePermissionCreateResponse, RolePermissionCreateResponseSchema } from "../response/RolePermissionResponse";

const API_VERSION = "v1";
const queryKey = "role-permission-list";

export const useRolePermissionCreate = () => {
    return useBaseCreate<RolePermissionCreatePayload, RolePermissionCreateResponse, RolePermissionEntity>({
        queryKey,
        endpoint: `${API_VERSION}/role-permissions/sync-permissions`,
        schema: RolePermissionCreateResponseSchema,
        contentType: "application/json",
        query: {
            onSuccess: (data) => data,
            onError: (error) => {
                console.error("Error creating role permission:", error);
                throw error;
            },
        }
    });
};
