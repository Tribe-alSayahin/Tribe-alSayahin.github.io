'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createComment, fetchCommentsByPost, type Comment } from '../../lib/comments';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { getCleanCurrentUrl } from '../../lib/auth-redirect';

interface PostCommentsProps {
  postId: string;
}

const getVisitorName = (sessionUser: {
  email?: string;
  user_metadata?: Record<string, unknown>;
} | null): string => {
  if (!sessionUser) return '';

  const metadata = sessionUser.user_metadata ?? {};
  const metadataName =
    typeof metadata.full_name === 'string'
      ? metadata.full_name
      : typeof metadata.name === 'string'
        ? metadata.name
        : '';

  return metadataName.trim() || sessionUser.email?.split('@')[0]?.trim() || '';
};

export function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const canSubmit = useMemo(
    () => Boolean(authChecked && content.trim().length >= 3 && !submitting),
    [authChecked, content, submitting],
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!isSupabaseConfigured()) {
        setAuthChecked(true);
        setLoading(false);
        return;
      }

      const [{ data: { session } }, commentsResult] = await Promise.all([
        supabase.auth.getSession(),
        fetchCommentsByPost(postId),
      ]);

      if (!mounted) return;

      setVisitorId(session?.user?.id ?? null);
      setVisitorName(getVisitorName(session?.user ?? null));
      setAuthChecked(true);
      if (commentsResult.data) {
        setComments(commentsResult.data);
      }
      setLoading(false);
    };

    void load().catch(() => {
      if (!mounted) return;
      setError('تعذر تحميل التعليقات الآن.');
      setAuthChecked(true);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setVisitorId(session?.user?.id ?? null);
      setVisitorName(getVisitorName(session?.user ?? null));
      setAuthChecked(true);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [postId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const trimmedContent = content.trim();
    if (!visitorId || !visitorName) {
      setError('يلزم تسجيل الدخول بحساب Google رسمي قبل التعليق.');
      return;
    }
    if (trimmedContent.length < 3) {
      setError('اكتب تعليقاً واضحاً قبل الإرسال.');
      return;
    }

    setSubmitting(true);
    const result = await createComment({
      post_id: postId,
      user_id: visitorId,
      author_name: visitorName,
      content: trimmedContent,
      status: 'pending',
    });

    if (result.error) {
      setError(result.error.message || 'تعذر إرسال التعليق.');
      setSubmitting(false);
      return;
    }

    setContent('');
    setMessage('تم إرسال تعليقك، وسيظهر بعد مراجعته واعتماده.');
    const commentsResult = await fetchCommentsByPost(postId);
    if (commentsResult.data) {
      setComments(commentsResult.data);
    }
    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getCleanCurrentUrl(),
      },
    });
    if (error) {
      setError(error.message || 'تعذر بدء تسجيل الدخول.');
    }
  };

  return (
    <section className="mt-14 border-t border-brass/15 pt-8">
      <div className="mb-6">
        <p className="font-kufi text-xs text-brass-lt/80">تعليقات الزوار</p>
        <h2 className="font-serif text-2xl text-sand mt-2">المشاركة على هذا المنشور</h2>
      </div>

      <form onSubmit={(event) => { void handleSubmit(event); }} className="rounded-2xl border border-brass/15 bg-ink-2/50 p-5 md:p-6 space-y-4">
        <div className="rounded-xl border border-brass/10 bg-ink/50 px-4 py-3">
          <p className="text-xs font-kufi text-sand-dim mb-1">سيظهر اسمك من حسابك الرسمي</p>
          <p className="text-sm text-sand">
            {visitorName || (authChecked ? 'لم يتم تسجيل الدخول بعد' : 'جارٍ قراءة بيانات الحساب...')}
          </p>
        </div>

        <label className="block">
          <span className="block text-xs font-kufi text-brass-lt/85 mb-2">اكتب تعليقك</span>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={5}
            maxLength={1000}
            className="w-full resize-y rounded-xl border border-brass/20 bg-ink/70 px-4 py-3 text-sm leading-loose text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50 focus-visible:ring-2 focus-visible:ring-brass"
            placeholder="شارك رأيك أو إضافتك حول هذا المنشور..."
          />
        </label>

        {error && (
          <p className="rounded-lg border border-copper/25 bg-copper/10 px-3 py-2 text-xs font-kufi text-copper-lt">{error}</p>
        )}
        {message && (
          <p className="rounded-lg border border-emerald/25 bg-emerald/10 px-3 py-2 text-xs font-kufi text-emerald-lt">{message}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-brass/20 border border-brass/35 px-5 py-2.5 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
          >
            {submitting ? 'جارٍ إرسال التعليق...' : 'إرسال التعليق'}
          </button>
          {authChecked && !visitorId && (
            <button
              type="button"
              onClick={() => { void handleGoogleSignIn(); }}
              className="rounded-lg border border-brass/25 bg-sand px-5 py-2.5 text-sm font-kufi font-semibold text-ink hover:bg-sand/90 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            >
              الدخول بحساب Google للتعليق
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-sand-dim">جارٍ تحميل التعليقات...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-sand-dim">لا توجد تعليقات معتمدة بعد.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-brass/10 bg-ink-2/35 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-kufi text-sm text-sand">{comment.author_name || 'زائر'}</p>
                  {comment.status === 'pending' && (
                    <span className="rounded-full border border-brass/20 bg-brass/10 px-2 py-0.5 text-[10px] font-kufi text-brass-lt">
                      بانتظار الاعتماد
                    </span>
                  )}
                </div>
                <time className="text-xs text-sand-dim" dateTime={comment.created_at}>
                  {new Date(comment.created_at).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <p className="text-sm leading-loose text-sand-dim whitespace-pre-line">{comment.content}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
