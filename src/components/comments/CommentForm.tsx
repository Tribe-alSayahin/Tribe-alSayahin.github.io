import type { FormEvent } from 'react';
import type { VisitorProfile } from '../../lib/visitor-profile';
import { CommentAccountCard } from './CommentAccountCard';

interface CommentFormProps {
  authChecked: boolean;
  canSubmit: boolean;
  content: string;
  error: string;
  isOfficialAccount: boolean;
  message: string;
  profile: VisitorProfile | null;
  submitting: boolean;
  onContentChange: (content: string) => void;
  onGoogleSignIn: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CommentForm({
  authChecked,
  canSubmit,
  content,
  error,
  isOfficialAccount,
  message,
  profile,
  submitting,
  onContentChange,
  onGoogleSignIn,
  onSubmit,
}: CommentFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-brass/15 bg-ink-2/50 p-5 md:p-6 space-y-4">
      <CommentAccountCard
        authChecked={authChecked}
        profile={profile}
        isOfficialAccount={isOfficialAccount}
      />

      <label className="block">
        <span className="block text-xs font-kufi text-brass-lt/85 mb-2">اكتب تعليقك</span>
        <textarea
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
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
        {authChecked && !isOfficialAccount && (
          <button
            type="button"
            onClick={onGoogleSignIn}
            className="rounded-lg border border-brass/25 bg-sand px-5 py-2.5 text-sm font-kufi font-semibold text-ink hover:bg-sand/90 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
          >
            الدخول بحساب قوقل للتعليق
          </button>
        )}
      </div>
    </form>
  );
}
