import { useState, FormEvent } from 'react';
import { Send, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [formError, setFormError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('يرجى كتابة الاسم الكريم.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('يرجى إدخال بريد إلكتروني صحيح.');
      return;
    }
    if (!msg.trim()) {
      setFormError('يرجى كتابة نص الرسالة.');
      return;
    }

    setShowSuccessModal(true);
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className="max-w-[680px] mx-auto">
      <div className="editorial-card p-6 md:p-10 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {formError && (
            <div className="flex items-center gap-2 p-4 bg-copper/10 border border-copper/40 text-sand rounded-xl text-sm font-semibold text-right" role="alert">
              <AlertCircle className="w-5 h-5 text-copper-lt shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="space-y-2 text-right">
            <label htmlFor="contact-name" className="block font-semibold text-brass-lt text-sm">الاسم الكـريم</label>
            <input
              id="contact-name"
              type="text"
              placeholder="اكتب اسمك الكريم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-brass/20 bg-ink/70 text-sand placeholder-sand-dim/70 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/15 transition-all text-base focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="space-y-2 text-right">
            <label htmlFor="contact-email" className="block font-semibold text-brass-lt text-sm">البريد الإلكتروني</label>
            <input
              id="contact-email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-brass/20 bg-ink/70 text-sand placeholder-sand-dim/70 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/15 transition-all text-base ltr focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <div className="space-y-2 text-right">
            <label htmlFor="contact-msg" className="block font-semibold text-brass-lt text-sm">الرسالة</label>
            <textarea
              id="contact-msg"
              rows={4}
              placeholder="اكتب رسالتك هنا..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-brass/20 bg-ink/70 text-sand placeholder-sand-dim/70 focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/15 transition-all text-base focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-brass to-brass-lt text-ink hover:-translate-y-1 hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none border-0"
          >
            <Send className="w-5 h-5" />
            إرسال الرسالة
          </button>
        </form>
      </div>

      {/* Form Submission Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)} />
          <div className="relative bg-ink-2 border border-brass/35 p-8 rounded-2xl max-w-sm w-full shadow-2xl space-y-4 text-center z-10 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-brass/10 border border-brass/25 text-brass-lt flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 id="success-modal-title" className="text-xl font-bold font-serif text-sand">تم إرسال رسالتكم بنجاح</h3>
            <p className="text-sm text-sand-dim font-sans">نشكركم على تواصلكم الكريم. سنتلقى رسالتكم بمحمل الجد والتدقيق التاريخي المعتمد.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-brass to-brass-lt text-ink font-bold rounded-xl shadow-md border-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
