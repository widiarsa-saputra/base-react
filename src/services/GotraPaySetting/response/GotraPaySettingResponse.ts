import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { GotraPaySettingEntitySchema } from "../schema/GotraPaySettingSchema";

export const GotraPaySettingResponseSchema = BaseResponseSchema(GotraPaySettingEntitySchema);
export type GotraPaySettingResponse = z.infer<typeof GotraPaySettingResponseSchema>;
