import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Check, X, Trash2 } from 'lucide-react';
import {
  fetchAllComments,
  updateCommentStatus,
  deleteComment,
  type Comment,
  type CommentStatus,
} from '../../lib/comments';

export function CommentManager() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<CommentStatus | 'all'>('all');
  const [error, setError] = useState('');

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchAllComments(
      filter === 'all' ? undefined : filter
    );
    if (error) {
      setError(error.message);
    } else {
      setComments(data || []);
    }
    setIsLoading(false);
  }, [filter]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const handleApprove = async (id: string) => {
    const { error } = await updateCommentStatus(id, 'approved');
    if (error) {
      setError(error.message);
    } else {
      await loadComments();
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await updateCommentStatus(id, 'rejected');
    if (error) {
      setError(error.message);
    } else {
      await loadComments();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
      return;
    }

    const { error } = await deleteComment(id);
    if (error) {
      setError(error.message);
    } else {
      await loadComments();
    }
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
      {/* رأس القسم */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-brass-lt" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">إدارة التعليقات</h3>
            <p className="text-sm text-sand-dim">مراجعة وإدارة تعليقات الزوار</p>
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as CommentStatus | 'all')}
          className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
        >
          <option value="all">الكل</option>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">موافق</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      {/* قائمة التعليقات */}
      {isLoading ? (
        <p className="text-sm font-kufi text-sand-dim">جارٍ تحميل التعليقات...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm font-kufi text-sand-dim">لا توجد تعليقات حالياً.</p>
      ) : (
        <div className="grid gap-3">
          {comments.map((comment) => (
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
                        onClick={() => handleApprove(comment.id)}
                        className="p-2 rounded-lg border border-emerald/40 text-emerald hover:bg-emerald/10 transition-colors"
                        aria-label="موافقة"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(comment.id)}
                        className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors"
                        aria-label="رفض"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors"
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

      {error && <p className="text-xs font-kufi text-copper">{error}</p>}
    </div>
  );
}
