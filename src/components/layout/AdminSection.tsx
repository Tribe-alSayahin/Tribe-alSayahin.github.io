import { motion } from 'motion/react';
import { Settings, BookOpen, Calendar } from 'lucide-react';

const FEATURES = [
  {
    icon: BookOpen,
    title: 'نشر الأخبار',
    description: 'إضافة وإدارة الأخبار القبلية والإعلانات الرسمية الصادرة عن الإدارة.',
  },
  {
    icon: Calendar,
    title: 'المناسبات والفعاليات',
    description: 'جدولة الفعاليات والمناسبات القبلية وتحديد مواعيدها للعموم.',
  },
  {
    icon: Settings,
    title: 'إدارة المحتوى',
    description: 'لوحة تحكم قوية للمشرفين لإضافة المحتوى وتعديله وحذفه ومراجعته.',
  },
];

const ADMIN_HREF =
  typeof window !== 'undefined' &&
  /tribe-alsayahin\.github\.io$/i.test(window.location.hostname)
    ? '/admin'
    : '/admin';

export function AdminSection() {
  return (
    <div className="mt-space-12">
      {/* بطاقة البوابة */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="editorial-card relative rounded-2xl p-6 md:p-8 mb-10 overflow-hidden"
      >
        {/* زخرفة خلفية */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, var(--color-brass) 0, var(--color-brass) 1px, transparent 0, transparent 50%)',
            backgroundSize: '18px 18px',
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 font-kufi text-xs text-brass-lt/80 bg-brass/8 border border-brass/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brass-lt/60" aria-hidden="true" />
              للمشرفين فقط
            </span>
            <h3 className="font-ruqaa text-2xl md:text-3xl text-sand mb-3 leading-relaxed">
              لوحة إدارة الموقع
            </h3>
            <p className="font-sans text-sm text-sand-dim leading-loose max-w-[480px]">
              بوابة المشرفين لإدارة المحتوى المنشور على الموقع من أخبار ومناسبات بصلاحيات كاملة للإضافة
              والتعديل والحذف. يتطلب الدخول بريداً إلكترونياً وكلمة مرور.
            </p>
          </div>

          <a
            href={ADMIN_HREF}
            className="shrink-0 inline-flex items-center gap-2 font-kufi text-sm font-semibold text-ink bg-brass hover:bg-brass-lt transition-colors duration-300 px-6 py-3 rounded-xl shadow-glow-sm focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            aria-label="دخول لوحة الإدارة"
          >
            <Settings className="w-4 h-4" aria-hidden="true" />
            دخول لوحة الإدارة
          </a>
        </div>
      </motion.div>

      {/* بطاقات الميزات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="editorial-card interactive-lift group rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center mb-4 group-hover:bg-brass/15 transition-colors">
                <Icon className="w-5 h-5 text-brass-lt" aria-hidden="true" />
              </div>
              <h4 className="font-serif text-lg text-sand mb-2">{feature.title}</h4>
              <p className="font-sans text-sm text-sand-dim leading-relaxed">{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
