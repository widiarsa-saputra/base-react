import { useBaseCreate } from "@/services/base/hooks/useBaseCreate";
import { z } from "zod";

const API_VERSION = "v1";

interface SendMessagePayload {
    to: string;
    message: string;
}

const useSendWhatsappMessage = () => {
    return useBaseCreate<SendMessagePayload, unknown, { id: string }>({
        endpoint: `${API_VERSION}/notification-services/whatsapp/messages`,
        schema: z.unknown(),
        queryKey: 'whatsapp-message-send'
    });
};

export default useSendWhatsappMessage;
