import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { NotificationEmailSettingSchema, NotificationWhatsappSessionSchema, NotificationCronTestEntitySchema } from "../schema/NotificationSchema";

export const NotificationEmailSettingShowResponseSchema = BaseResponseSchema(NotificationEmailSettingSchema);
export type NotificationEmailSettingShowResponse = z.infer<typeof NotificationEmailSettingShowResponseSchema>;

export const NotificationWhatsappSessionShowResponseSchema = BaseResponseSchema(NotificationWhatsappSessionSchema);
export type NotificationWhatsappSessionShowResponse = z.infer<typeof NotificationWhatsappSessionShowResponseSchema>;

export const NotificationCronTestIndexResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(NotificationCronTestEntitySchema)
}).passthrough();
export type NotificationCronTestIndexResponse = z.infer<typeof NotificationCronTestIndexResponseSchema>;

export const NotificationCronTestShowResponseSchema = BaseResponseSchema(NotificationCronTestEntitySchema);
export type NotificationCronTestShowResponse = z.infer<typeof NotificationCronTestShowResponseSchema>;
