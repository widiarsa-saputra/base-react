# Module Profile And Activity

## Cakupan

Area akun user aktif, perubahan profil, perubahan foto, ganti password, dan log activity.

## Feature mapping

| Domain | UI files |
| --- | --- |
| Profile | `src/features/profile/pages/ProfilePage.tsx`, `ProfileMainContent.tsx`, `CardProfileAbout.tsx`, `CardProfileImage.tsx`, `CardProfileSetting.tsx`, `ChangePasswordCard.tsx` |
| Log activity | `src/features/log-activity/pages/LogActivityPage.tsx`, `LogActivityUserContent.tsx`, `LogActivitySystemContent.tsx` |

## Service mapping

| Domain | Service files |
| --- | --- |
| Profile | `src/services/profile/hooks/useGetUserLogin.ts`, `useUpdateProfile.ts`, `useChangePassword.ts`, `useChangePhoto.ts`, schema dan response terkait di folder yang sama |
| Log activity | `src/services/log-activity/hooks/useLogActivityCRUD.ts`, `schema/LogActivitySchema.ts`, `response/LogActivityResponse.ts` |

## Hal penting untuk maintenance

- Profile biasanya terhubung ke user yang sedang login, jadi perubahan schema/profile flow harus diuji bersama auth context.
- Ganti foto dan ganti password punya alur mutation terpisah; jangan satukan tanpa alasan kuat.
- Log activity cenderung bersifat read-heavy; hati-hati bila mengubah pagination, filter, atau naming field response.

## Kapan membaca dokumen ini

- Menambah field profil.
- Mengubah behavior avatar/foto.
- Menambah tab/card baru pada halaman profile.
- Memperluas tampilan aktivitas sistem dan aktivitas user.
