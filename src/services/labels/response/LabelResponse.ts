import { z } from "zod";
import { BaseResponseSchema } from "@/services/base/response/BaseResponseSchema";
import { LabelIndexSchema } from "../schema/LabelSchema";

export const LabelListResponseSchema = BaseResponseSchema(z.array(LabelIndexSchema));
export type LabelListResponse = z.infer<typeof LabelListResponseSchema>;

export const LabelShowResponseSchema = BaseResponseSchema(LabelIndexSchema);
export type LabelShowResponse = z.infer<typeof LabelShowResponseSchema>;

export const LabelCreateResponseSchema = BaseResponseSchema(LabelIndexSchema);
export type LabelCreateResponse = z.infer<typeof LabelCreateResponseSchema>;

export const LabelUpdateResponseSchema = BaseResponseSchema(LabelIndexSchema);
export type LabelUpdateResponse = z.infer<typeof LabelUpdateResponseSchema>;
