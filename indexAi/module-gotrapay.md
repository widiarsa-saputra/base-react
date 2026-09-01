# Module GotraPay

## Cakupan

Area GotraPay dibagi dua:

- konfigurasi koneksi/credential GotraPay
- manajemen invoice dan status pembayaran

## Feature mapping

| Domain | UI files |
| --- | --- |
| GotraPay setting | `src/features/GotraPaySetting/pages/GotraPaySettingPage.tsx`, `components/GotraPaySettingPageContent.tsx`, `tabs/GotraPayGeneralTab.tsx`, `tabs/GotraPaySecretTab.tsx` |
| GotraPay invoice | `src/features/gotrapay-invoice/pages/GotraPayInvoicePage.tsx`, `PaymentSuccessPage.tsx`, `PaymentFailedPage.tsx`, `components/GotraPayInvoiceListContent.tsx`, `GotraPayInvoiceDetailContent.tsx`, `GotraPayInvoiceCreateForm.tsx` |

## Service mapping

| Domain | Service files |
| --- | --- |
| GotraPay setting | `src/services/GotraPaySetting/hooks/useGetGotraPaySetting.ts`, `useSaveGotraPaySetting.ts`, `useTestGotraPaySetting.ts`, schema dan response terkait |
| GotraPay invoice | `src/services/gotrapay-invoice/hooks/useGotraPayInvoiceCRUD.ts`, `useGetPublicGotraPayInvoiceStatus.ts`, schema dan response terkait |

## Pola penting

- `GotraPayInvoiceListContent.tsx` adalah contoh page list dengan:
  - debounced search
  - table sortable
  - mode `mutationMode='content'` di `DataPageTemplate`
  - selection row untuk sinkron ke panel/detail lain
- Modul invoice memiliki flow internal dan public-facing success/failed page.

## Saat memodifikasi invoice

1. Cek create payload di schema karena bentuknya cukup dalam.
2. Cek apakah perubahan mempengaruhi list, detail, dan public status page sekaligus.
3. Pastikan format angka, status badge, dan redirect URL tetap konsisten.

## Saat memodifikasi setting GotraPay

- Cek tab general dan secret.
- Cek alur test connection agar perubahan UI tidak memutus verifikasi konfigurasi.
