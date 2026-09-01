# Module Shared Foundation

## Cakupan

Semua fondasi reusable yang dipakai lintas banyak modul.

## Folder penting

| Folder/File | Fungsi |
| --- | --- |
| `src/components/ui/*` | Primitive UI dan template seperti `data-page-template.tsx` |
| `src/components/*` | Komponen global tambahan, input khusus, wizard, upload, rich text |
| `src/shared/components/*` | Komponen reusable tingkat aplikasi: table, modal, sidebar, topbar, form, loader, notification |
| `src/shared/hooks/*` | Hook utilitas aplikasi |
| `src/services/base/hooks/*` | Base abstraction untuk query/mutation CRUD |
| `src/lib/utils.ts` | Utility umum className, format, helper lain |
| `src/lib/queryClient.ts` | Query client global |
| `src/api/api.ts` | HTTP transport utama |

## File referensi kunci

- `src/components/ui/data-page-template.tsx`
  Blueprint paling penting untuk page CRUD baru.
- `src/shared/components/table/BaseTable.tsx`
  Dasar tabel sortable/copy/render custom.
- `src/shared/components/modal/Modal.tsx`
  Dasar modal reusable.
- `src/shared/hooks/useDebounce.ts`
  Dipakai banyak page search.
- `src/shared/hooks/useFormSubmit.tsx`
  Helper submit flow.

## Kapan harus menyentuh foundation

- Saat pola dibutuhkan oleh lebih dari satu modul.
- Saat bug terjadi lintas banyak page.
- Saat ingin menambah capability umum seperti column behavior, managed form, atau loading state generik.

## Kapan jangan menyentuh foundation dulu

- Jika perubahan hanya spesifik satu modul.
- Jika belum yakin contract lama dipakai berapa banyak tempat.
- Jika ada solusi lokal yang lebih aman dan cepat untuk kebutuhan sangat spesifik.
