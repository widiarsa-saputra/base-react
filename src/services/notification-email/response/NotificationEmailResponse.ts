import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { NotificationEmailIndexSchema } from "../schema/NotificationEmailSchema";

export const NotificationEmailShowResponseSchema = BaseResponseSchema(NotificationEmailIndexSchema);
export type NotificationEmailShowResponse = z.infer<typeof NotificationEmailShowResponseSchema>;

export const NotificationEmailCreateResponseSchema = BaseResponseSchema(NotificationEmailIndexSchema);
export type NotificationEmailCreateResponse = z.infer<typeof NotificationEmailCreateResponseSchema>;
