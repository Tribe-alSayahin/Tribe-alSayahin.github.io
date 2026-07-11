import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { BadgeCheck } from 'lucide-react';

import {
  fetchAdminPosts,
  formatGregorianDateArabic,
  isSchemaNotFoundError,
  SCHEMA_CACHE_ERROR_MESSAGE,
  VERIFIED_AUTHOR_NAME,
  type AdminPostInsert,
  type AdminPostKind,
  type AdminPostRecord,
} from '../../lib/admin-posts';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { setSeoMeta } from '../../lib/seo';

const KIND_OPTIONS: { value: AdminPostKind; label: string }[] = [
  { value: 'news', label: 'خبر' },
  { value: 'event', label: 'مناسبة' },
];

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<AdminPostRecord[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [formError, setFormError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kind, setKind] = useState<AdminPostKind>('news');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editKind, setEditKind] = useState<AdminPostKind>('news');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editEventDate, setEditEventDate] = useState('');

  const canManage = useMemo(() => !!session?.user, [session]);

  const loadPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    const { data, error } = await fetchAdminPosts();
    if (error) {
      setFormError(error.message);
    } else {
      setPosts(data ?? []);
    }
    setIsLoadingPosts(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isSupabaseConfigured()) {
        setFormError('إعداد Supabase غير مكتمل في متغيرات البيئة.');
        setIsAuthLoading(false);
        setIsLoadingPosts(false);
        return;
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(currentSession);
        setIsAuthLoading(false);
      }
    };

    void init();
    void loadPosts();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [loadPosts]);

  useEffect(() => {
    setSeoMeta('لوحة الإدارة | الموقع الرسمي لقبيلة السياحين', 'noindex, nofollow');
  }, []);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setEmail('');
      setPassword('');
    }

    setIsSubmitting(false);
  };

  const handleSignOut = async () => {
    setAuthError('');
    setEditingPostId(null);
    await supabase.auth.signOut();
  };

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user) {
      setFormError('يجب تسجيل الدخول لإضافة العناصر.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setFormError('العنوان والمحتوى مطلوبان.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const payload: AdminPostInsert = {
      title: title.trim(),
      content: content.trim(),
      kind,
      event_date: kind === 'event' && eventDate ? eventDate : null,
      created_by: session.user.id,
    };

    const { error } = await supabase.from('admin_posts').insert(payload);

    if (error) {
      setFormError(isSchemaNotFoundError(error.message) ? SCHEMA_CACHE_ERROR_MESSAGE : error.message);
      setIsSubmitting(false);
      return;
    }

    setTitle('');
    setContent('');
    setEventDate('');
    await loadPosts();
    setIsSubmitting(false);
  };

  const handleDeletePost = async (id: string) => {
    if (!canManage) {
      return;
    }

    setFormError('');
    const { error } = await supabase.from('admin_posts').delete().eq('id', id);
    if (error) {
      setFormError(isSchemaNotFoundError(error.message) ? SCHEMA_CACHE_ERROR_MESSAGE : error.message);
      return;
    }

    if (editingPostId === id) {
      setEditingPostId(null);
    }
    await loadPosts();
  };

  const beginEditPost = (post: AdminPostRecord) => {
    setFormError('');
    setEditingPostId(post.id);
    setEditKind(post.kind);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditEventDate(post.event_date ?? '');
  };

  const handleUpdatePost = async (event: FormEvent<HTMLFormElement>, id: string) => {
    event.preventDefault();
    if (!canManage) {
      setFormError('صلاحية التعديل متاحة للمشرفين فقط.');
      return;
    }

    if (!editTitle.trim() || !editContent.trim()) {
      setFormError('العنوان والمحتوى مطلوبان للتعديل.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const { error } = await supabase
      .from('admin_posts')
      .update({
        title: editTitle.trim(),
        content: editContent.trim(),
        kind: editKind,
        event_date: editKind === 'event' && editEventDate ? editEventDate : null,
      })
      .eq('id', id);

    if (error) {
      setFormError(isSchemaNotFoundError(error.message) ? SCHEMA_CACHE_ERROR_MESSAGE : error.message);
      setIsSubmitting(false);
      return;
    }

    setEditingPostId(null);
    setIsSubmitting(false);
    await loadPosts();
  };

  return (
    <div data-app-ready="true" className="min-h-screen bg-ink text-sand font-sans px-4 py-8 md:px-6">
      <div className="max-w-[960px] mx-auto">
        <header className="rounded-2xl border border-brass/20 bg-ink-2/70 p-6 mb-6">
          <p className="font-kufi text-xs text-brass-lt/80 mb-2">الموقع الرسمي لقبيلة السياحين</p>
          <h1 className="font-ruqaa text-4xl md:text-5xl text-brass-lt mb-2">لوحة الإدارة — الأخبار والمناسبات</h1>
          <p className="text-sm text-sand-dim">
            تسجيل الدخول للمشرفين ثم إدارة العناصر المنشورة بصلاحيات كاملة: إضافة وتعديل وحذف.
          </p>
        </header>

        {isAuthLoading ? (
          <p className="text-sm font-kufi text-sand-dim">جارٍ التحقق من جلسة الدخول...</p>
        ) : canManage ? (
          <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-kufi text-sm text-sand-dim">
                تم تسجيل الدخول باسم: <span className="text-brass-lt">{session?.user.email}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  void handleSignOut();
                }}
                className="px-4 py-2 rounded-lg border border-brass/30 text-base font-kufi text-brass-lt hover:bg-brass/10 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 mb-6">
            <h2 className="font-kufi text-xl text-brass-lt mb-4">تسجيل دخول المشرف</h2>
            <form onSubmit={(event) => {
              void handleSignIn(event);
            }} className="grid gap-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="البريد الإلكتروني"
                className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="كلمة المرور"
                className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-base font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'جارٍ تسجيل الدخول...' : 'دخول'}
              </button>
              {authError && <p className="text-xs font-kufi text-copper">{authError}</p>}
            </form>
          </section>
        )}

        {canManage && (
          <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5 mb-6">
            <h2 className="font-kufi text-xl text-brass-lt mb-4">إضافة عنصر جديد</h2>
            <form onSubmit={(event) => {
              void handleCreatePost(event);
            }} className="grid gap-3">
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value as AdminPostKind)}
                className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
              >
                {KIND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {kind === 'event' && (
                <input
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
                />
              )}

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="العنوان"
                className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
                required
              />

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="المحتوى"
                rows={4}
                className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
                required
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-base font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'جارٍ الحفظ...' : 'إضافة'}
              </button>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
          <h2 className="font-kufi text-xl text-brass-lt mb-4">العناصر المنشورة</h2>
          {isLoadingPosts ? (
            <p className="text-sm font-kufi text-sand-dim">جارٍ تحميل العناصر...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm font-kufi text-sand-dim">لا توجد عناصر حالياً.</p>
          ) : (
            <div className="grid gap-3">
              {posts.map((post) => (
                <article key={post.id} className="rounded-xl border border-brass/15 bg-ink/50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-kufi text-brass-lt/80 mb-1">
                        {post.kind === 'event' ? 'مناسبة' : 'خبر'} •{' '}
                        {formatGregorianDateArabic(post.kind === 'event' ? post.event_date : post.created_at)}
                      </p>
                      <p className="inline-flex items-center gap-1.5 rounded-full border border-brass/25 bg-brass/8 px-2.5 py-1 text-xs font-kufi text-sand">
                        <span className="text-sm md:text-base leading-none text-sand">{VERIFIED_AUTHOR_NAME}</span>
                        <BadgeCheck
                          aria-label="موثق"
                          className="w-4 h-4 text-azure shrink-0"
                        />
                      </p>
                      <h3 className="font-serif text-lg text-sand">{post.title}</h3>
                      <p className="text-sm text-sand-dim mt-2 leading-relaxed">{post.content}</p>
                    </div>
                    {canManage && (
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => beginEditPost(post)}
                          className="rounded-lg border border-brass/35 px-3 py-1.5 text-sm font-kufi text-brass-lt hover:bg-brass/10 transition-colors"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void handleDeletePost(post.id);
                          }}
                          className="rounded-lg border border-copper/40 px-3 py-1.5 text-sm font-kufi text-copper hover:bg-copper/10 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    )}
                  </div>
                  {canManage && editingPostId === post.id && (
                    <form onSubmit={(event) => {
                      void handleUpdatePost(event, post.id);
                    }} className="grid gap-3 mt-4">
                      <select
                        value={editKind}
                        onChange={(event) => setEditKind(event.target.value as AdminPostKind)}
                        className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
                      >
                        {KIND_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {editKind === 'event' && (
                        <input
                          type="date"
                          value={editEventDate}
                          onChange={(event) => setEditEventDate(event.target.value)}
                          className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
                        />
                      )}
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="العنوان بعد التعديل"
                        className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
                        required
                      />
                      <textarea
                        value={editContent}
                        onChange={(event) => setEditContent(event.target.value)}
                        placeholder="المحتوى بعد التعديل"
                        rows={4}
                        className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
                        required
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60"
                        >
                          {isSubmitting ? 'جارٍ حفظ التعديل...' : 'حفظ التعديل'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPostId(null)}
                          className="rounded-lg border border-sand/25 px-4 py-2 text-sm font-kufi text-sand-dim hover:bg-sand/10 transition-colors"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              ))}
            </div>
          )}
          {formError && <p className="mt-3 text-xs font-kufi text-copper">{formError}</p>}
        </section>
      </div>
    </div>
  );
}
