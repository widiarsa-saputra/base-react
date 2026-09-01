# IndexAi

Folder ini adalah entry point untuk AI yang akan membaca, memodifikasi, atau menambah fitur di project `base-react`.

## Cara pakai cepat

1. Mulai dari dokumen ini.
2. Baca [project-overview.md](./project-overview.md) untuk arsitektur umum.
3. Lanjut ke dokumen modul yang paling dekat dengan perubahan yang ingin dibuat.
4. Gunakan [system-design.md](./system-design.md) sebagai acuan desain, struktur page, dan pola implementasi baru.

## Peta dokumen

| Dokumen | Fokus | Kapan dibaca |
| --- | --- | --- |
| [project-overview.md](./project-overview.md) | Gambaran arsitektur, alur request, folder penting, aturan perubahan | Wajib dibaca sebelum kerja besar |
| [module-app-shell-and-routing.md](./module-app-shell-and-routing.md) | Entrypoint, router, layout, topbar, sidebar, i18n | Saat tambah page, menu, route, layout |
| [module-auth-and-access.md](./module-auth-and-access.md) | Login, auth session, middleware route, permission awareness | Saat ubah login, proteksi route, session |
| [module-user-access-control.md](./module-user-access-control.md) | User, role, permission, role-permission, user-role | Saat ubah RBAC dan admin master data |
| [module-content-and-master-data.md](./module-content-and-master-data.md) | Labels, posts, permission CRUD pattern, DataPageTemplate | Saat tambah CRUD module baru |
| [module-profile-and-activity.md](./module-profile-and-activity.md) | Profile user login, ganti password, log activity | Saat ubah area akun user |
| [module-file-and-media.md](./module-file-and-media.md) | File manager, upload, media picker, file service | Saat ubah upload/file browser |
| [module-settings-and-integrations.md](./module-settings-and-integrations.md) | WhatsApp, email, cron test, integrasi sistem | Saat ubah halaman settings |
| [module-gotrapay.md](./module-gotrapay.md) | GotraPay setting dan invoice flow | Saat ubah payment/invoice |
| [module-realtime-and-websocket.md](./module-realtime-and-websocket.md) | WebSocket client, broadcast, submit post, chat hooks | Saat ubah realtime behavior |
| [module-shared-foundation.md](./module-shared-foundation.md) | Shared UI, generic form/table/helper, service base | Saat butuh file fondasi/pola reusable |
| [system-design.md](./system-design.md) | Standar desain dan implementasi fitur baru | Wajib dibaca sebelum membuat feature baru |

## Pemetaan module ke folder source

| Area | Folder utama |
| --- | --- |
| App shell | `src/main.tsx`, `src/router`, `src/layouts`, `src/shared/context` |
| Auth | `src/auth`, `src/api/api.ts` |
| Feature UI | `src/features/*` |
| Data layer | `src/services/*` |
| Shared reusable UI | `src/shared`, `src/components`, `src/components/ui` |
| Helper/library | `src/lib`, `src/hooks`, `src/types`, `src/locales` |

## Aturan cepat untuk AI

- Saat menambah feature CRUD baru, ikuti pasangan `src/features/<module>` dan `src/services/<module>`.
- Saat menambah route baru, sentuh `src/router/AppRouter.tsx` dan biasanya `src/layouts/AdminLayout.tsx` bila perlu menu.
- Saat menambah request API, cek dulu apakah cukup memakai base hooks di `src/services/base/hooks`.
- Saat mengubah page data, cek dulu apakah pattern terbaiknya adalah `DataPageTemplate`.
- Hindari membuat pola baru bila pattern setara sudah ada di `user-management`, `labels`, `post`, `permission`, atau `gotrapay-invoice`.

## Modul referensi terbaik

- CRUD data page paling kaya: `user-management`
- CRUD ringan: `labels`, `post`, `permission`
- Page multi-area/tab: `settings`, `GotraPaySetting`
- Split list-detail pada satu page: `gotrapay-invoice`
- Profile/account page: `profile`
- Realtime hooks: `services/web-socket` dan `shared/components/facebook-style-chat`
