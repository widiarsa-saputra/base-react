# Project Overview

## Ringkasan arsitektur

Project ini adalah boilerplate admin panel React 19 + Vite + TypeScript dengan pola modular:

- `src/features/*` berisi page dan komponen UI per domain.
- `src/services/*` berisi hook React Query, schema Zod, dan type response per domain.
- `src/components/ui/*` dan `src/shared/*` menjadi reusable foundation lintas modul.
- `src/auth/*` menangani login, session, dan proteksi halaman.

## Entrypoint utama

- `src/main.tsx`
  Memasang `QueryClientProvider`, `AuthProvider`, `Toaster`, `TopbarActionProvider`, `AppRouter`, dan React Query Devtools.
- `src/router/AppRouter.tsx`
  Menjadi source of truth untuk route dan sebagian metadata menu.
- `src/layouts/AdminLayout.tsx`
  Layout admin utama dengan sidebar, topbar, panel resizable, dan section menu.
- `src/api/api.ts`
  Menyediakan `publicApi` dan `privateApi`, inject bearer token, handle 401/403, dan retry timeout.

## Alur data standar

1. Page feature dirender dari router.
2. Page memanggil main content component.
3. Main content memakai hook service domain.
4. Hook service biasanya membungkus base hook dari `src/services/base/hooks`.
5. HTTP request keluar lewat `publicApi` atau `privateApi`.
6. Validasi input memakai schema Zod domain.
7. Tabel/form biasanya memakai komponen reusable dari `src/shared` atau `src/components/ui`.

## Folder yang paling sering disentuh

| Kebutuhan | Folder/File |
| --- | --- |
| Tambah halaman baru | `src/features/<module>/pages`, `src/router/AppRouter.tsx` |
| Tambah UI CRUD | `src/features/<module>/components` |
| Tambah API domain | `src/services/<module>/hooks`, `schema`, `response` |
| Tambah komponen reusable | `src/shared/components` atau `src/components` |
| Ubah auth/session | `src/auth`, `src/api/api.ts` |
| Ubah layout/nav | `src/layouts/AdminLayout.tsx`, `src/router/AppRouter.tsx`, `src/shared/components/sidebar/*`, `src/shared/components/topbar/*` |

## Aturan implementasi yang sudah terlihat di codebase

- Query dan mutation lebih sering dibungkus custom hook per domain.
- Banyak page data memakai `DataPageTemplate`.
- Search/filter sering didaftarkan ke topbar dengan `useTopbarActions`.
- Schema request/response dipisah jelas di `services/<module>/schema` dan `response`.
- Layout admin tidak di-hardcode di semua page; page biasanya hanya membungkus content.

## Risiko umum saat maintenance

- Route baru tanpa menu sidebar dapat valid tapi sulit ditemukan user.
- Perubahan schema tanpa sinkronisasi form akan memicu bug submit.
- Perubahan query key atau mutation invalidation bisa membuat data stale.
- Mengubah auth/session flow perlu cek 401 redirect, `auth/me`, dan middleware route.
- Ada pola lama dan pola baru di beberapa tempat; utamakan pola yang dominan, bukan sekadar file tertua.

## Checklist sebelum modify fitur

1. Temukan page dan main content feature.
2. Temukan service domain yang dipakai page tersebut.
3. Cek apakah ada schema Zod untuk payload yang terpengaruh.
4. Cek apakah ada reusable component/pattern yang sebaiknya dipakai ulang.
5. Cek route, menu, dan permission impact bila perubahan menyentuh navigasi atau akses.
