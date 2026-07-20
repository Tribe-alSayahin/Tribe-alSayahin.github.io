'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BookOpen, Compass, Scroll, Sparkles, Star } from 'lucide-react';

interface ConstellationStar {
  id: string;
  name: string;
  title: string;
  era: string;
  role: string;
  description: string;
  x: number; // percentage from left
  y: number; // percentage from top
  details: string;
}

const SEVEN_LINEAGES: ConstellationStar[] = [
  {
    id: 'adnan',
    name: 'عدنان',
    title: 'الجد الأعلى للقبائل العدنانية',
    era: 'القرن الأول قبل الميلاد تقريباً',
    role: 'سلسلة النسب الإسماعيلية الرفيعة والعماد المشترك لعدنان والجزيرة.',
    description: 'هو ولد أد بن أد بن مقوم بن ناحور، من ولد إسماعيل بن إبراهيم خليل الرحمن عليهما السلام. وهو الصرح المعتمد الذي يقف عنده النسابون في صحة النسب النبوي الشريف والقبائل المعدية.',
    x: 90,
    y: 80,
    details: 'يجتمع فيه نسب القبائل العدنانية الممتدة في تهامة ونجد والحجاز، وهو رمز الشرف والمجد التاريخي الأصيل.'
  },
  {
    id: 'qays',
    name: 'قيس عيلان',
    title: 'عماد القبائل القيسية المضريّة',
    era: 'عصر ما قبل الإسلام الغابر',
    role: 'الفرع الأكبر والأشجع من مضر بن نزار بن معد بن عدنان.',
    description: 'قيس عيلان هو الناس بن مضر بن نزار بن معد بن عدنان، وهو الجد الجامع للقبائل القيسية الشهيرة بفروسيتها وأدبها وسيطرتها على بوادي نجد والحجاز.',
    x: 77,
    y: 68,
    details: 'تفرعت من قيس أعظم قبائل العرب مثل هوازن، وسليم، وغطفان، وفزارة، وغني، وباهلة، وعقيل.'
  },
  {
    id: 'hawazin',
    name: 'هوازن',
    title: 'القبيلة الهوازنية الشامخة',
    era: 'العصر الجاهلي وصدر الإسلام',
    role: 'موطن الفصاحة والفروسية وحاضنة الرسول ﷺ في بني سعد.',
    description: 'هوازن بن منصور بن عكرمة بن خصفة بن قيس عيلان. قبيلة عربية عظمى اشتهرت ببأسها في الحروب (مثل يوم حنين وفجار) وفصاحتها، ومن بطونها بنو سعد مرضعو النبي عليه الصلاة والسلام.',
    x: 63,
    y: 56,
    details: 'تمثل هوازن القاعدة القبلية والأصل الجغرافي لغالبية قبائل عالية نجد المعاصرة ومنها عتيبة.'
  },
  {
    id: 'otaibah',
    name: 'عتيبة الهيلا',
    title: 'حلف نجد العظيم وقبيلة الشرق',
    era: 'تشكل الحلف الموثق في نجد والحجاز',
    role: 'القبيلة النجدية الكبرى وريثة أمجاد هوازن وبني سعد ببادية نجد.',
    description: 'قبيلة عتيبة العربية العدنانية، تجمّع مهيب تشكّل من فروع هوازن الكبرى (جشم، وبنو سعد، وغزية) وبني هلال، وباتت القوة الضاربة في عالية نجد وباديتها.',
    x: 50,
    y: 44,
    details: 'اشتهرت بلقب "الهيلا" لغزارة جموعها وشجاعة فرسانها، ولها اليد الطولى في أحداث نجد التاريخية وثقافتها النبطية.'
  },
  {
    id: 'ruqah',
    name: 'الروقة',
    title: 'الجناح الغربي والأقوى لعتيبة',
    era: 'القرون المتأخرة وصدر الاستقرار',
    role: 'أحد قسمي عتيبة الرئيسيين (الروقة وبرقا)، أصحاب السيطرة والذود.',
    description: 'الروقة هم بنو روق بن طويق، وينقسمون إلى المزاحمة وطلحة. تميزوا بقوتهم العسكرية الفائقة واستقرارهم في أخصب مراعي عالية نجد وأوديتها العميقة.',
    x: 36,
    y: 32,
    details: 'أخرجت الروقة شيوخاً وفرساناً سطروا ملاحم في حماية المناهل والذود عن الإبل وحماية الجار.'
  },
  {
    id: 'muzahim',
    name: 'المزاحمة',
    title: 'شجرة الفرسان وأهل العاديات',
    era: 'عهود فروسية نجد الذهبية',
    role: 'الفرع الأكبر من الروقة ويضم شيوخ الشمل والبطون الشجاعة.',
    description: 'المزاحمة نسبة إلى جدهم مزاحم بن ناصر بن روق. وهم الدعامة الحربية الكبرى وقادة الفرسان، ومن فروعهم السياحين، وعضيان، وروقة، وذوي ثبيت، ومرشد، والغبيات.',
    x: 22,
    y: 20,
    details: 'تعتبر المزاحمة مصدر عزة ومنعة، وهم حماة الحدود الغربية لنجد ورعاة الهجن العراب والخيول العاديات.'
  },
  {
    id: 'siyahin',
    name: 'السياحين',
    title: 'فخر الموروث وبؤرة الاستقرار',
    era: 'تأسيس الهجر والحاضر المشرق',
    role: 'فخذ عريق ومستقل من المزاحمة أسسوا هجرة الجثوم وصانوا التراث.',
    description: 'السياحين، نسبة إلى جدهم سيحان بن ناصر بن مزحم. وهم أصحاب بأس وفروسية ونبل بدوي أصيل، تميزوا بالوفاء والوفادة وبناء الحواضر التاريخية مثل هجرة الجثوم بنجد.',
    x: 10,
    y: 10,
    details: 'يحفظون تاريخهم الموثق عبر الأجيال، متمسكين بقيم الآباء ومساهمين بفاعلية في البناء الوطني السعودي الشامل.'
  }
];

