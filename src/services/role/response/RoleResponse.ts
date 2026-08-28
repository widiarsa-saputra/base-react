import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { RoleIndexSchema } from "../schema/RoleSchema";

export const RoleListResponseSchema = BaseResponseSchema(z.union([z.array(RoleIndexSchema), RoleIndexSchema]));
export type RoleListResponse = z.infer<typeof RoleListResponseSchema>;

export const RoleCreateResponseSchema = BaseResponseSchema(RoleIndexSchema);
export type RoleCreateResponse = z.infer<typeof RoleCreateResponseSchema>;

export const RoleUpdateResponseSchema = BaseResponseSchema(RoleIndexSchema);
export type RoleUpdateResponse = z.infer<typeof RoleUpdateResponseSchema>;

export const RoleShowResponseSchema = BaseResponseSchema(RoleIndexSchema);
export type RoleShowResponse = z.infer<typeof RoleShowResponseSchema>;
