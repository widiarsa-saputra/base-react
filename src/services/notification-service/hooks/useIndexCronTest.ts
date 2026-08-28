import useBaseIndex from "@/services/base/hooks/useBaseIndex";
import { SingleCronTestSchema } from "../response/CronTestResponse";
import { z } from "zod";

const API_VERSION = "v1";

const PaginatedDataSchema = z.object({
    data: z.array(SingleCronTestSchema),
    total: z.number().optional()
}).passthrough();

const CronTestSchema = z.object({
    success: z.boolean().optional(),
    data: z.union([
        z.array(SingleCronTestSchema),
        PaginatedDataSchema
    ]).optional()
}).passthrough();

export type CronTestResponse = z.infer<typeof CronTestSchema>;

const useIndexCronTest = (params?: Record<string, unknown>) => {
    return useBaseIndex<CronTestResponse>({
        request: {
            endpoint: `${API_VERSION}/notif-cron-test`,
        },
        schema: CronTestSchema,
        query: {
            key: "cron-test-list",
            ...params
        }
    });
};

export default useIndexCronTest;