export default function ConstellationDiagram() {
  const [activeStarId, setActiveStarId] = useState<string>('siyahin');
  const prefersReducedMotion = useReducedMotion();

  const activeStar = SEVEN_LINEAGES.find(s => s.id === activeStarId) || SEVEN_LINEAGES[6];
  const activeStarIndex = SEVEN_LINEAGES.findIndex(star => star.id === activeStar.id);
  const constellationPoints = SEVEN_LINEAGES.map(star => `${star.x},${star.y}`).join(' ');

  return (
    <div className="relative isolate overflow-hidden border-y border-brass/20 bg-ink-2/75 shadow-glow-sm">
      <div
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.035]"
        style={{ backgroundImage: 'var(--sadu)', backgroundSize: '88px 52px' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,color-mix(in_srgb,var(--indigo)_42%,transparent),transparent_38%)]" />

      <div className="relative grid gap-8 border-b border-brass/15 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-12">
        <div className="max-w-3xl">
          <div className="mb-3 flex items-center gap-3 font-kufi text-xs text-brass-lt">
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>مرصد السلالة · سجل الأنساب السبعة</span>
          </div>
          <h3 className="font-ruqaa text-3xl leading-tight text-sand md:text-5xl">
            من الجذر العدناني
            <span className="text-gold-gradient block">إلى نجمة السياحين</span>
          </h3>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-8 text-sand-dim md:text-base">
            اقرأ النسب كمسار في سماء نجد؛ سبع محطات متصلة بخيط واحد، من عدنان حتى الفرع الذي أسس الجثوم وصان الموروث.
          </p>
        </div>

        <div className="grid grid-cols-2 border border-brass/15 bg-ink/45 text-center">
          <div className="border-l border-brass/15 px-5 py-4">
            <span className="block font-ruqaa text-3xl text-brass-lt">٠٧</span>
            <span className="font-kufi text-[10px] text-sand-dim">محطات النسب</span>
          </div>
          <div className="px-5 py-4">
            <span className="block font-ruqaa text-3xl text-brass-lt">٠١</span>
            <span className="font-kufi text-[10px] text-sand-dim">أصل متصل</span>
          </div>
        </div>
      </div>

      <div className="relative min-h-[30rem] overflow-hidden border-b border-brass/15 bg-ink/55 md:min-h-[36rem]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[42rem] max-w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[30rem] max-w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brass/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brass/10" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-brass/5" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-brass/5" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lineage-path" x1="90%" y1="80%" x2="10%" y2="10%">
              <stop offset="0%" stopColor="var(--brass)" stopOpacity="0.24" />
              <stop offset="48%" stopColor="var(--brass-lt)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--brass)" stopOpacity="0.36" />
            </linearGradient>
          </defs>
          <polyline
            points={constellationPoints}
            fill="none"
            stroke="url(#lineage-path)"
            strokeWidth="0.34"
            strokeDasharray="1.2 1.1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="pointer-events-none absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass/10 blur-2xl transition-[left,top] duration-500 motion-reduce:transition-none"
          style={{ left: `${activeStar.x}%`, top: `${activeStar.y}%` }}
        />

        {SEVEN_LINEAGES.map((star, index) => {
          const isActive = star.id === activeStar.id;

          return (
            <button
              key={star.id}
              type="button"
              aria-label={`عرض نسب ${star.name}: المحطة ${index + 1} من 7`}
              aria-pressed={isActive}
              aria-controls="lineage-reading"
              onClick={() => setActiveStarId(star.id)}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 bg-transparent p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              style={{ left: `${star.x}%`, top: `${star.y}%` }}
            >
              <span
                className={`relative flex h-5 w-5 items-center justify-center rounded-full border transition duration-300 motion-reduce:transition-none ${
                  isActive
                    ? 'scale-125 border-sand bg-brass shadow-glow-md'
                    : 'border-brass/60 bg-ink group-hover:scale-110 group-hover:border-brass-lt'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-ink' : 'bg-brass-lt'}`} />
                {isActive && !prefersReducedMotion && (
                  <motion.span
                    className="absolute inset-[-0.7rem] rounded-full border border-brass/35"
                    initial={{ opacity: 0.75, scale: 0.6 }}
                    animate={{ opacity: 0, scale: 1.55 }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </span>
              <span
                className={`absolute right-1/2 top-full mt-1 translate-x-1/2 whitespace-nowrap border px-2 py-1 font-kufi text-[10px] transition duration-300 motion-reduce:transition-none ${
                  isActive
                    ? 'border-brass bg-brass text-ink'
                    : 'border-transparent bg-ink/75 text-sand-dim group-hover:border-brass/20 group-hover:text-sand'
                }`}
              >
                <span className="ml-1 opacity-65">{String(index + 1).padStart(2, '0')}</span>
                {star.name}
              </span>
            </button>
          );
        })}

        <div className="pointer-events-none absolute bottom-5 left-5 hidden items-center gap-2 font-kufi text-[10px] text-brass/65 md:flex">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          <span>اتجاه القراءة: من الجذر إلى الفرع</span>
        </div>
        <div className="pointer-events-none absolute right-5 top-5 font-ruqaa text-7xl text-brass/5 md:text-9xl">
          {String(activeStarIndex + 1).padStart(2, '0')}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          id="lineage-reading"
          key={activeStar.id}
          role="region"
          aria-live="polite"
          aria-label={`تفاصيل ${activeStar.name}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          className="relative grid gap-0 bg-ink/35 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)]"
        >
          <div className="border-b border-brass/15 px-5 py-7 md:px-8 lg:border-b-0 lg:border-l lg:px-10">
            <div className="flex items-center gap-2 font-kufi text-[11px] text-brass-lt">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>المحطة {String(activeStarIndex + 1).padStart(2, '0')} من 07</span>
            </div>
            <h4 className="mt-3 font-ruqaa text-4xl text-sand md:text-5xl">{activeStar.name}</h4>
            <p className="mt-2 font-serif text-lg text-brass-lt">{activeStar.title}</p>
            <div className="mt-5 flex items-start gap-2 border-r border-brass/30 pr-3 font-kufi text-xs leading-6 text-sand-dim">
              <BookOpen className="mt-1 h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
              <span>{activeStar.era}</span>
            </div>
          </div>

          <div className="px-5 py-7 md:px-8 lg:px-10">
            <div className="mb-4 flex items-center gap-3 font-kufi text-[11px] text-brass">
              <Scroll className="h-4 w-4" aria-hidden="true" />
              <span>{activeStar.role}</span>
            </div>
            <p className="max-w-4xl font-sans text-sm leading-8 text-sand md:text-base">
              {activeStar.description}
            </p>
            <p className="mt-5 max-w-4xl border-t border-brass/10 pt-4 font-serif text-sm italic leading-8 text-sand-dim">
              {activeStar.details}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
