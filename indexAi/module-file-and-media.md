# Module File And Media

## Cakupan

Area file manager, upload, card preview file, serta reusable media picker/library.

## Feature mapping

| Area | UI files |
| --- | --- |
| File manager | `src/features/file-manager/pages/FileManagerPage.tsx`, `FileManagerMainContent.tsx`, `FileCard.tsx`, `UploadFileModal.tsx` |
| Shared media | `src/shared/components/media-library/MediaLibraryModal.tsx`, `UploadImageModal.tsx`, `ImageSelectionCard.tsx`, `MediaLibraryExample.tsx` |
| Upload helpers | `src/components/UploadSingleImage.tsx`, `src/shared/components/form/ImageUploadWithDropzone.tsx`, `ImageUploadWithPreview.tsx` |

## Service mapping

| Domain | Service files |
| --- | --- |
| File | `src/services/file/hooks/useFileCRUD.ts`, `schema/FileSchema.ts`, `response/FileResponse.ts` |

## Gunanya sebagai referensi

- Saat membuat feature yang perlu pilih file/gambar dari library yang sudah ada.
- Saat memperluas alur upload, preview, atau metadata file.
- Saat menambah integrasi yang butuh objek file dari backend.

## Hal yang perlu dicek saat modifikasi

1. Apakah perubahan hanya UI file manager atau juga payload service.
2. Apakah komponen dipakai lagi oleh modul profile, post, atau editor lain.
3. Apakah preview dan upload punya dependency styling/state yang berbeda untuk desktop/mobile.
