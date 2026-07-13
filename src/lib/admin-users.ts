/**
 * إدارة المستخدمين والصلاحيات
 */

import { supabase } from './supabase';

export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string | null;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserInsert {
  email: string;
  role?: UserRole;
  full_name?: string | null;
}

type ApiError = { message: string };
type FetchListResult<T> = { data: T[]; error: null } | { data: null; error: ApiError };
type FetchItemResult<T> = { data: T | null; error: null } | { data: null; error: ApiError };
type MutationResult = { error: ApiError | null };

/**
 * جلب جميع المستخدمين الإداريين
 */
export async function fetchAdminUsers(): Promise<FetchListResult<AdminUser>> {
  const { data, error } = await supabase.rpc<AdminUser[]>('list_admin_users');

  if (error) {
    return { data: null, error };
  }

  return { data: Array.isArray(data) ? data : [], error: null };
}

/**
 * جلب دور المستخدم الحالي
 */
export async function fetchCurrentUserRole(): Promise<FetchItemResult<{ role: UserRole }>> {
  const { data, error } = await supabase.rpc<UserRole | null>('current_admin_role');

  if (error) {
    return { data: null, error };
  }

  return { data: data ? { role: data } : null, error: null };
}

/**
 * إضافة مستخدم إداري جديد
 */
export async function createAdminUser(user: AdminUserInsert): Promise<MutationResult> {
  const { error } = await supabase.rpc<null>('create_admin_user', {
    user_email: user.email.trim(),
    user_role: user.role ?? 'editor',
    user_full_name: user.full_name ?? null,
  });

  return { error };
}

/**
 * تحديث دور مستخدم إداري
 */
export async function updateAdminUserRole(id: string, role: UserRole): Promise<MutationResult> {
  const { error } = await supabase.rpc<null>('update_admin_user_role', {
    admin_user_id: id,
    new_role: role,
  });

  return { error };
}

/**
 * حذف مستخدم إداري
 */
export async function deleteAdminUser(id: string): Promise<MutationResult> {
  const { error } = await supabase.rpc<null>('delete_admin_user', {
    admin_user_id: id,
  });

  return { error };
}
