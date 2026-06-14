export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "GENERAL_MANAGER"
  | "PROJECT_MANAGER"
  | "ACCOUNTANT"
  | "DATA_ENTRY"
  | "DISPATCHER"
  | "AGENT";

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "مدير عام",
  ADMIN: "مدير نظام",
  GENERAL_MANAGER: "مدير عام",
  PROJECT_MANAGER: "مدير مشروع",
  ACCOUNTANT: "محاسب",
  DATA_ENTRY: "مدخل بيانات",
  DISPATCHER: "منسق توزيع",
  AGENT: "مندوب توصيل",
};

export const ROLE_LIST: { value: UserRole; label: string }[] = [
  { value: "SUPER_ADMIN", label: "مدير عام" },
  { value: "ADMIN", label: "مدير نظام" },
  { value: "GENERAL_MANAGER", label: "مدير عام" },
  { value: "PROJECT_MANAGER", label: "مدير مشروع" },
  { value: "ACCOUNTANT", label: "محاسب" },
  { value: "DATA_ENTRY", label: "مدخل بيانات" },
  { value: "DISPATCHER", label: "منسق توزيع" },
  { value: "AGENT", label: "مندوب توصيل" },
];

export type Permission = string;

export const PERMISSIONS = {
  USERS: { VIEW: "users:view", CREATE: "users:create", EDIT: "users:edit", DELETE: "users:delete" },
  SHIPMENTS: { VIEW: "shipments:view", CREATE: "shipments:create", ASSIGN: "shipments:assign", EDIT: "shipments:edit" },
  PARTNERS: { VIEW: "partners:view", CREATE: "partners:create", EDIT: "partners:edit" },
  DISPATCH: { VIEW: "dispatch:view", ASSIGN: "dispatch:assign" },
  REPORTS: { VIEW: "reports:view", FINANCIAL: "reports:financial" },
  IMPORT: { VIEW: "import:view", EXECUTE: "import:execute" },
  RETURNS: { VIEW: "returns:view", PROCESS: "returns:process" },
  SETTINGS: { VIEW: "settings:view", EDIT: "settings:edit" },
} as const;

const allPermissions = Object.values(PERMISSIONS).flatMap((p) => Object.values(p));

const ROLE_PERMISSIONS: Record<UserRole, Set<string>> = {
  SUPER_ADMIN: new Set(allPermissions),
  ADMIN: new Set(allPermissions),
  GENERAL_MANAGER: new Set([
    ...Object.values(PERMISSIONS.SHIPMENTS),
    ...Object.values(PERMISSIONS.PARTNERS),
    ...Object.values(PERMISSIONS.DISPATCH),
    ...Object.values(PERMISSIONS.REPORTS),
    ...Object.values(PERMISSIONS.RETURNS),
    PERMISSIONS.USERS.VIEW,
  ]),
  PROJECT_MANAGER: new Set([
    ...Object.values(PERMISSIONS.SHIPMENTS),
    ...Object.values(PERMISSIONS.PARTNERS),
    ...Object.values(PERMISSIONS.DISPATCH),
    PERMISSIONS.REPORTS.VIEW,
    PERMISSIONS.USERS.VIEW,
  ]),
  ACCOUNTANT: new Set([
    PERMISSIONS.SHIPMENTS.VIEW,
    PERMISSIONS.PARTNERS.VIEW,
    PERMISSIONS.REPORTS.VIEW,
    PERMISSIONS.REPORTS.FINANCIAL,
  ]),
  DATA_ENTRY: new Set([
    PERMISSIONS.SHIPMENTS.CREATE,
    PERMISSIONS.SHIPMENTS.EDIT,
    PERMISSIONS.SHIPMENTS.VIEW,
    PERMISSIONS.PARTNERS.VIEW,
    PERMISSIONS.IMPORT.EXECUTE,
  ]),
  DISPATCHER: new Set([
    PERMISSIONS.SHIPMENTS.VIEW,
    PERMISSIONS.DISPATCH.VIEW,
    PERMISSIONS.DISPATCH.ASSIGN,
    PERMISSIONS.RETURNS.VIEW,
  ]),
  AGENT: new Set([
    PERMISSIONS.SHIPMENTS.VIEW,
    PERMISSIONS.RETURNS.VIEW,
  ]),
};

export function hasPermission(role: UserRole | string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role as UserRole];
  if (!perms) return false;
  return perms.has(permission);
}

export function can(role: UserRole | string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return hasPermission(role, permission);
}
