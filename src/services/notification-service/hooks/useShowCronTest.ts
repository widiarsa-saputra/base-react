import useBaseShow from "@/services/base/hooks/useBaseShow";
import { SingleCronTestSchema } from "../response/CronTestResponse";

const API_VERSION = "v1";

const useShowCronTest = (id: string) => {
    return useBaseShow<any>({
        request: {
            endpoint: `${API_VERSION}/notif-cron-test`,
            id
        },
        schema: SingleCronTestSchema,
        query: {
            key: "cron-test-detail",
            enabled: !!id
        }
    });
};

export default useShowCronTest;
