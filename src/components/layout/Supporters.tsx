'use client';

import { motion } from 'motion/react';
import { Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SUPPORTERS_DATA } from './Supporters.data';
import { VerifiedBadge } from '../ui/VerifiedBadge';

export function Supporters() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Primary Gold Plaque */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="flex justify-center"
      >
        <div className="relative w-full max-w-lg p-[3px] rounded-3xl bg-gradient-to-br from-brass-lt via-brass to-brass/60 shadow-glow-lg">
          <div className="rounded-[21px] p-8 md:p-10 text-center relative overflow-hidden bg-gradient-to-br from-brass-lt/90 via-brass/85 to-brass/65 text-ink shadow-[inset_0_4px_12px_color-mix(in_srgb,var(--sand)_35%,transparent),inset_0_-4px_12px_color-mix(in_srgb,var(--ink)_25%,transparent)]">
            {/* Vintage decorative elements */}
            <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '40px 30px' }} />

            <span className="block font-kufi text-xs font-bold text-ink/80 tracking-wider mb-2">
              الراعي والداعم المالي الرئيسي لتوثيق إرث القبيلة
            </span>

            <h3 className="text-3xl md:text-4xl font-serif font-extrabold text-ink py-2">
              اسم الداعم والراعي الرئيسي المعتمد
            </h3>

            <div className="w-32 h-[1px] bg-ink/30 mx-auto my-4" />

            <p className="font-kufi text-[11px] text-ink/80 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
              <Award className="w-4.5 h-4.5 text-ink" />
              لوح نحاسي ذهبي من الفئة الممتازة
            </p>
          </div>
        </div>
      </motion.div>

      {/* Supporters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUPPORTERS_DATA.map((sup, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-[2px] rounded-2xl bg-gradient-to-br from-brass-lt via-brass to-brass/55 shadow-glow-sm hover:shadow-glow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="rounded-[14px] p-5 text-center relative overflow-hidden bg-gradient-to-br from-brass-lt/90 via-brass/80 to-brass/60 text-ink shadow-[inset_0_3px_8px_color-mix(in_srgb,var(--sand)_25%,transparent),inset_0_-3px_8px_color-mix(in_srgb,var(--ink)_25%,transparent)]">
              <span className="block font-kufi text-[9px] font-bold text-ink/75 tracking-wide mb-1.5">
                داعم توثيق الإرث والموروث التاريخي
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <h4 className="text-xl font-serif font-bold text-ink">
                  {sup.name}
                </h4>
                {sup.verified && <VerifiedBadge size="sm" />}
              </div>
              <p className="text-[10px] text-ink/70 font-sans mt-1">
                {sup.role}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Administrators and Founders Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Hussein */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative isolate overflow-hidden rounded-2xl border border-brass/40 bg-gradient-to-b from-coffee via-ink-2 to-ink p-6 shadow-xl ring-1 ring-inset ring-sand/5 transition-all duration-300 hover:-translate-y-1 hover:border-brass/65 hover:shadow-glow-md md:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-repeat opacity-[0.035]"
            style={{ backgroundImage: 'var(--sadu)', backgroundSize: '44px 26px' }}
          />
          <div aria-hidden="true" className="absolute inset-2 -z-10 rounded-xl border border-brass/10" />
          <div aria-hidden="true" className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-brass-lt to-transparent" />
          <ShieldCheck aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 -z-10 h-36 w-36 text-brass opacity-[0.035]" />

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brass/45 bg-brass/10 text-brass-lt shadow-[inset_0_0_0_5px_color-mix(in_srgb,var(--brass)_6%,transparent),0_0_20px_color-mix(in_srgb,var(--brass)_10%,transparent)]">
              <ShieldCheck className="w-6 h-6 text-brass-lt" />
            </div>
            <div className="min-w-0">
              <span className="block font-kufi text-xs font-bold text-brass-lt">
                إدارة وبناء المنصة الموثقة
              </span>
              <span className="mt-1 block font-kufi text-[10px] text-sand-dim/70">
                المشرف العام
              </span>
            </div>
          </div>

          <div className="relative border-y border-brass/20 bg-brass/[0.045] px-1 py-5 sm:px-3">
            <div aria-hidden="true" className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-brass/35 to-transparent" />
            <div className="flex items-center justify-center gap-2">
              <h4 className="whitespace-nowrap text-center text-xs font-serif font-extrabold leading-snug text-sand sm:text-lg xl:text-xl">
                حسين بن علي بن بعاج ابن مسيلم
              </h4>
              <VerifiedBadge size="md" />
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-sand-dim font-sans">
            مدير الموقع والمشرف العام، والمسؤول المباشر عن تدقيق وجمع الوثائق والمقتبسات والمراجع التاريخية لنسب وقبيلة السياحين.
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-brass/10 pt-4 text-xs font-kufi">
            <span className="text-brass-lt font-bold">المشرف العام</span>
            <span className="text-sand-dim/80">تنسيق وإدارة المحتوى المعتمد</span>
          </div>
        </motion.div>

        {/* Abdulaziz */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative isolate overflow-hidden rounded-2xl border border-brass/40 bg-gradient-to-b from-coffee via-ink-2 to-ink p-6 shadow-xl ring-1 ring-inset ring-sand/5 transition-all duration-300 hover:-translate-y-1 hover:border-brass/65 hover:shadow-glow-md md:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-repeat opacity-[0.035]"
            style={{ backgroundImage: 'var(--sadu)', backgroundSize: '44px 26px' }}
          />
          <div aria-hidden="true" className="absolute inset-2 -z-10 rounded-xl border border-brass/10" />
          <div aria-hidden="true" className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-brass-lt to-transparent" />
          <Users aria-hidden="true" className="pointer-events-none absolute -bottom-8 -left-8 -z-10 h-36 w-36 text-brass opacity-[0.035]" />

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-brass/45 bg-brass/10 text-brass-lt shadow-[inset_0_0_0_5px_color-mix(in_srgb,var(--brass)_6%,transparent),0_0_20px_color-mix(in_srgb,var(--brass)_10%,transparent)]">
              <Users className="w-6 h-6 text-brass-lt" />
            </div>
            <div className="min-w-0">
              <span className="block font-kufi text-xs font-bold text-brass-lt">
                تصميم وتطوير البوابة الرقمية
              </span>
              <span className="mt-1 block font-kufi text-[10px] text-sand-dim/70">
                المشرف الفني
              </span>
            </div>
          </div>

          <div className="relative border-y border-brass/20 bg-brass/[0.045] px-1 py-5 sm:px-3">
            <div aria-hidden="true" className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-brass/35 to-transparent" />
            <div className="flex items-center justify-center gap-2">
              <h4 className="whitespace-nowrap text-center text-xs font-serif font-extrabold leading-snug text-sand sm:text-lg xl:text-xl">
                عبدالعزيز بن سلطان بن تركي ابن مسيلم
              </h4>
              <VerifiedBadge size="md" />
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-sand-dim font-sans">
            المصمم والمطور والمشرف الفني العام على المنصة الرقمية والتنسيق الفني والتشغيلي لعرض إرث قبيلة السياحين بأسلوب عصري.
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-brass/10 pt-4 text-xs font-kufi">
            <span className="text-brass-lt font-bold">التصميم والتطوير</span>
            <span className="text-sand-dim/80">رؤية فنية رقمية معاصرة</span>
          </div>
        </motion.div>
      </div>

      {/* Support callout footer */}
      <div className="text-center pt-6">
        <p className="text-sand-dim text-sm md:text-base font-sans">
          هل ترغب بدعم مجهود توثيق إرث القبيلة؟{' '}
          <a
            href="#contact"
            className="text-brass-lt hover:text-brass font-bold font-kufi underline underline-offset-4 transition-colors"
          >
            تواصل معنا الآن عبر ديوان تواصل
          </a>
        </p>
        <div className="mt-4 max-w-lg mx-auto rounded-2xl p-4 text-right border border-brass/15 bg-brass/5">
          <p className="text-xs text-sand-dim/90 leading-relaxed font-sans flex gap-2 items-start">
            <HeartHandshake className="w-4 h-4 text-brass-lt shrink-0 mt-0.5" />
            <span>
              <strong className="text-brass-lt font-kufi">ملاحظة تنظيمية:</strong> يرجى تزويد إدارة الموقع بالقائمة المعتمدة للداعمين وصور الجهات الكريمة لاعتمادها رسمياً ضمن لوحة التكريم.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
