import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Trash2, Edit, Calendar, Newspaper, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostForm } from './PostForm';
import { ConfirmModal } from './ConfirmModal';
import {
  fetchAdminPosts,
  AdminPostRecord,
  AdminPostInsert,
  AdminPostUpdate,
  AdminPostKind,
  AdminPostStatus,
  formatGregorianDateArabic,
  VERIFIED_AUTHOR_NAME,
} from '../../lib/admin-posts';
import { supabase } from '../../lib/supabase';

interface PostManagerProps {
  onNotify: (message: string, type: 'success' | 'error') => void;
}

const KIND_LABELS: Record<AdminPostKind, string> = {
  news: 'خبر',
  event: 'مناسبة',
};

const STATUS_LABELS: Record<AdminPostStatus, string> = {
  draft: 'مسودة',
  published: 'منشور',
};

const STATUS_BADGE: Record<AdminPostStatus, string> = {
  draft: 'bg-sand-dim/10 text-sand-dim border-sand-dim/20',
  published: 'bg-emerald/10 text-emerald-lt border-emerald/20',
};

const KIND_BADGE: Record<AdminPostKind, string> = {
  news: 'bg-brass/10 text-brass-lt border-brass/20',
  event: 'bg-sunset/10 text-sunset-lt border-sunset/20',
};

