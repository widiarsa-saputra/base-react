import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { CronTestCreatePayload } from "../schema/CronTestSchema";
import { z } from "zod";

const API_VERSION = "v1";

const useCreateCronTest = () => {
    return useBaseCreate<CronTestCreatePayload, unknown, { id: string }>({
        endpoint: `${API_VERSION}/notif-cron-test`,
        schema: z.any(),
        queryKey: "cron-test-list",
    });
};

export default useCreateCronTest;
