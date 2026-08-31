// lib/type.ts

import type { SocketEventMap } from './socket';

export interface BaseSocketEvent<T = unknown> {
    room_id?: string;
    room?: string;

    event_type?: string;
    type?: string;

    json_payload?: T;
    payload?: T;
}

/*
HELPER TYPE
*/
export type TypedSocketEvent<
    TEvent extends keyof SocketEventMap
> = BaseSocketEvent<
    SocketEventMap[TEvent]
> & {
    event_type: TEvent;
};