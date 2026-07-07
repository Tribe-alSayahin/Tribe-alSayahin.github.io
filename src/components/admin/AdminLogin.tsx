import { useState, type FormEvent, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setNotConfigured(true);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) onLoginSuccess();
    });
  }, [onLoginSuccess]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message || 'خطأ في تسجيل الدخول');
      setLoading(false);
    } else {
      onLoginSuccess();
    }
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
              <h1 className="font-serif text-2xl font-bold text-sand mb-2">تسجيل دخول الإدارة</h1>
              <p className="text-sm text-sand-dim font-sans">قم بإدخال بيانات حسابك للوصول إلى لوحة التحكم</p>
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
                  className="w-full bg-ink/60 border border-brass/20 rounded-xl px-space-4 py-space-3 text-sm text-sand font-sans focus:outline-none focus:border-brass/50 focus:ring-2 focus:ring-brass/20 transition-all"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 font-sans text-center bg-red-500/10 border border-red-500/20 rounded-lg px-space-3 py-space-2">
                  {error}
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? 'جارٍ التحقق...' : 'تسجيل الدخول'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
