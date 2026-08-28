import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { RolePermissionEntitySchema } from "../schema/RolePermissionSchema";

export const RolePermissionCreateResponseSchema = BaseResponseSchema(RolePermissionEntitySchema);
export type RolePermissionCreateResponse = z.infer<typeof RolePermissionCreateResponseSchema>;
