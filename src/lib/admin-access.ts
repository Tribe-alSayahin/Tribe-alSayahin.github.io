import type { UserRole } from './admin-users';

export type AdminTab =
  | 'dashboard'
  | 'posts'
  | 'poetry'
  | 'events'
  | 'users'
  | 'analytics'
  | 'media'
  | 'comments'
  | 'activity'
  | 'thanks-letter';

const ALL_ADMIN_TABS: AdminTab[] = [
  'dashboard',
  'posts',
  'poetry',
  'events',
  'users',
  'analytics',
  'media',
  'comments',
  'activity',
  'thanks-letter',
];

export const isAdminPanelRole = (role: UserRole | null): role is 'super_admin' | 'admin' =>
  role === 'super_admin' || role === 'admin';

export const canManageAdminUsers = (role: UserRole | null): boolean => role === 'super_admin';

export const getAllowedAdminTabs = (role: UserRole | null): AdminTab[] => {
  if (role === 'super_admin') {
    return ALL_ADMIN_TABS;
  }

  if (role === 'admin') {
    return ALL_ADMIN_TABS.filter((tab) => tab !== 'users');
  }

  return [];
};

export const isAdminTabAllowed = (role: UserRole | null, tab: AdminTab): boolean =>
  getAllowedAdminTabs(role).includes(tab);
