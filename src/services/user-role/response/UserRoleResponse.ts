import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { UserIndexSchema } from "@/services/user/schema/UserSchema";
import { RoleIndexSchema } from "@/services/role/schema/RoleSchema";

export const UserRoleSyncUsersResponseSchema = BaseResponseSchema(RoleIndexSchema);
export type UserRoleSyncUsersResponse = z.infer<typeof UserRoleSyncUsersResponseSchema>;

export const UserRoleSyncRolesResponseSchema = BaseResponseSchema(UserIndexSchema);
export type UserRoleSyncRolesResponse = z.infer<typeof UserRoleSyncRolesResponseSchema>;
