# Module User Access Control

## Cakupan

Area ini mencakup user management, role, permission, role-permission, dan user-role assignment.

## Feature mapping

| Domain | UI files |
| --- | --- |
| User management | `src/features/user-management/pages/UserPage.tsx`, `components/UserMainContent.tsx`, `UserMutationForm.tsx`, `AssignRoleModal.tsx` |
| Role management | `src/features/role/pages/RolePage.tsx`, `RoleUsersAssignedPage.tsx`, `RolePermissionsAssignedPage.tsx`, komponen di `src/features/role/components/*` |
| Permission management | `src/features/permission/pages/PermissionsPage.tsx`, `PermissionMainContent.tsx`, `PermissionMutationForm.tsx` |

## Service mapping

| Domain | Service files |
| --- | --- |
| User | `src/services/user/hooks/useUserCRUD.ts`, `useUserImportExport.ts`, `schema/UserSchema.ts`, `response/UserResponse.ts` |
| Role | `src/services/role/hooks/useRoleCRUD.ts`, `schema/RoleSchema.ts`, `response/RoleResponse.ts` |
| Permission | `src/services/permission/hooks/usePermissionCRUD.ts`, `schema/PermissionSchema.ts`, `response/PermissionResponse.ts` |
| Role permission | `src/services/role-permission/hooks/useRolePermissionCRUD.ts`, `schema/RolePermissionSchema.ts`, `response/RolePermissionResponse.ts` |
| User role | `src/services/user-role/hooks/useUserRoleCRUD.ts`, `schema/UserRoleSchema.ts`, `response/UserRoleResponse.ts` |

## Pola implementasi yang terlihat

- `UserMainContent.tsx` adalah contoh bagus page CRUD kaya fitur:
  - search via topbar
  - filter status
  - export/import-template action
  - sorting
  - `DataPageTemplate`
  - modal assignment role terpisah
- Role management memiliki page induk dan page assignment terpisah untuk relasi user/permission.

## Jika menambah field user/role/permission

1. Update schema Zod domain.
2. Update response type bila API shape ikut berubah.
3. Update form UI dan default value.
4. Update kolom tabel atau badge bila field perlu ditampilkan.
5. Cek efek ke assignment flow bila field terkait relasi akses.

## File referensi terbaik

- CRUD kompleks: `src/features/user-management/components/UserMainContent.tsx`
- CRUD standar: `src/features/permission/components/PermissionMainContent.tsx`
- Relational management: `src/features/role/components/RoleUserManagement.tsx` dan `RolePermissionManagement.tsx`
