import React, { ElementType, JSX } from "react";
import { Routes, Route, BrowserRouter } from "react-router";
import LoginPage from "../auth/pages/LoginPage";
import ForbiddenPage from "../auth/pages/ForbiddenPage";
import RequireAuth from "../auth/middleware/RequireAuth";
import GuestOnly from "@/auth/middleware/GuestOnly";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import PermissionsPage from "@/features/permission/pages/PermissionsPage";
import RolePage from "@/features/role/pages/RolePage";
import RoleUsersAssignedPage from "@/features/role/pages/RoleUsersAssignedPage";
import RolePermissionsAssignedPage from "@/features/role/pages/RolePermissionsAssignedPage";
import NotFound from "@/shared/components/error-page/NotFound";
import FileManagerPage from "@/features/file-manager/pages/FileManagerPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { CoursePage } from "@/features/courses/pages/CoursePage";
import { Folder, Grid, Lock, Settings, ShieldCheck, UserCircle, Users, Activity } from "lucide-react";
import StudentPage from "@/features/student/pages/StudentPage";
import UserPage from "@/features/user-management/pages/UserPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import { LogActivityPage } from "@/features/log-activity/pages/LogActivityPage";



type ProtectedRoute = {
    path: string;
    element: JSX.Element;
    protected: true;
    roles: string[];
    permissions?: string[];
};

export interface MenuItem {
    icon: React.ElementType;
    text: string;
    url: string;
    roles?: string[];
    permissions?: string[];
}

export interface MenuSection {
    order?: number;
    id?: string;
    label: string;
    icon: React.ElementType;
    items: MenuItem[];
    customContent?: React.ReactNode;
};

type GuestOnlyRoute = {
    path: string;
    element: JSX.Element;
    guestOnly: true;
};

type PublicRoute = {
    path: string;
    element: JSX.Element;
};

type AppRoute = ProtectedRoute | GuestOnlyRoute | PublicRoute;



export const ROUTES: Record<string, AppRoute> = {
    SLASH: {
        path: "/",
        element: <DashboardPage />,
        protected: true,
        roles: [],
        permissions: [],
    },

    // New Prototypes



    COURSES: {
        path: "/courses",
        element: <CoursePage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    
    STUDENT_LIST: {
        path: "/students",
        element: <StudentPage />,
        protected: true,
        roles: [],
        permissions: [],
    },

    // Admin settings
    USER_MANAGEMENT: {
        path: "/user-management",
        element: <UserPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    PERMISSIONS: {
        path: "/permissions",
        element: <PermissionsPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    ADMIN_SETTINGS: {
        path: "/settings",
        element: <SettingsPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    ROLES: {
        path: "/roles",
        element: <RolePage />,
        protected: true,
        roles: ["superadmin", 'dev'],
        permissions: [],
    },
    ROLES_USERS_ASSIGNED: {
        path: "/roles/:roleId/users",
        element: <RoleUsersAssignedPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    ROLES_PERMISSIONS_ASSIGNED: {
        path: "/roles/:roleId/permissions",
        element: <RolePermissionsAssignedPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    PROFILE: {
        path: "/profile",
        element: <ProfilePage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    CHANGE_PASSWORD: {
        path: "/profile/change-password",
        element: <ProfilePage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    FILE_MANAGER: {
        path: "/file-manager",
        element: <FileManagerPage />,
        protected: true,
        roles: [],
        permissions: [],
    },
    LOG_ACTIVITY: {
        path: "/log-activity",
        element: <LogActivityPage />,
        protected: true,
        roles: [],
        permissions: [],
    },



    LOGIN: {
        path: "/authentication",
        element: <LoginPage />,
        guestOnly: true,
    },
    FORBIDDEN: {
        path: "/forbidden",
        element: <ForbiddenPage />,
    },
    NOT_FOUND: {
        path: "*",
        element: <NotFound />,
    },
};

export const userSections: MenuSection[] = [
    {
        label: "Akun Anda",
        icon: Users as ElementType,
        id :'profile',
        items: [
            {
                text: "Profile",
                url: ROUTES.PROFILE.path,
                icon: UserCircle,
                permissions: ["view_profile"]
            },
            // {
            //     text: "Ganti Password",
            //     url: ROUTES.CHANGE_PASSWORD.path,
            //     icon: Key,
            //     permissions: ["change_password"]
            // }
        ]
    },
    {
        label: "Manajemen Sistem",
        icon: Folder as ElementType,
        id :'sistem',
        items: [
            {
                text: "User Management",
                url: ROUTES.USER_MANAGEMENT.path,
                icon: Users,
                permissions: ["view_user_management"]
            },
            {
                text: "Role Management",
                url: ROUTES.ROLES.path,
                icon: ShieldCheck,
                permissions: ["view_role_management"]
            },
            {
                text: "Permission Management",
                url: ROUTES.PERMISSIONS.path,
                icon: Lock,
                permissions: ["view_permission_management"]
            },
            {
                text: "Settings",
                url: ROUTES.ADMIN_SETTINGS.path,
                icon: Settings,
                permissions: ["view_settings"]
            },
            {
                text: "Log Aktivitas",
                url: ROUTES.LOG_ACTIVITY.path,
                icon: Activity,
                permissions: ["view_log_activity"]
            }
        ]
    },
    {
        label: "Master Data",
        icon: Grid as ElementType,
        id :'master-data',
        items: [
            {
                text: "File Sistem",
                url: ROUTES.FILE_MANAGER.path,
                icon: Folder,
                permissions: ["view_file_manager"]
            },
        ]
    },
]

const AppRouter: React.FC = () => (
    <BrowserRouter>
        <Routes>
            {Object.entries(ROUTES).map(([, config], index) => {
                let wrappedElement = config.element;

                if ("protected" in config && config.protected) {
                    wrappedElement = (
                        <RequireAuth requiredRoles={config.roles} requiredPermissions={config.permissions ?? []}>
                            {config.element}
                        </RequireAuth>
                    );
                } else if ("guestOnly" in config && config.guestOnly) {
                    wrappedElement = <GuestOnly>{config.element}</GuestOnly>;
                }

                return <Route key={index} path={config.path} element={wrappedElement} />;
            })}
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
