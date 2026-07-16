import type { VisitorProfile } from '../../lib/visitor-profile';

interface CommentAccountCardProps {
  authChecked: boolean;
  profile: VisitorProfile | null;
  isOfficialAccount: boolean;
}

export function CommentAccountCard({
  authChecked,
  profile,
  isOfficialAccount,
}: CommentAccountCardProps) {
  return (
    <div className="rounded-xl border border-brass/10 bg-ink/50 px-4 py-3">
      <p className="text-xs font-kufi text-sand-dim mb-1">سيظهر اسمك من حسابك الرسمي</p>
      {isOfficialAccount && profile ? (
        <div className="flex flex-wrap items-center gap-3">
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-11 w-11 rounded-full border border-brass/20 object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-kufi text-sand">{profile.name}</p>
            <p className="mt-1 break-all text-xs text-sand-dim">
              الحساب: {profile.email || 'حساب قوقل موثّق'}
            </p>
            <p className="mt-1 text-[11px] font-kufi text-brass-lt/80">طريقة الدخول: قوقل</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-sand">
          {!authChecked
            ? 'جارٍ قراءة بيانات الحساب...'
            : profile
              ? 'الحساب الحالي غير مؤهل للتعليق. ادخل بحساب قوقل الرسمي.'
              : 'لم يتم تسجيل الدخول بعد'}
        </p>
      )}
    </div>
  );
}
