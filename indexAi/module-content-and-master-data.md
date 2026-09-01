# Module Content And Master Data

## Cakupan

Dokumen ini memetakan modul CRUD yang paling cocok dijadikan blueprint saat membuat module baru: labels, posts, dan permission-style master data.

## Feature mapping

| Domain | UI files |
| --- | --- |
| Labels | `src/features/labels/pages/LabelPage.tsx`, `components/LabelMainContent.tsx`, `LabelMutationForm.tsx` |
| Posts | `src/features/post/pages/PostPage.tsx`, `components/PostMainContent.tsx`, `PostMutationForm.tsx` |
| Permissions | `src/features/permission/pages/PermissionsPage.tsx`, `components/PermissionMainContent.tsx`, `PermissionMutationForm.tsx` |

## Service mapping

| Domain | Service files |
| --- | --- |
| Labels | `src/services/labels/hooks/useLabelCRUD.ts`, `schema/LabelSchema.ts`, `response/LabelResponse.ts` |
| Posts | `src/services/post/hooks/usePostCRUD.ts`, `schema/PostSchema.ts`, `response/PostResponse.ts` |
| Permissions | `src/services/permission/hooks/usePermissionCRUD.ts`, `schema/PermissionSchema.ts`, `response/PermissionResponse.ts` |

## Pattern yang sebaiknya diikuti saat buat CRUD module baru

1. Buat `schema` Zod untuk payload dan entity.
2. Buat `response` yang membungkus shape API.
3. Buat custom hooks CRUD di `services/<module>/hooks`.
4. Buat `pages/<Module>Page.tsx`.
5. Buat `MainContent` dan `MutationForm`.
6. Bila kebutuhan cocok, gunakan `DataPageTemplate`.

## Kapan memilih modul referensi tertentu

- Pakai `labels` bila butuh CRUD sederhana.
- Pakai `post` bila butuh text/content editing.
- Pakai `permission` bila butuh list master data dengan kontrol akses yang dekat dengan admin domain.
- Pakai `user-management` bila butuh filter, export, dan aksi tambahan yang lebih kompleks.

## File fondasi terkait

- `src/components/ui/data-page-template.tsx`
- `src/shared/components/table/BaseTable.tsx`
- `src/shared/components/pagination/PaginationWithShow.tsx`
- `src/shared/hooks/useDebounce.ts`
- `src/shared/context/TopbarActionContext.tsx`
