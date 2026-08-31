import { io } from 'socket.io-client';
import { AddPost } from '../schema/AddPostSchema';

const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL || "https://realtime-data.gotrasoft.com";

export const socket = io(
    SOCKET_URL,
    {
        transports: ['polling'],
        reconnectionAttempts: 10,
        autoConnect: false,
    }
);

export const types = {
    addPost: "add-post"
} as const;

/*
MAP EVENT => PAYLOAD
*/
export interface SocketEventMap {
    [types.addPost]: AddPost;
}