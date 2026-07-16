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

export type PublicComment = Omit<Comment, 'user_id'>;

export interface CommentInsert {
  post_id: string;
  user_id?: string;
  author_name?: string;
  content: string;
  status?: CommentStatus;
}

type ApiError = { message: string };
type FetchListResult<T> = { data: T[]; error: null } | { data: null; error: ApiError };
type FetchItemResult<T> = { data: T; error: null } | { data: null; error: ApiError };
type DeleteResult = { error: ApiError | null };

/**
 * جلب تعليقات منشور معين
 */
export async function fetchCommentsByPost(postId: string, status?: CommentStatus): Promise<FetchListResult<PublicComment>> {
  let query = supabase
    .from('comments')
    .select('id,post_id,author_name,content,status,created_at,updated_at')
    .eq('post_id', postId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) {
    return { data: null, error };
  }

  return { data: data ?? [], error: null };
}

/**
 * جلب جميع التعليقات (للوحة الإدارة)
 */
export async function fetchAllComments(status?: CommentStatus): Promise<FetchListResult<Comment>> {
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

  return { data: (data ?? []), error: null };
}

/**
 * إضافة تعليق جديد
 */
export async function createComment(comment: CommentInsert): Promise<FetchItemResult<Comment>> {
  const { error } = await supabase
    .from('comments')
    .insert(comment);

  if (error) {
    return { data: null, error };
  }

  return { data: comment as Comment, error: null };
}

/**
 * تحديث حالة تعليق
 */
export async function updateCommentStatus(id: string, status: CommentStatus): Promise<FetchItemResult<Comment>> {
  const { error } = await supabase
    .from('comments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return { data: null, error };
  }

  return { data: { id, status, updated_at: new Date().toISOString() } as Comment, error: null };
}

/**
 * حذف تعليق
 */
export async function deleteComment(id: string): Promise<DeleteResult> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  return { error: error };
}
