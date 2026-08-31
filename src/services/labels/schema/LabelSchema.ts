import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const LabelCreateSchema = z.object({
    name: z.string().min(1, { message: "Nama wajib diisi" }),
    color: z.string().min(1, { message: "Warna wajib diisi" }),
});

export const LabelUpdateSchema = LabelCreateSchema.partial();

export const LabelIndexSchema = BaseEntitySchema.extend({
    name: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
});

export type LabelCreatePayload = z.infer<typeof LabelCreateSchema>;
export type LabelUpdatePayload = z.infer<typeof LabelUpdateSchema>;
export type LabelEntity = z.infer<typeof LabelIndexSchema>;
