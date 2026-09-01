import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { AppSettingIndexSchema } from "../schema/AppSettingSchema";

export const AppSettingListResponseSchema = BaseResponseSchema(z.array(AppSettingIndexSchema));
export type AppSettingListResponse = z.infer<typeof AppSettingListResponseSchema>;

export const AppSettingShowResponseSchema = BaseResponseSchema(AppSettingIndexSchema);
export type AppSettingShowResponse = z.infer<typeof AppSettingShowResponseSchema>;

export const AppSettingCreateResponseSchema = BaseResponseSchema(AppSettingIndexSchema);
export type AppSettingCreateResponse = z.infer<typeof AppSettingCreateResponseSchema>;

export const AppSettingUpdateResponseSchema = BaseResponseSchema(AppSettingIndexSchema);
export type AppSettingUpdateResponse = z.infer<typeof AppSettingUpdateResponseSchema>;