export function PostManager({ onNotify }: PostManagerProps) {
  const [posts, setPosts] = useState<AdminPostRecord[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPostRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPostRecord | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState<AdminPostKind | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AdminPostStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'title' | 'updated_at'>('created_at');
  const [ascending, setAscending] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchAdminPosts({
      kind: kindFilter,
      status: statusFilter,
      search,
      sortBy,
      ascending,
      page,
      pageSize,
    });

    if (result.error) {
      onNotify(result.error.message, 'error');
    } else {
      setPosts(result.data ?? []);
      setCount(result.count ?? 0);
    }
    setIsLoading(false);
  }, [kindFilter, statusFilter, search, sortBy, ascending, page, pageSize, onNotify]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const totalPages = useMemo(() => Math.ceil(count / pageSize), [count, pageSize]);

  const handleCreatePost = async (payload: AdminPostInsert) => {
    setFormError('');
    setIsSubmitting(true);

    const { error } = await supabase.from('admin_posts').insert(payload);
    if (error) {
      setFormError(error.message);
      onNotify('فشل إضافة المنشور', 'error');
    } else {
      onNotify('تم إضافة المنشور بنجاح', 'success');
      setShowForm(false);
      await loadPosts();
    }
    setIsSubmitting(false);
  };

  const handleUpdatePost = async (payload: AdminPostUpdate) => {
    if (!editingPost) return;
    setFormError('');
    setIsSubmitting(true);

    const { error } = await supabase.from('admin_posts').update(payload).eq('id', editingPost.id);
    if (error) {
      setFormError(error.message);
      onNotify('فشل تحديث المنشور', 'error');
    } else {
      onNotify('تم تحديث المنشور بنجاح', 'success');
      setEditingPost(null);
      await loadPosts();
    }
    setIsSubmitting(false);
  };

  const handleDeletePost = async (post: AdminPostRecord) => {
    const { error } = await supabase.from('admin_posts').delete().eq('id', post.id);
    if (error) {
      onNotify(error.message, 'error');
    } else {
      onNotify('تم حذف المنشور بنجاح', 'success');
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(post.id);
        return next;
      });
      await loadPosts();
    }
    setDeleteTarget(null);
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    const { error } = await supabase.from('admin_posts').delete().in('id', ids);
    if (error) {
      onNotify(error.message, 'error');
    } else {
      onNotify(`تم حذف ${ids.length} منشور بنجاح`, 'success');
      setSelectedIds(new Set());
      await loadPosts();
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openEdit = (post: AdminPostRecord) => {
    setFormError('');
    setEditingPost(post);
  };

  const openCreate = () => {
    setFormError('');
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-brass-lt" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">إدارة الأخبار والمناسبات</h3>
            <p className="text-sm text-sand-dim">إضافة، تعديل، حذف، وتصفية المنشورات</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
        >
          <Calendar className="w-4 h-4" />
          منشور جديد
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-brass/20 bg-ink-2/60 p-5"
          >
            <h4 className="font-kufi text-lg text-brass-lt mb-4">إضافة منشور جديد</h4>
            <PostForm
              onSubmit={handleCreatePost}
              onCancel={() => setShowForm(false)}
              isSubmitting={isSubmitting}
              error={formError}
            />
          </motion.div>
        )}

        {editingPost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-brass/20 bg-ink-2/60 p-5"
          >
            <h4 className="font-kufi text-lg text-brass-lt mb-4">تعديل المنشور</h4>
            <PostForm
              initial={editingPost}
              submitLabel="حفظ التعديل"
              onSubmit={handleUpdatePost}
              onCancel={() => setEditingPost(null)}
              isSubmitting={isSubmitting}
              error={formError}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              placeholder="بحث في العنوان أو المحتوى"
              className="w-full rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
            />
          </div>

          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
            <select
              value={kindFilter}
              onChange={(e) => { setPage(1); setKindFilter(e.target.value as AdminPostKind | 'all'); }}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand focus:outline-none focus:border-brass/50 appearance-none"
            >
              <option value="all">كل الأنواع</option>
              <option value="news">خبر</option>
              <option value="event">مناسبة</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setPage(1); setStatusFilter(e.target.value as AdminPostStatus | 'all'); }}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sm text-sand focus:outline-none focus:border-brass/50"
          >
            <option value="all">كل الحالات</option>
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
          </select>

          <select
            value={`${sortBy}-${ascending ? 'asc' : 'desc'}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-');
              setSortBy(field as 'created_at' | 'title' | 'updated_at');
              setAscending(dir === 'asc');
            }}
            className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sm text-sand focus:outline-none focus:border-brass/50"
          >
            <option value="created_at-desc">الأحدث أولاً</option>
            <option value="created_at-asc">الأقدم أولاً</option>
            <option value="updated_at-desc">آخر تعديل</option>
            <option value="title-asc">العنوان أ-ي</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between p-3 mb-4 rounded-xl border border-copper/20 bg-copper/5">
            <span className="text-sm font-kufi text-copper-lt">{selectedIds.size} عنصر محدد</span>
            <button
              onClick={() => setShowBulkDelete(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-copper/40 text-sm font-kufi text-copper-lt hover:bg-copper/10 transition-colors"
              aria-label="حذف المحدد"
            >
              <Trash2 className="w-4 h-4" />
              حذف المحدد
            </button>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل المنشورات...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">لا توجد منشورات مطابقة.</p>
        ) : (
          <>
            <div className="grid gap-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl border border-brass/15 bg-ink/50 p-4 transition-colors hover:border-brass/30"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(post.id)}
                      onChange={() => toggleSelect(post.id)}
                      className="mt-1 w-4 h-4 accent-brass rounded border-brass/30"
                      aria-label="تحديد المنشور"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-[10px] font-kufi px-2 py-0.5 rounded-full border ${KIND_BADGE[post.kind]}`}>
                          {KIND_LABELS[post.kind]}
                        </span>
                        <span className={`text-[10px] font-kufi px-2 py-0.5 rounded-full border ${STATUS_BADGE[post.status ?? 'draft']}`}>
                          {STATUS_LABELS[post.status ?? 'draft']}
                        </span>
                        <span className="text-xs font-kufi text-sand-dim">
                          {formatGregorianDateArabic(post.kind === 'event' ? post.event_date : post.created_at)}
                        </span>
                      </div>
                      <h4 className="font-serif text-base text-sand truncate">{post.title}</h4>
                      <p className="text-sm text-sand-dim mt-1 line-clamp-2">{post.content}</p>
                      <p className="text-xs text-sand-dim/70 mt-2 flex items-center gap-1">
                        <Check className="w-3 h-3 text-azure" aria-hidden="true" />
                        {VERIFIED_AUTHOR_NAME}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-2 rounded-lg border border-brass/35 text-brass-lt hover:bg-brass/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
                        aria-label="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(post)}
                        className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
                        aria-label="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-brass/20 text-sand-dim hover:text-sand hover:bg-brass/5 disabled:opacity-40 transition-colors"
                  aria-label="الصفحة السابقة"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-kufi text-sand-dim">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-brass/20 text-sand-dim hover:text-sand hover:bg-brass/5 disabled:opacity-40 transition-colors"
                  aria-label="الصفحة التالية"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد الحذف"
        message={`هل أنت متأكد من حذف المنشور "${deleteTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="حذف"
        onConfirm={() => deleteTarget && void handleDeletePost(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        isOpen={showBulkDelete}
        title="تأكيد الحذف الجماعي"
        message={`هل أنت متأكد من حذف ${selectedIds.size} منشور محدد؟`}
        confirmLabel="حذف الكل"
        onConfirm={() => void handleBulkDelete()}
        onCancel={() => setShowBulkDelete(false)}
      />
    </div>
  );
}
