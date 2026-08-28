import { useBaseUpdate } from "@/services/base/hooks/useBaseUpdate";
import { z } from "zod";

const API_VERSION = "v1";

const useUpdateWhatsappSession = () => {
    return useBaseUpdate<{ session_id: string }, unknown, { id: string }>({
        endpoint: () => `${API_VERSION}/notification-services/whatsapp/session`,
        schema: z.any(), // We can use z.any() if we don't need strict validation for the response
        queryKey: "whatsapp-session",
    });
};

export default useUpdateWhatsappSession;
