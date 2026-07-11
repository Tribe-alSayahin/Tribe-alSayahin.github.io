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
  const { data, error } = await supabase
    .from('admin_users' as any)
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
  const { data, error } = await supabase
    .from('admin_users' as any)
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
  const { error } = await supabase
    .from('admin_users' as any)
    .insert(user as any);

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
  const { error } = await supabase
    .from('admin_users' as any)
    .update({ role, updated_at: new Date().toISOString() } as any)
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
  const { error } = await supabase
    .from('admin_users' as any)
    .delete()
    .eq('id', id);

  return { error };
}
