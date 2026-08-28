import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { z } from "zod";

const API_VERSION = "v1";

export interface SendEmailPayload {
    to: string;
    subject: string;
    body: string;
    is_html?: boolean;
    cc?: string[];
    bcc?: string[];
}

const useSendEmail = () => {
    return useBaseCreate<SendEmailPayload, unknown, { id: string }>({
        endpoint: `${API_VERSION}/notification-services/email/send`,
        schema: z.unknown(),
        queryKey: 'email-send'
    });
};

export default useSendEmail;
