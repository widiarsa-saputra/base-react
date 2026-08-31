import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { LogActivityIndexSchema } from "../schema/LogActivitySchema";

export const LogActivityListResponseSchema = BaseResponseSchema(z.array(LogActivityIndexSchema));
export type LogActivityListResponse = z.infer<typeof LogActivityListResponseSchema>;

export const LogActivityShowResponseSchema = BaseResponseSchema(LogActivityIndexSchema);
export type LogActivityShowResponse = z.infer<typeof LogActivityShowResponseSchema>;
