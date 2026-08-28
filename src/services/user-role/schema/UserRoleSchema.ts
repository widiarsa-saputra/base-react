import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const UserRoleSyncUsersSchema = z.object({
    user_ids: z.array(z.string()).nonempty("User IDs are required"),
    role: z.nullable(z.string().min(1, "Role is required")).optional(),
});

export const UserRoleSyncRolesSchema = z.object({
    user_id: z.string().min(1, "User ID is required"),
    roles: z.array(z.string()).optional(),
});

export const UserRoleEntitySchema = z.object({}).merge(BaseEntitySchema);

export type UserRoleSyncUsersPayload = z.infer<typeof UserRoleSyncUsersSchema>;
export type UserRoleSyncRolesPayload = z.infer<typeof UserRoleSyncRolesSchema>;
export type UserRoleEntity = z.infer<typeof UserRoleEntitySchema>;
