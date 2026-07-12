'use client';

import { motion } from 'motion/react';
import { LOCAL_REFS } from '../../lib/references';

interface TimelineEvent {
  title: string;
  description: string;
  reference?: string;
}

export function Timeline() {
  const events: TimelineEvent[] = [
    {
      title: 'الأصل والنسب والديار الأولى',
      description: 'تنحدر قبيلة السياحين من جدّها الجامع سيحان بن ناصر بن مزحم، لتكون من أفخاذ المزاحمة العريقة والراسخة من الروقة من عتيبة الهيلا، ولهم تاريخ طويل من الاستقرار والتنقل في نجد العذية.',
    },
    {
      title: 'شجاعة وفروسية مشهودة',
      description: 'عُرف أبناء السياحين بالبأس الشديد والإقدام والفروسية في حماية مراعيهم ومناهل مياههم، وبرز منهم فرسان وقادة سطروا مواقف بطولية تناقلتها مرويات المجالس النجدية والقصائد النبطية الخالدة.',
    },
    {
      title: 'المشاركة التاريخية في توحيد البلاد وضمّ القصيم',
      description: 'شارك السياحين — ومنهم جماعة وربع ابن مسيلم — ضمن جيش الملك عبد العزيز آل سعود (طيب الله ثراه) في حملات ضمّ منطقة القصيم المباركة سنة ١٣٢١–١٣٢٢هـ، وشهدوا وقائع حاسمة منها غزوة الشنانة الشهيرة، مساهمين بدمائهم وأرواحهم في تأسيس وتوحيد المملكة العربية السعودية العظمى.',
      reference: `${LOCAL_REFS[0].author}، ${LOCAL_REFS[0].bookTitle}، ${LOCAL_REFS[0].publisher}، ${LOCAL_REFS[0].year}، ${LOCAL_REFS[0].pages}.`,
    },
    {
      title: 'الحاضر المشرق والعهد الزاهر',
      description: 'تواصل قبيلة السياحين اليوم مسيرة البناء والنماء في ظل القيادة السعودية الرشيدة، متمسكين بقيم التلاحم والوفاء والمواطنة الصالحة، ومحافظين على موروثهم التاريخي وصيانته فخراً للأجيال المقبلة.',
    },
  ];

  return (
    <div className="relative border-r-2 border-brass/25 pr-6 md:pr-10 max-w-[820px] mx-auto mt-4">
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          className="relative mb-12 last:mb-0"
        >
          {/* Timeline dot marker */}
          <div
            className="absolute right-[-31px] md:right-[-47px] top-1.5 w-4 h-4 rounded-full border-4 border-ink bg-brass-lt shadow-[0_0_8px_rgba(235,212,129,0.8)]"
            aria-hidden="true"
          />

          <div className="editorial-card interactive-lift p-6 md:p-8 shadow-xl">
            <h3 className="text-xl md:text-2xl font-serif text-brass-lt font-bold mb-3 text-right">
              {event.title}
            </h3>
            <p className="text-sand-dim text-sm md:text-base leading-relaxed text-right font-sans">
              {event.description}
            </p>
            {event.reference && (
              <div className="mt-4 pt-3 border-t border-brass/10 text-xs text-sand-dim/80 text-right font-sans leading-relaxed flex items-start gap-2">
                <span className="text-brass-lt font-bold shrink-0 font-kufi">المصدر التاريخي:</span>
                <span>{event.reference}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
