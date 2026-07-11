/**
 * إدارة التعليقات
 */

import { supabase } from './supabase';

export type CommentStatus = 'pending' | 'approved' | 'rejected';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  author_name: string | null;
  content: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
}

export interface CommentInsert {
  post_id: string;
  user_id?: string;
  author_name?: string;
  content: string;
  status?: CommentStatus;
}

/**
 * جلب تعليقات منشور معين
 */
export async function fetchCommentsByPost(postId: string, status?: CommentStatus) {
  let query = supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * جلب جميع التعليقات (للوحة الإدارة)
 */
export async function fetchAllComments(status?: CommentStatus) {
  let query = supabase
    .from('comments')
    .select('*');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * إضافة تعليق جديد
 */
export async function createComment(comment: CommentInsert) {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * تحديث حالة تعليق
 */
export async function updateCommentStatus(id: string, status: CommentStatus) {
  const { data, error } = await supabase
    .from('comments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * حذف تعليق
 */
export async function deleteComment(id: string) {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  return { error };
}
