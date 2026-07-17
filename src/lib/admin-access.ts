import type { UserRole } from './admin-users';

export const ADMIN_TAB_DEFINITIONS = [
  { id: 'dashboard', label: 'نظرة عامة', superAdminOnly: false },
  { id: 'posts', label: 'الأخبار والمناسبات', superAdminOnly: false },
  { id: 'poetry', label: 'ديوان الشعر', superAdminOnly: false },
  { id: 'events', label: 'المناسبات المصوّرة', superAdminOnly: false },
  { id: 'users', label: 'المستخدمين', superAdminOnly: true },
  { id: 'visitors', label: 'الزوار المسجلون', superAdminOnly: false },
  { id: 'comments', label: 'التعليقات', superAdminOnly: false },
  { id: 'media', label: 'الوسائط', superAdminOnly: false },
  { id: 'analytics', label: 'الإحصائيات', superAdminOnly: false },
  { id: 'activity', label: 'سجل النشاطات', superAdminOnly: false },
  { id: 'thanks-letter', label: 'الخطابات الرسمية', superAdminOnly: false },
] as const;

export type AdminTab = (typeof ADMIN_TAB_DEFINITIONS)[number]['id'];

export const isAdminPanelRole = (role: UserRole | null): role is 'super_admin' | 'admin' =>
  role === 'super_admin' || role === 'admin';

export const canManageAdminUsers = (role: UserRole | null): boolean => role === 'super_admin';

export const getAllowedAdminTabs = (role: UserRole | null): AdminTab[] => {
  if (!isAdminPanelRole(role)) return [];

  return ADMIN_TAB_DEFINITIONS
    .filter((tab) => role === 'super_admin' || !tab.superAdminOnly)
    .map((tab) => tab.id);
};

export const isAdminTabAllowed = (role: UserRole | null, tab: AdminTab): boolean =>
  getAllowedAdminTabs(role).includes(tab);
