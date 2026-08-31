import { z } from "zod";
import { GeneralResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { NotificationWhatsAppIndexSchema } from "../schema/NotificationWhatsAppSchema";

export const NotificationWhatsAppShowResponseSchema = GeneralResponseSchema.extend({
    data: NotificationWhatsAppIndexSchema,
});
export type NotificationWhatsAppShowResponse = z.infer<typeof NotificationWhatsAppShowResponseSchema>;

export const NotificationWhatsAppCreateUpdateResponseSchema = GeneralResponseSchema.extend({
    data: NotificationWhatsAppIndexSchema,
});
export type NotificationWhatsAppCreateUpdateResponse = z.infer<typeof NotificationWhatsAppCreateUpdateResponseSchema>;
