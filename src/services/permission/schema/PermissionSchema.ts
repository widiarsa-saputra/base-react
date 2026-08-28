import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { nullableSchema } from "@/lib/utils";

export const PermissionCreateSchema = z.object({
    display_name: z.string().min(1, "Display name is required"),
    group: z.string().min(1, "Group is required"),
    name: z.string().min(1, "Name is required"),
});

export const PermissionUpdateSchema = PermissionCreateSchema.partial();

export const PermissionSchemaUpdate = PermissionUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

const PermissionRoleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

export const PermissionIndexSchema = z.object(nullableSchema(PermissionUpdateSchema))
    .extend({
        roles: z.array(PermissionRoleSchema).optional()
    })
    .merge(BaseEntitySchema);

export type PermissionCreatePayload = z.infer<typeof PermissionCreateSchema>;
export type PermissionUpdatePayload = z.infer<typeof PermissionUpdateSchema>;
export type PermissionFormUpdatePayload = z.infer<typeof PermissionSchemaUpdate>;
export type PermissionEntity = z.infer<typeof PermissionIndexSchema>;
