import type { PublicComment } from '../../lib/comments';

interface CommentListProps {
  comments: PublicComment[];
  loading: boolean;
}

export function CommentList({ comments, loading }: CommentListProps) {
  if (loading) {
    return <p className="mt-8 text-sm text-sand-dim">جارٍ تحميل التعليقات...</p>;
  }

  if (comments.length === 0) {
    return <p className="mt-8 text-sm text-sand-dim">لا توجد تعليقات معتمدة بعد.</p>;
  }

  return (
    <div className="mt-8 space-y-4">
      {comments.map((comment) => (
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
      ))}
    </div>
  );
}
