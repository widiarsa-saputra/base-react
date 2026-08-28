import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { EmailSettingUpdatePayload } from "../schema/EmailSettingSchema";
import { z } from "zod";

const API_VERSION = "v1";

const useUpdateEmailSetting = () => {
    return useBaseUpdate<EmailSettingUpdatePayload, unknown, { id: string }>({
        endpoint: () => `${API_VERSION}/notification-services/email/setting`,
        schema: z.any(),
        queryKey: "email-settings",
    });
};

export default useUpdateEmailSetting;
