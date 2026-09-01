# Module Settings And Integrations

## Cakupan

Settings page memusatkan konfigurasi integrasi sistem seperti WhatsApp gateway, email settings, cron notification test, dan data management.

## Feature mapping

| UI files | Fungsi |
| --- | --- |
| `src/features/settings/pages/SettingsPage.tsx` | Root page |
| `src/features/settings/components/SettingsPageContent.tsx` | Shell tab settings |
| `src/features/settings/components/WhatsappSettings.tsx` | Konfigurasi WhatsApp |
| `src/features/settings/components/EmailSettings.tsx` | Konfigurasi email |
| `src/features/settings/components/CronNotificationTest.tsx` | Uji cron/notifikasi |
| `src/features/settings/components/CronTestMutationForm.tsx` | Form test cron |
| `src/features/settings/components/DataManagement.tsx` | Data management utility |

## Service mapping

| Domain | Service files |
| --- | --- |
| WhatsApp session | `src/services/notification-service/hooks/useShowWhatsappSession.ts`, `useUpdateWhatsappSession.ts`, `useDeleteWhatsappSession.ts`, `useGetWhatsappQR.ts`, `useGetWhatsappStatus.ts` |
| WhatsApp message | `src/services/notification-service/hooks/useSendWhatsappMessage.ts` |
| Email settings | `src/services/notification-service/hooks/useShowEmailSetting.ts`, `useUpdateEmailSetting.ts`, `useSendEmail.ts` |
| Cron test | `src/services/notification-service/hooks/useIndexCronTest.ts`, `useShowCronTest.ts`, `useCreateCronTest.ts` |
| Schema/response | `src/services/notification-service/schema/*`, `response/*` |

## Pola UI

- `SettingsPageContent.tsx` memakai `TabsSections`.
- Tiap tab cenderung punya service sendiri dan dapat berdiri independen.
- Ini adalah contoh page multi-subdomain dalam satu route.

## Saat menambah tab integrasi baru

1. Tambahkan tab object di `SettingsPageContent.tsx`.
2. Buat komponen tab baru di folder yang sama.
3. Buat service domain baru bila endpoint berbeda.
4. Pastikan label tab dan heading tetap konsisten dengan tampilan existing.
