import { motion } from 'motion/react';
import { Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

export function Supporters() {
  const supportersList = [
    { name: 'داعم مجهود التوثيق المالي واللوجستي', role: 'داعم مساهم في صون إرث القبيلة' },
    { name: 'داعم مجهود التوثيق المالي واللوجستي', role: 'داعم مساهم في صون إرث القبيلة' },
    { name: 'داعم مجهود التوثيق المالي واللوجستي', role: 'داعم مساهم في صون إرث القبيلة' },
    { name: 'داعم مجهود التوثيق المالي واللوجستي', role: 'داعم مساهم في صون إرث القبيلة' },
    { name: 'داعم مجهود التوثيق المالي واللوجستي', role: 'داعم مساهم في صون إرث القبيلة' },
    { name: 'داعم مجهود التوثيق المالي واللوجستي', role: 'داعم مساهم في صون إرث القبيلة' },
  ];

  return (
    <section id="supporters" className="section bg-ink px-6 relative z-10 py-16">
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
            <div 
              className="relative w-full max-w-lg p-[3px] rounded-3xl shadow-2xl"
              style={{
                background: 'linear-gradient(165deg, #ffd700, #c5a059, #8b6508)'
              }}
            >
              <div 
                className="rounded-[21px] p-8 md:p-10 text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(165deg, #f2ca74, #cfa04a, #8c6723)',
                  boxShadow: 'inset 0 4px 12px rgba(255, 255, 255, 0.6), inset 0 -4px 12px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Vintage decorative elements */}
                <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '40px 30px' }} />
                
                <span className="block font-kufi text-xs font-bold text-[#4a340b] tracking-wider mb-2">
                  الراعي والداعم المالي الرئيسي لتوثيق إرث القبيلة
                </span>
                
                <h3 className="text-3xl md:text-4xl font-serif font-extrabold text-[#291a03] py-2">
                  اسم الداعم والراعي الرئيسي المعتمد
                </h3>
                
                <div className="w-32 h-[1px] bg-[#4a340b]/30 mx-auto my-4" />
                
                <p className="font-kufi text-[11px] text-[#4a340b]/80 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                  <Award className="w-4.5 h-4.5 text-[#291a03]" />
                  لوح نحاسي ذهبي من الفئة الممتازة
                </p>
              </div>
            </div>
          </motion.div>

          {/* Supporters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportersList.map((sup, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-[2px] rounded-2xl shadow-lg hover:scale-[1.03] transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, #cda052, #a87f37, #73521a)'
                }}
              >
                <div 
                  className="rounded-[14px] p-5 text-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #dfba6b, #b68f3e, #7c5a1d)',
                    boxShadow: 'inset 0 3px 8px rgba(255, 255, 255, 0.45), inset 0 -3px 8px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  <span className="block font-kufi text-[9px] font-bold text-[#453008] tracking-wide mb-1.5 opacity-85">
                    داعم توثيق الإرث والموروث التاريخي
                  </span>
                  <h4 className="text-xl font-serif font-bold text-[#241703]">
                    {sup.name}
                  </h4>
                  <p className="text-[10px] text-[#453008]/70 font-sans mt-1">
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
              className="relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-xl hover:border-brass/40 transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, #120e0a, #1a130b, var(--ink-2))',
                borderColor: 'var(--brass-lt)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border border-brass/35 flex items-center justify-center text-brass-lt bg-brass/10">
                  <ShieldCheck className="w-6 h-6 text-brass-lt" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-brass-lt font-kufi text-[10px] font-bold tracking-wider border border-brass/20 bg-brass/5">
                    إدارة وبناء المنصة الموثقة
                  </span>
                  <span className="block text-[10px] text-sand-dim/60 font-mono mt-0.5 uppercase tracking-wider">
                    General Supervisor / المشرف العام
                  </span>
                </div>
              </div>

              <h4 className="text-2xl font-serif font-extrabold text-sand leading-snug">
                حسين بن علي بن بعاج ابن مسيلم
              </h4>
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
              className="relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-xl hover:border-brass/40 transition-all duration-300"
              style={{
                background: 'linear-gradient(145deg, #120e0a, #1a130b, var(--ink-2))',
                borderColor: 'var(--brass-lt)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full border border-brass/35 flex items-center justify-center text-brass-lt bg-brass/10">
                  <Users className="w-6 h-6 text-brass-lt" />
                </div>
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-brass-lt font-kufi text-[10px] font-bold tracking-wider border border-brass/20 bg-brass/5">
                    تصميم وتطوير البوابة الرقمية
                  </span>
                  <span className="block text-[10px] text-sand-dim/60 font-mono mt-0.5 uppercase tracking-wider">
                    Creative Director / المشرف الفني
                  </span>
                </div>
              </div>

              <h4 className="text-2xl font-serif font-extrabold text-sand leading-snug">
                عبدالعزيز بن سلطان بن تركي ابن مسيلم
              </h4>
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
              className="mt-4 max-w-lg mx-auto rounded-2xl p-4 text-right border"
              style={{
                background: 'rgba(var(--brass), 0.04)',
                borderColor: 'rgba(var(--brass), 0.12)'
              }}
            >
              <p className="text-xs text-sand-dim/90 leading-relaxed font-sans flex gap-2 items-start">
                <HeartHandshake className="w-4 h-4 text-brass-lt shrink-0 mt-0.5" />
                <span>
                  <strong className="text-brass-lt font-kufi">ملاحظة تنظيمية:</strong> تم إدراج أسماء ونماذج مؤقتة للداعمين أعلاه كخطوة تنظيمية أولى. نرحب بتزويدنا بالقائمة المعتمدة وصور الداعمين والجهات الكريمة لتحديثها في الألواح مباشرة، مع إمكانية تصنيف الرعاية لمستويات ذهبية وفضية تليق بكرم الداعمين.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
