import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const RolePermissionCreateSchema = z.object({
    permissions: z.nullable(z.array(z.string()).min(1, "At least one permission is required")),
    role: z.string().min(1, "Role is required"),
});

export const RolePermissionEntitySchema = z.object({}).merge(BaseEntitySchema);

export type RolePermissionCreatePayload = z.infer<typeof RolePermissionCreateSchema>;
export type RolePermissionEntity = z.infer<typeof RolePermissionEntitySchema>;
