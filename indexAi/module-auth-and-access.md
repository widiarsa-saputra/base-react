# Module Auth And Access

## Tanggung jawab

Mengelola login, session local, identitas user aktif, middleware route, dan utilitas akses.

## File mapping utama

| File | Fungsi |
| --- | --- |
| `src/auth/pages/LoginPage.tsx` | Halaman login |
| `src/auth/components/LoginFormWithGraphic.tsx` | UI form login |
| `src/auth/hooks/useLogin.ts` | Mutation login |
| `src/auth/hooks/useUser.ts` | Query user aktif |
| `src/auth/context/AuthProvider.tsx` | Context auth untuk app |
| `src/auth/services/authService.ts` | Simpan token dan user ke localStorage |
| `src/auth/middleware/RequireAuth.tsx` | Proteksi route private |
| `src/auth/middleware/GuestOnly.tsx` | Batasi route hanya untuk guest |
| `src/auth/pages/ForbiddenPage.tsx` | Halaman 403 |
| `src/auth/utils/utils.ts` | Utility auth tambahan |
| `src/api/api.ts` | Attach token, redirect saat 401, invalidate `auth/me` saat 403 |

## Perilaku penting

- Token diambil dari `authService`, bukan akses localStorage langsung di banyak tempat.
- `privateApi` akan redirect ke `/authentication` saat 401.
- Saat 403, query `['auth', 'me']` di-invalidasi agar permission terbaru tersinkron.
- `main.tsx` juga meng-invalidasi `['auth', 'me']` saat window focus.

## Saat mengubah login/session

1. Cek `loginResponseSchema` dan `loginSchemas`.
2. Cek mutation login dan cara session dimulai di `authService`.
3. Verifikasi `RequireAuth`, `GuestOnly`, dan redirect sesudah login/logout.
4. Pastikan perubahan tidak merusak `useUser()` dan page yang bergantung pada data user aktif.

## Saat menambah permission-aware UI

- Cari penggunaan `permissions` atau `roles` di `AppRouter.tsx`, sidebar, dan feature terkait.
- Bila akses route berubah, update definisi route dan uji fallback ke forbidden.
