'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MessageSquare, Check, X, Trash2, Search, Filter } from 'lucide-react';
import {
  fetchAllComments,
  updateCommentStatus,
  deleteComment,
  type Comment,
  type CommentStatus,
} from '../../lib/comments';
import { ConfirmModal } from './ConfirmModal';

interface CommentManagerProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

export function CommentManager({ onNotify }: CommentManagerProps = {}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<CommentStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchAllComments(
      filter === 'all' ? undefined : filter
    );
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      setComments(data || []);
      setError('');
    }
    setIsLoading(false);
  }, [filter, onNotify]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const filteredComments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return comments;
    return comments.filter(
      (comment) =>
        (comment.author_name || '').toLowerCase().includes(term) ||
        comment.content.toLowerCase().includes(term)
    );
  }, [comments, search]);

  const handleApprove = async (comment: Comment) => {
    const { error } = await updateCommentStatus(comment.id, 'approved');
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      onNotify?.('تمت الموافقة على التعليق', 'success');
      await loadComments();
    }
  };

  const handleReject = async (comment: Comment) => {
    const { error } = await updateCommentStatus(comment.id, 'rejected');
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      onNotify?.('تم رفض التعليق', 'success');
      await loadComments();
    }
  };

  const handleDelete = async (comment: Comment) => {
    const { error } = await deleteComment(comment.id);
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      onNotify?.('تم حذف التعليق', 'success');
      await loadComments();
    }
    setDeleteTarget(null);
  };

  const statusLabels: Record<CommentStatus, string> = {
    pending: 'قيد المراجعة',
    approved: 'موافق',
    rejected: 'مرفوض',
  };

  const statusColors: Record<CommentStatus, string> = {
    pending: 'bg-sunset/20 text-sunset-lt border-sunset/30',
    approved: 'bg-emerald/20 text-emerald-lt border-emerald/30',
    rejected: 'bg-copper/20 text-copper-lt border-copper/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-brass-lt" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">إدارة التعليقات</h3>
            <p className="text-sm text-sand-dim">مراجعة وإدارة تعليقات الزوار</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في الاسم أو المحتوى"
              className="w-full rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as CommentStatus | 'all')}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand focus:outline-none focus:border-brass/50 appearance-none"
            >
              <option value="all">الكل</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">موافق</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل التعليقات...</p>
        ) : filteredComments.length === 0 ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">لا توجد تعليقات مطابقة.</p>
        ) : (
          <div className="grid gap-3">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-brass/15 bg-ink/50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-serif text-base text-sand">
                        {comment.author_name || 'مستخدم مجهول'}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[comment.status]}`}
                      >
                        {statusLabels[comment.status]}
                      </span>
                    </div>
                    <p className="text-sm text-sand-dim leading-relaxed">
                      {comment.content}
                    </p>
                    <p className="text-xs text-sand-dim/60 mt-2">
                      {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {comment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => { void handleApprove(comment); }}
                          className="p-2 rounded-lg border border-emerald/40 text-emerald hover:bg-emerald/10 transition-colors focus-visible:ring-2 focus-visible:ring-emerald focus-visible:outline-none"
                          aria-label="موافقة"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { void handleReject(comment); }}
                          className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
                          aria-label="رفض"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setDeleteTarget(comment)}
                      className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
                      aria-label="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs font-kufi text-copper">{error}</p>}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف التعليق"
        message="هل أنت متأكد من حذف هذا التعليق؟"
        confirmLabel="حذف"
        onConfirm={() => deleteTarget && void handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
