'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createComment, fetchCommentsByPost, type PublicComment } from '../../lib/comments';
import { getCleanCurrentUrl } from '../../lib/auth-redirect';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import {
  getVisitorProfile,
  isOfficialGoogleProfile,
  type VisitorProfile,
} from '../../lib/visitor-profile';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

interface PostCommentsProps {
  postId: string;
}

export function PostComments({ postId }: PostCommentsProps) {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [content, setContent] = useState('');
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isOfficialAccount = isOfficialGoogleProfile(visitorProfile) && Boolean(visitorId);
  const canSubmit = useMemo(
    () => authChecked && isOfficialAccount && content.trim().length >= 3 && !submitting,
    [authChecked, content, isOfficialAccount, submitting],
  );

  useEffect(() => {
    let mounted = true;

    const applySession = (user: Parameters<typeof getVisitorProfile>[0]) => {
      setVisitorId(user?.id ?? null);
      setVisitorProfile(getVisitorProfile(user));
      setAuthChecked(true);
    };

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
      applySession(session?.user ?? null);
      if (commentsResult.data) setComments(commentsResult.data);
      setLoading(false);
    };

    void load().catch(() => {
      if (!mounted) return;
      setError('تعذر تحميل التعليقات الآن. حاول مرة أخرى لاحقًا.');
      setAuthChecked(true);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user ?? null);
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
    if (!visitorId || !isOfficialGoogleProfile(visitorProfile)) {
      setError('يلزم تسجيل الدخول بحساب قوقل رسمي يحمل اسمك قبل التعليق.');
      return;
    }
    if (trimmedContent.length < 3) {
      setError('اكتب تعليقًا واضحًا قبل الإرسال.');
      return;
    }

    setSubmitting(true);
    const result = await createComment({
      post_id: postId,
      user_id: visitorId,
      author_name: visitorProfile.name,
      content: trimmedContent,
      status: 'pending',
    });

    if (result.error) {
      setError('تعذر إرسال التعليق. تأكد من الدخول بحساب قوقل ثم حاول مرة أخرى.');
      setSubmitting(false);
      return;
    }

    setContent('');
    setMessage('تم إرسال تعليقك، وسيظهر بعد مراجعته واعتماده.');
    const commentsResult = await fetchCommentsByPost(postId);
    if (commentsResult.data) setComments(commentsResult.data);
    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getCleanCurrentUrl() },
    });
    if (signInError) {
      setError('تعذر بدء تسجيل الدخول بحساب قوقل. حاول مرة أخرى.');
    }
  };

  return (
    <section className="mt-14 border-t border-brass/15 pt-8">
      <div className="mb-6">
        <p className="font-kufi text-xs text-brass-lt/80">تعليقات الزوار</p>
        <h2 className="font-serif text-2xl text-sand mt-2">المشاركة على هذا المنشور</h2>
      </div>

      <CommentForm
        authChecked={authChecked}
        canSubmit={canSubmit}
        content={content}
        error={error}
        isOfficialAccount={isOfficialAccount}
        message={message}
        profile={visitorProfile}
        submitting={submitting}
        onContentChange={setContent}
        onGoogleSignIn={() => { void handleGoogleSignIn(); }}
        onSubmit={(event) => { void handleSubmit(event); }}
      />
      <CommentList comments={comments} loading={loading} />
    </section>
  );
}
