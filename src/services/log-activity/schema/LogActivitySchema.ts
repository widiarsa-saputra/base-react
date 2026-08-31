import { z } from "zod";
import { BaseEntitySchema } from "@/services/base/response/BaseResponseSchema";

export const LogActivityUserSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
});

export const LogActivityPropertiesSchema = z.object({
    old: z.union([z.record(z.unknown()), z.array(z.unknown())]).optional().nullable(),
    attributes: z.record(z.unknown()).optional().nullable(),
});

export const LogActivityIndexSchema = BaseEntitySchema.extend({
    event: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    subject_id: z.string().optional().nullable(),
    subject_type: z.string().optional().nullable(),
    user: LogActivityUserSchema.optional().nullable(),
    properties: LogActivityPropertiesSchema.optional().nullable(),
});

export type LogActivityUserEntity = z.infer<typeof LogActivityUserSchema>;
export type LogActivityPropertiesEntity = z.infer<typeof LogActivityPropertiesSchema>;
export type LogActivityEntity = z.infer<typeof LogActivityIndexSchema>;
