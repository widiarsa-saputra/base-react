import { useState } from 'react';

type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonValue[];
type JsonObject = {
    [key: string]: JsonValue;
};
const BROADCAST_URL = import.meta.env.VITE_SOCKET_URL;
const ROOM_ID = import.meta.env.VITE_ROOM_ID ;
const useBroadcastEvent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | string | null>(null);
    const sendEvent = async (
        eventType: string,
        payload: JsonObject
    ) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${BROADCAST_URL}/api/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    room_id: ROOM_ID,
                    event_type: eventType,
                    json_payload: payload,
                }),
            });
            const result = await response.json();
            return {
                success: true,
                data: result,
            };;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error broadcast!."
            console.error('Gagal mengirim event:', err);
            setError(message);
            return {
                success: false,
                data: null
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        sendEvent,
        loading,
        error,
    };
};

export default useBroadcastEvent;