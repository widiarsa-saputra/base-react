# Module Realtime And WebSocket

## Cakupan

Area realtime untuk koneksi socket, broadcast event, submit post realtime, dan chat component pendukung.

## File mapping utama

| File | Fungsi |
| --- | --- |
| `src/services/web-socket/lib/socket.ts` | Inisialisasi/utility socket client |
| `src/services/web-socket/lib/type.ts` | Type realtime |
| `src/services/web-socket/hooks/useWebSocket.ts` | Hook koneksi socket |
| `src/services/web-socket/hooks/useBroadcastEvent.ts` | Hook kirim event broadcast |
| `src/services/web-socket/hooks/useSubmitPost.ts` | Hook submit post berbasis realtime |
| `src/services/web-socket/schema/AddPostSchema.ts` | Payload terkait post realtime |
| `src/shared/components/facebook-style-chat/*` | Chat UI dan hook socket chat |

## Environment yang dipakai

- `VITE_WEBSOCKET_URL`
- `VITE_WEBSOCKET_ROOM_ID`

## Saat mengubah realtime behavior

1. Cek apakah logic berada di service socket umum atau hook chat spesifik.
2. Pastikan payload schema sinkron dengan emit/listener.
3. Verifikasi apakah room/channel berasal dari env atau hardcoded di feature.
4. Hati-hati dengan cleanup listener agar tidak dobel subscribe.
