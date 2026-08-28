import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { PermissionIndexSchema } from "../schema/PermissionSchema";

export const PermissionListResponseSchema = BaseResponseSchema(z.array(PermissionIndexSchema));
export type PermissionListResponse = z.infer<typeof PermissionListResponseSchema>;

export const PermissionCreateResponseSchema = BaseResponseSchema(PermissionIndexSchema);
export type PermissionCreateResponse = z.infer<typeof PermissionCreateResponseSchema>;

export const PermissionUpdateResponseSchema = BaseResponseSchema(PermissionIndexSchema);
export type PermissionUpdateResponse = z.infer<typeof PermissionUpdateResponseSchema>;

export const PermissionShowResponseSchema = BaseResponseSchema(PermissionIndexSchema);
export type PermissionShowResponse = z.infer<typeof PermissionShowResponseSchema>;
