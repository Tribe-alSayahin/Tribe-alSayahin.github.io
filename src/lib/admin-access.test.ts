import { describe, expect, it } from 'vitest';

import {
  canManageAdminUsers,
  getAllowedAdminTabs,
  isAdminPanelRole,
  isAdminTabAllowed,
} from './admin-access';

describe('admin access permissions', () => {
  it('allows super admin into the full panel', () => {
    expect(isAdminPanelRole('super_admin')).toBe(true);
    expect(getAllowedAdminTabs('super_admin')).toContain('users');
    expect(canManageAdminUsers('super_admin')).toBe(true);
  });

  it('allows admin without user management access', () => {
    expect(isAdminPanelRole('admin')).toBe(true);
    expect(getAllowedAdminTabs('admin')).not.toContain('users');
    expect(isAdminTabAllowed('admin', 'posts')).toBe(true);
    expect(isAdminTabAllowed('admin', 'users')).toBe(false);
    expect(canManageAdminUsers('admin')).toBe(false);
  });

  it('blocks editor and anonymous users from the admin panel', () => {
    expect(isAdminPanelRole('editor')).toBe(false);
    expect(isAdminPanelRole(null)).toBe(false);
    expect(getAllowedAdminTabs('editor')).toEqual([]);
    expect(getAllowedAdminTabs(null)).toEqual([]);
  });
});
