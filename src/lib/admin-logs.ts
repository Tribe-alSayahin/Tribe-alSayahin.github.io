import { supabase } from './supabase';

export type AdminAction =
  | 'post_created'
  | 'post_updated'
  | 'post_deleted'
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'comment_approved'
  | 'comment_rejected'
  | 'comment_deleted'
  | 'media_uploaded'
  | 'media_deleted'
  | 'sign_in'
  | 'sign_out';

export interface AdminLog {
  id: string;
  user_id: string | null;
  action: AdminAction;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminLogInsert {
  user_id?: string | null;
  action: AdminAction;
  target_type: string;
  target_id?: string | null;
  details?: Record<string, unknown>;
}

export interface AdminLogsResult {
  data: AdminLog[] | null;
  error: { message: string } | null;
}

export async function logAdminAction(log: AdminLogInsert): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from('admin_logs').insert(log);
  return { error };
}

export async function fetchAdminLogs(limit = 50): Promise<AdminLogsResult> {
  const { data, error } = await supabase
    .from('admin_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return { data: null, error };
  }

  return { data: (data ?? []) as AdminLog[], error: null };
}

export const actionLabels: Record<AdminAction, string> = {
  post_created: 'إضافة منشور',
  post_updated: 'تعديل منشور',
  post_deleted: 'حذف منشور',
  user_created: 'إضافة مستخدم',
  user_updated: 'تحديث مستخدم',
  user_deleted: 'حذف مستخدم',
  comment_approved: 'موافقة تعليق',
  comment_rejected: 'رفض تعليق',
  comment_deleted: 'حذف تعليق',
  media_uploaded: 'رفع وسائط',
  media_deleted: 'حذف وسائط',
  sign_in: 'تسجيل دخول',
  sign_out: 'تسجيل خروج',
};

export const actionColors: Record<AdminAction, string> = {
  post_created: 'bg-emerald/10 text-emerald-lt border-emerald/20',
  post_updated: 'bg-brass/10 text-brass-lt border-brass/20',
  post_deleted: 'bg-copper/10 text-copper-lt border-copper/20',
  user_created: 'bg-emerald/10 text-emerald-lt border-emerald/20',
  user_updated: 'bg-brass/10 text-brass-lt border-brass/20',
  user_deleted: 'bg-copper/10 text-copper-lt border-copper/20',
  comment_approved: 'bg-emerald/10 text-emerald-lt border-emerald/20',
  comment_rejected: 'bg-sunset/10 text-sunset-lt border-sunset/20',
  comment_deleted: 'bg-copper/10 text-copper-lt border-copper/20',
  media_uploaded: 'bg-azure/10 text-azure border-azure/20',
  media_deleted: 'bg-copper/10 text-copper-lt border-copper/20',
  sign_in: 'bg-brass/10 text-brass-lt border-brass/20',
  sign_out: 'bg-sand-dim/10 text-sand-dim border-sand-dim/20',
};
