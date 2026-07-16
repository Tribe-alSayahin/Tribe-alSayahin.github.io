import { useState, type FormEvent, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { getAdminRedirectUrl } from '../../lib/auth-redirect';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setNotConfigured(true);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) onLoginSuccess();
    }).catch(() => {});
  }, [onLoginSuccess]);

  const doSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message || 'خطأ في إنشاء الحساب');
        setLoading(false);
      } else {
        setSuccess('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني لتأكيد الحساب.');
        setLoading(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || 'خطأ في تسجيل الدخول');
        setLoading(false);
      } else {
        onLoginSuccess();
      }
    }
  };

  const doGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAdminRedirectUrl(),
      },
    });
    if (error) {
      setError(error.message || 'خطأ في تسجيل الدخول عبر Google');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    void doSubmit(e);
  };

  const handleGoogleSignIn = () => {
    void doGoogleSignIn();
  };

  if (notConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <Card hoverGlow={false} className="border-brass/20 bg-ink-2/60 backdrop-blur-xl max-w-md">
          <CardContent className="p-space-8 text-center">
            <h1 className="font-serif text-2xl font-bold text-sand mb-4">لوحة الإدارة غير مفعّلة</h1>
            <p className="text-sm text-sand-dim font-sans mb-6">
              لم يتم تكوين Supabase بعد. أضف <code className="text-brass-lt">VITE_SUPABASE_URL</code> و
              <code className="text-brass-lt">VITE_SUPABASE_ANON_KEY</code> في إعدادات GitHub Secrets، ثم أعد بناء المشروع.
            </p>
            <Button variant="secondary" onClick={() => (window.location.href = '/')}>
              العودة للموقع
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Card hoverGlow={false} className="border-brass/20 bg-ink-2/60 backdrop-blur-xl">
          <CardContent className="p-space-8">
            <div className="text-center mb-space-8">
              <h1 className="font-serif text-2xl font-bold text-sand mb-2">
                {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل دخول الإدارة'}
              </h1>
              <p className="text-sm text-sand-dim font-sans">
                {isSignUp ? 'أنشئ حساباً جديداً للوصول إلى لوحة التحكم' : 'قم بإدخال بيانات حسابك للوصول إلى لوحة التحكم'}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-space-5">
              <div>
                <label className="block text-xs font-kufi font-semibold text-brass-lt/85 mb-space-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-ink/60 border border-brass/20 rounded-xl px-space-4 py-space-3 text-sm text-sand font-sans focus:outline-none focus:border-brass/50 focus:ring-2 focus:ring-brass/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-kufi font-semibold text-brass-lt/85 mb-space-2">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-ink/60 border border-brass/20 rounded-xl px-space-4 py-space-3 text-sm text-sand font-sans focus:outline-none focus:border-brass/50 focus:ring-2 focus:ring-brass/20 transition-all"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 font-sans text-center bg-red-500/10 border border-red-500/20 rounded-lg px-space-3 py-space-2">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-xs text-green-400 font-sans text-center bg-green-500/10 border border-green-500/20 rounded-lg px-space-3 py-space-2">
                  {success}
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? 'جارٍ التحقق...' : isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}
              </Button>
            </form>
            <div className="relative my-space-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brass/15" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-ink-2/60 px-space-3 text-sand-dim font-sans">أو</span>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center gap-space-3"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isSignUp ? 'التسجيل بواسطة Google' : 'تسجيل الدخول بواسطة Google'}
            </Button>
            <div className="text-center mt-space-6">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
                className="text-xs text-brass-lt hover:text-brass font-sans underline underline-offset-2 transition-colors"
              >
                {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
