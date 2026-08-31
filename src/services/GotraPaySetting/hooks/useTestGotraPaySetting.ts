import useBaseShow from "@/services/base/hooks/useBaseShow";
import { GotraPaySettingResponse, GotraPaySettingResponseSchema } from "../response/GotraPaySettingResponse";

export const useTestGotraPaySetting = (enabled: boolean = false) => {
    return useBaseShow<GotraPaySettingResponse>({
        request: {
            endpoint: `v1/gotrapay/setting`,
            id: "test"
        },
        schema: GotraPaySettingResponseSchema,
        query: {
            key: "gotrapay-setting-test",
            enabled
        }
    });
};
