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
  const { data, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data: data as { role: UserRole }, error: null };
}

/**
 * إضافة مستخدم إداري جديد
 */
export async function createAdminUser(user: AdminUserInsert) {
  const { data, error } = await supabase
    .from('admin_users')
    .insert(user)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * تحديث دور مستخدم إداري
 */
export async function updateAdminUserRole(id: string, role: UserRole) {
  const { data, error } = await supabase
    .from('admin_users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * حذف مستخدم إداري
 */
export async function deleteAdminUser(id: string) {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id);

  return { error };
}
