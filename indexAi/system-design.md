# System Design Frontend

Dokumen ini menjadi acuan desain dan implementasi agar fitur baru di project ini terasa sejenis dengan fitur yang sudah ada.

## 1. Prinsip desain

- Bangun admin panel yang bersih, cepat dipahami, dan terasa operasional.
- Utamakan konsistensi pattern daripada eksperimen UI per page.
- Pisahkan dengan tegas layer UI, state view, dan data fetching.
- Gunakan visual hierarchy yang jelas: page title, description, actions, content block.

## 2. Arsitektur yang harus diikuti

### Layer

- `features`
  Semua UI spesifik domain.
- `services`
  Semua akses API, schema Zod, response type, dan query/mutation hook.
- `shared/components` atau `components/ui`
  Reusable component umum.

### Aturan

- Jangan panggil `axios` langsung dari komponen feature bila sudah bisa dibungkus service hook.
- Jangan campur schema validasi dengan komponen page.
- Gunakan `privateApi` untuk endpoint authenticated dan `publicApi` untuk public flow.

## 3. Standar page baru

Setiap page baru idealnya punya struktur:

1. `src/features/<module>/pages/<Module>Page.tsx`
2. `src/features/<module>/components/<Module>MainContent.tsx`
3. `src/features/<module>/components/<Module>MutationForm.tsx` jika ada form
4. `src/services/<module>/schema/<Module>Schema.ts`
5. `src/services/<module>/response/<Module>Response.ts`
6. `src/services/<module>/hooks/use<Module>CRUD.ts` atau hook spesifik lain

## 4. Pattern UI yang direkomendasikan

### Untuk CRUD data

- Utamakan `DataPageTemplate`.
- Gunakan `BaseTable` lewat template, bukan membangun tabel baru dari nol.
- Gunakan topbar global untuk search, filter, dan extra action.
- Reset pagination ke page 1 saat search/filter/sort berubah.

### Untuk form

- Gunakan React Hook Form + Zod resolver.
- Pisahkan field form ke komponen khusus.
- Default values harus eksplisit.
- Nama field mengikuti schema, bukan mapping manual yang berbeda-beda.

### Untuk feedback user

- Pertahankan loading, success, error state yang jelas.
- Gunakan toast/feedback pattern yang sudah ada.
- Jangan menambah pola alert baru jika kebutuhan bisa memakai komponen existing.

## 5. Standar visual

- Ikuti Tailwind utility dan token class yang sudah ada.
- Gunakan card, table, modal, badge, dan tabs dari primitive existing.
- Pertahankan gaya admin existing: ringkas, rapi, banyak whitespace, dan fokus pada keterbacaan data.
- Jangan introduce design system baru per fitur.

## 6. Standar navigasi

- Route didefinisikan terpusat di `src/router/AppRouter.tsx`.
- Menu sidebar harus relevan dengan route yang memang dipakai user.
- Route public dan protected harus dibedakan jelas.

## 7. Standar naming

- Page: `PascalCasePage.tsx`
- Main content: `PascalCaseMainContent.tsx`
- Form: `PascalCaseMutationForm.tsx`
- Hook CRUD: `use<Domain>CRUD.ts` atau hook spesifik seperti `useGet...`, `useUpdate...`
- Schema: `<Domain>Schema.ts`
- Response: `<Domain>Response.ts`

## 8. Checklist saat membuat feature baru

1. Tentukan domain feature dan route-nya.
2. Tentukan apakah feature ini CRUD, dashboard, tabbed settings, atau list-detail split.
3. Pilih blueprint terdekat:
   - CRUD kaya fitur: `user-management`
   - CRUD sederhana: `labels` atau `permission`
   - Tabbed page: `settings` atau `GotraPaySetting`
   - List-detail page: `gotrapay-invoice`
4. Buat service, schema, dan response lebih dulu.
5. Baru buat UI page dan wiring topbar.
6. Verifikasi invalidation query, permission, dan navigasi.

## 9. Checklist saat memodifikasi feature lama

1. Cari page dan main content.
2. Cari service hook yang dipakai.
3. Cari schema dan response yang berhubungan.
4. Cek reusable component yang mungkin terdampak.
5. Pastikan perubahan tidak memutus sorting, pagination, filter, dan loading state.

## 10. Anti-pattern yang sebaiknya dihindari

- Logic API langsung di komponen page.
- State form dan state modal tersebar di banyak file tanpa alasan.
- Menambah komponen UI baru padahal komponen reusable existing sudah cukup.
- Mengubah foundation untuk kebutuhan yang masih spesifik satu page.
- Menyimpan URL endpoint hardcoded di komponen.

## 11. Source of truth implementasi

- App shell dan route: `src/main.tsx`, `src/router/AppRouter.tsx`, `src/layouts/AdminLayout.tsx`
- CRUD page template: `src/components/ui/data-page-template.tsx`
- Data layer: `src/services/base/hooks/*`, `src/api/api.ts`
- Kompleks CRUD reference: `src/features/user-management/components/UserMainContent.tsx`
- Multi-tab reference: `src/features/settings/components/SettingsPageContent.tsx`
- List-detail reference: `src/features/gotrapay-invoice/components/GotraPayInvoiceListContent.tsx`
