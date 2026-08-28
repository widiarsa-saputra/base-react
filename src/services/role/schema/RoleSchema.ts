import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { nullableSchema } from "@/lib/utils";
import { UserIndexSchema as SingleUserSchema } from "@/services/user/schema/UserSchema";
import { PermissionIndexSchema as PermissionSchema } from "@/services/permission/schema/PermissionSchema";

export const RoleCreateSchema = z.object({
    display_name: z.string().min(1, "Display name is required"),
    name: z.string().min(1, "Name is required"),
});

export const RoleUpdateSchema = RoleCreateSchema.partial();

export const RoleSchemaUpdate = RoleUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

export const RoleIndexSchema = z.object(nullableSchema(RoleUpdateSchema))
    .extend({
        users: z.nullable(z.array(SingleUserSchema)).optional(),
        permissions: z.nullable(z.array(PermissionSchema)).optional(),
    })
    .merge(BaseEntitySchema);

export type RoleCreatePayload = z.infer<typeof RoleCreateSchema>;
export type RoleUpdatePayload = z.infer<typeof RoleUpdateSchema>;
export type RoleFormUpdatePayload = z.infer<typeof RoleSchemaUpdate>;
export type RoleEntity = z.infer<typeof RoleIndexSchema>;
