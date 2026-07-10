import { motion } from 'motion/react';
import { Award, Users, ShieldCheck, HeartHandshake, BadgeCheck } from 'lucide-react';
import { SectionHeader } from './SectionHeader';
import { SUPPORTERS_DATA } from './Supporters.data';

export function Supporters() {
  return (
    <section id="supporters" className="section section-surface bg-ink px-5 md:px-8 relative z-10 py-20 md:py-28">
      <div className="max-w-[1160px] mx-auto">
        <SectionHeader
          serialNumber="٠٨.٧"
          badgeText="بدعمهم نستمر"
          title="داعمو وثيقة وإرث القبيلة"
          description="تقديراً وعرفاناً لرجالات وأبناء قبيلة السياحين الذين ساهموا بسخاء ودعم مستمر في توثيق هذا الإرث التاريخي العريق وصونه للأجيال."
        />

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
                  <h4 className="text-xl font-serif font-bold text-ink">
                    {sup.name}
                  </h4>
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
              className="editorial-card interactive-lift p-6 md:p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border border-brass/35 flex items-center justify-center text-brass-lt bg-brass/10">
                  <ShieldCheck className="w-6 h-6 text-brass-lt" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-brass-lt font-kufi text-[10px] font-bold tracking-wider border border-brass/20 bg-brass/5">
                    إدارة وبناء المنصة الموثقة
                  </span>
                  <span className="block text-[10px] text-sand-dim/60 font-kufi mt-0.5 tracking-wider">
                    المشرف العام
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-3xl md:text-4xl font-serif font-extrabold text-sand leading-snug">
                  حسين بن علي بن بعاج ابن مسيلم
                </h4>
                <BadgeCheck className="w-7 h-7 md:w-8 md:h-8 text-brass-lt shrink-0" aria-label="موثّق" />
              </div>
              <p className="text-sm text-sand-dim mt-2.5 leading-relaxed font-sans">
                مدير الموقع والمشرف العام، والمسؤول المباشر عن تدقيق وجمع الوثائق والمقتبسات والمراجع التاريخية لنسب وقبيلة السياحين.
              </p>

              <div className="mt-6 pt-4 border-t border-brass/10 flex items-center justify-between text-xs font-kufi">
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
              className="editorial-card interactive-lift p-6 md:p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border border-brass/35 flex items-center justify-center text-brass-lt bg-brass/10">
                  <Users className="w-6 h-6 text-brass-lt" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-brass-lt font-kufi text-[10px] font-bold tracking-wider border border-brass/20 bg-brass/5">
                    تصميم وتطوير البوابة الرقمية
                  </span>
                  <span className="block text-[10px] text-sand-dim/60 font-kufi mt-0.5 tracking-wider">
                    المشرف الفني
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-3xl md:text-4xl font-serif font-extrabold text-sand leading-snug">
                  عبدالعزيز بن سلطان بن تركي ابن مسيلم
                </h4>
                <BadgeCheck className="w-7 h-7 md:w-8 md:h-8 text-brass-lt shrink-0" aria-label="موثّق" />
              </div>
              <p className="text-sm text-sand-dim mt-2.5 leading-relaxed font-sans">
                المصمم والمطور والمشرف الفني العام على المنصة الرقمية والتنسيق الفني والتشغيلي لعرض إرث قبيلة السياحين بأسلوب عصري.
              </p>

              <div className="mt-6 pt-4 border-t border-brass/10 flex items-center justify-between text-xs font-kufi">
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
            <div 
              className="mt-4 max-w-lg mx-auto rounded-2xl p-4 text-right border border-brass/15 bg-brass/5"
            >
              <p className="text-xs text-sand-dim/90 leading-relaxed font-sans flex gap-2 items-start">
                <HeartHandshake className="w-4 h-4 text-brass-lt shrink-0 mt-0.5" />
                <span>
                  <strong className="text-brass-lt font-kufi">ملاحظة تنظيمية:</strong> يرجى تزويد إدارة الموقع بالقائمة المعتمدة للداعمين وصور الجهات الكريمة لاعتمادها رسمياً ضمن لوحة التكريم.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
