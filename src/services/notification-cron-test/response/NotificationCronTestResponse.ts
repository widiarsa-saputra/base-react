import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { NotificationCronTestIndexSchema } from "../schema/NotificationCronTestSchema";

export const NotificationCronTestListResponseSchema = BaseResponseSchema(z.array(NotificationCronTestIndexSchema));
export type NotificationCronTestListResponse = z.infer<typeof NotificationCronTestListResponseSchema>;

export const NotificationCronTestShowResponseSchema = BaseResponseSchema(NotificationCronTestIndexSchema);
export type NotificationCronTestShowResponse = z.infer<typeof NotificationCronTestShowResponseSchema>;

export const NotificationCronTestCreateResponseSchema = BaseResponseSchema(NotificationCronTestIndexSchema);
export type NotificationCronTestCreateResponse = z.infer<typeof NotificationCronTestCreateResponseSchema>;
