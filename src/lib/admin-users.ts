/**
 * إدارة المستخدمين والصلاحيات
 */

import { supabase } from './supabase';

export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserInsert {
  user_id: string;
  role?: UserRole;
  full_name?: string;
}

/**
 * جلب جميع المستخدمين الإداريين
 */
export async function fetchAdminUsers() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * جلب دور المستخدم الحالي
 */
export async function fetchCurrentUserRole(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: data as unknown as { role: UserRole }, error: null };
}

/**
 * إضافة مستخدم إداري جديد
 */
export async function createAdminUser(user: AdminUserInsert) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('admin_users')
    .insert(user);

  if (error) {
    return { data: null, error };
  }

  // إرجاع البيانات المدرجة
  return { data: user as AdminUser, error: null };
}

/**
 * تحديث دور مستخدم إداري
 */
export async function updateAdminUserRole(id: string, role: UserRole) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('admin_users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { data: null, error };
  }

  // إرجاع البيانات المحدثة
  return { data: { id, role, updated_at: new Date().toISOString() } as AdminUser, error: null };
}

/**
 * حذف مستخدم إداري
 */
export async function deleteAdminUser(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('admin_users')
    .delete()
    .eq('id', id);

  return { error };
}
