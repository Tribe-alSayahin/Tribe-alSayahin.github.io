'use client';

import { SectionHeader } from './SectionHeader';

const adminCards = [
  {
    title: 'مجلس الإدارة',
    description:
      'الجهة المشرفة على شؤون الموقع الرسمي لقبيلة السياحين، واعتماد المواد المنشورة بما يحفظ الهوية والتوثيق.',
  },
  {
    title: 'الهيكل الإداري',
    description:
      'تنظيم إداري واضح يحدد مهام الإشراف، التحرير، التوثيق، والمتابعة التقنية لضمان استمرارية العمل وجودته.',
  },
  {
    title: 'وسائل التواصل الرسمية',
    description:
      'نافذة تواصل مباشرة مع الإدارة لاستقبال المقترحات والتحديثات والمواد التاريخية الموثقة من أبناء القبيلة.',
  },
];

export function Administration() {
  return (
    <section id="administration" className="section bg-ink px-6 relative z-10 py-20 md:py-28">
      <div className="max-w-[1160px] mx-auto">
        <SectionHeader
          serialNumber="١٠"
          badgeText="قسم الإدارة"
          title="الإدارة والتنظيم"
          description="القسم المعني بالإشراف الإداري على الموقع الرسمي لقبيلة السياحين، وتنظيم المحتوى، وتوحيد قنوات التواصل الرسمية."
        />

        <div className="opacity-100 translate-y-0 transition-all duration-800 grid grid-cols-1 md:grid-cols-3 gap-5">
          {adminCards.map((card) => (
            <article
              key={card.title}
              className="editorial-card interactive-lift rounded-2xl p-6"
            >
              <h3 className="font-kufi text-lg text-brass-lt mb-3">{card.title}</h3>
              <p className="text-sand-dim leading-8 text-sm md:text-base">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
