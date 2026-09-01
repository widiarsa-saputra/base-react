# Module App Shell And Routing

## Tanggung jawab

Modul ini mengatur bootstrapping aplikasi, router, layout admin, topbar action, sidebar, dan resource global seperti i18n serta query client.

## File mapping utama

| File | Fungsi |
| --- | --- |
| `src/main.tsx` | Root render, provider global, refetch `auth/me` saat window focus |
| `src/router/AppRouter.tsx` | Definisi route, menu section, dan mapping page |
| `src/layouts/AdminLayout.tsx` | Struktur dashboard shell, sidebar resizable, topbar |
| `src/shared/context/TopbarActionContext.tsx` | Registrasi search, filter, extra action per page |
| `src/shared/components/topbar/*` | UI topbar |
| `src/shared/components/sidebar/*` | UI sidebar desktop/mobile |
| `src/i18n.ts` | Inisialisasi i18n |
| `src/locales/en.json` | Locale EN |
| `src/locales/id.json` | Locale ID |
| `src/lib/queryClient.ts` | Konfigurasi global React Query |

## Route aktif yang saat ini ada

- Dashboard
- Labels
- User Management
- Permissions
- Settings
- Roles
- Role users assigned
- Role permissions assigned
- Profile
- File Manager
- Log Activity
- Posts
- GotraPay Setting
- GotraPay Invoices
- Payment success
- Payment failed
- Authentication
- Forbidden
- Not found

## Saat menambah page baru

1. Buat page di `src/features/<module>/pages`.
2. Tambahkan route di `src/router/AppRouter.tsx`.
3. Jika route perlu tampil di navigasi admin, tambahkan item menu di `AdminLayout.tsx` atau gunakan metadata menu yang sudah ada.
4. Jika page butuh search/filter/action di topbar, daftarkan lewat `useTopbarActions`.

## Saat mengubah topbar atau sidebar

- Mulai dari `TopbarActionContext.tsx` untuk memahami contract action.
- Cek `TopBar.tsx`, `SidebarDrawer.tsx`, `SideBar.tsx`, `SidebarContent.tsx`, dan `SidebarItem.tsx`.
- Pastikan mobile dan desktop tetap selaras karena sidebar ada dua jalur render.

## Pola yang harus dipertahankan

- Page tidak perlu memegang state topbar global secara manual di layout.
- Route protection tetap diputuskan di router melalui middleware auth.
- Layout admin dipakai oleh page internal, sedangkan login/public pages tidak memakai shell ini.
