import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";
import { nullableSchema } from "@/lib/utils";
import { PermissionIndexSchema as PermissionSchema } from "@/services/permission/schema/PermissionSchema";

export const UserCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional().nullable(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const UserUpdateSchema = UserCreateSchema.partial();

export const UserSchemaUpdate = UserUpdateSchema.extend({
    id: z.union([z.string(), z.number()]),
});

const UserRoleSchema = z.object({
    id: z.number(),
    display_name: z.string(),
    name: z.string(),
});

export const UserIndexSchema = z.object(nullableSchema(UserUpdateSchema))
    .extend({
        roles: z.array(UserRoleSchema).optional(),
        permissions: z.array(PermissionSchema).optional()
    })
    .merge(BaseEntitySchema);

export type UserCreatePayload = z.infer<typeof UserCreateSchema>;
export type UserUpdatePayload = z.infer<typeof UserUpdateSchema>;
export type UserFormUpdatePayload = z.infer<typeof UserSchemaUpdate>;
export type UserEntity = z.infer<typeof UserIndexSchema>;
