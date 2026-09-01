import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const AppSettingCreateSchema = z.object({
    key: z.string().min(1, { message: "Key wajib diisi" }),
    value: z.any({ required_error: "Value wajib diisi" }),
    desc: z.string().optional().nullable(),
});

export const AppSettingUpdateSchema = AppSettingCreateSchema.partial();

export const AppSettingIndexSchema = BaseEntitySchema.extend({
    key: z.string().optional().nullable(),
    value: z.any().optional().nullable(),
    desc: z.string().optional().nullable(),
});

export type AppSettingCreatePayload = z.infer<typeof AppSettingCreateSchema>;
export type AppSettingUpdatePayload = z.infer<typeof AppSettingUpdateSchema>;
export type AppSettingEntity = z.infer<typeof AppSettingIndexSchema>;
