import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SocketEventMap } from '../lib/socket';

import type {
    TypedSocketEvent,
} from '../lib/type';

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || "https://realtime-data.gotrasoft.com";
const ROOM_ID =
    import.meta.env.VITE_ROOM_ID || "jennys-kitchen";

const useWebSocket = <
    TEvent extends keyof SocketEventMap
>(
    eventName: TEvent
) => {
    type Payload =
        SocketEventMap[TEvent];
    type Event =
        TypedSocketEvent<TEvent>;
    const [events, setEvents] =
        useState<Event[]>([]);
    const [lastEvent, setLastEvent] =
        useState<Event | null>(null);
    const [connected, setConnected] =
        useState(false);
    const [loading, setLoading] =
        useState(false);
    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        console.log("[WEBSOCKET] Initializing socket connection to:", SOCKET_URL);
        const socket = io(SOCKET_URL, {
            transports: ['polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 3000,
            timeout: 20000,
        });

        const onConnect = () => {
            setConnected(true);
            console.log("[WEBSOCKET] Connected. Joining room:", ROOM_ID);
            socket.emit(
                'join_room',
                {
                    room_id: ROOM_ID,
                }
            );
            setLoading(false);
        };

        const onError = (
            err: Error
        ) => {
            console.error("[WEBSOCKET] Connection error:", err.message);
            setError(err.message);
            setLoading(false);
        };

        const onDisconnect = () => {
            console.log("[WEBSOCKET] Disconnected.");
            setConnected(false);
        };

        const onNewData = (
            data: Event
        ) => {
            console.log("test")
            const room =
                data.room_id ||
                data.room;

            if (room !== ROOM_ID) {
                console.log("[WEBSOCKET] Room mismatch. Expected:", ROOM_ID, "Got:", room);
                return;
            }

            const type =
                data.event_type ||
                data.type;

            const normalizedType = type?.replace('_', '-');
            const normalizedExpected = eventName.replace('_', '-');

            if (normalizedType !== normalizedExpected) {
                console.log("[WEBSOCKET] Event type mismatch. Expected:", eventName, "Got:", type);
                return;
            }

            const payloadData = data.json_payload ?? data.payload;
            console.log("[WEBSOCKET] Match found! Event:", type, "Payload:", payloadData);
            setLastEvent(data);

            setEvents(prev => [
                ...prev,
                data,
            ]);
        };

        socket.on('new_data', onNewData);
        socket.on('connect', onConnect);
        socket.on('connect_error', onError);
        socket.on('disconnect', onDisconnect);

        return () => {
            console.log("[WEBSOCKET] Disconnecting and cleaning up...");
            socket.disconnect();
        };

    }, [eventName]);


    return {
        isSuccess: connected,
        isFetching: loading,
        isError: error,

        lastData: lastEvent,

        data:
            events.map(
                event =>
                    event.json_payload ??
                    event.payload
            ) as Payload[],
    };
};

export default useWebSocket;
