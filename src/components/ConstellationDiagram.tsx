'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Scroll, BookOpen, Star } from 'lucide-react';

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

  const activeStar = SEVEN_LINEAGES.find(s => s.id === activeStarId) || SEVEN_LINEAGES[6];

  return (
    <div className="relative bg-gradient-to-b from-ink to-ink-2/40 border border-brass/15 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl overflow-hidden min-h-[500px] lg:min-h-[580px] flex flex-col lg:flex-row gap-8 items-stretch">
      {/* Ghost Background Folio Numeral */}
      <div className="absolute right-6 bottom-4 text-9xl font-serif font-extrabold text-brass/3 select-none pointer-events-none tracking-tighter">
        ٠٧
      </div>

      {/* Title & Info on Left */}
      <div className="w-full lg:w-2/5 flex flex-col justify-between z-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-brass-lt font-kufi text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-brass-lt" />
            <span>خارطة النجوم التاريخية</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-sand mt-2">
            مخطط كوكبة النسب الصاعد
          </h3>
          <p className="text-sand-dim/80 text-sm mt-3 leading-relaxed">
            مخطط فلكي فني يحاكي قبة السماء النجدية، يربط السلسلة الذهبية لنسب قبيلة السياحين في شكل كوكبة صاعدة من جذورها العدنانية الغائرة في التاريخ إلى فرعها المعاصر المشرق.
          </p>
        </div>

        {/* Selected Star Details Card (Interactive) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStar.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="bg-ink/90 border-r-4 border-r-brass border border-brass/10 rounded-2xl p-5 md:p-6 space-y-3 relative shadow-xl"
          >
            <div className="absolute top-4 left-4">
              <Scroll className="w-5 h-5 text-brass/40" />
            </div>

            <span className="text-[10px] uppercase tracking-widest font-mono text-brass-lt font-bold bg-brass/10 px-2 py-0.5 rounded">
              مرحلة: {activeStar.title}
            </span>
            <h4 className="text-xl md:text-2xl font-serif font-bold text-sand-dim">
              {activeStar.name}
            </h4>
            <div className="text-xs font-kufi text-brass/80 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brass" />
              <span>الحقبة: {activeStar.era}</span>
            </div>
            
            <p className="text-xs md:text-sm text-sand/90 leading-relaxed font-sans pt-1">
              {activeStar.description}
            </p>

            <div className="text-[11px] text-sand-dim leading-relaxed border-t border-brass/10 pt-2.5 italic">
              {activeStar.details}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Constellation Sky on Right */}
      <div className="w-full lg:w-3/5 min-h-[320px] lg:min-h-full bg-ink/80 border border-brass/10 rounded-2xl relative overflow-hidden flex items-center justify-center p-4">
        {/* Sky Dust & Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(58,88,114,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none select-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '44px 26px' }} />

        {/* SVG Drawing Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Constellation Connecting Lines */}
          <g>
            {SEVEN_LINEAGES.map((star, idx) => {
              if (idx === SEVEN_LINEAGES.length - 1) return null;
              const nextStar = SEVEN_LINEAGES[idx + 1];
              return (
                <line
                  key={`line-${star.id}-${nextStar.id}`}
                  x1={`${star.x}%`}
                  y1={`${star.y}%`}
                  x2={`${nextStar.x}%`}
                  y2={`${nextStar.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  className="animate-[dash_10s_linear_infinite]"
                />
              );
            })}
          </g>

          {/* Glowing Gradients */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3a5872" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#c9973e" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#edc978" stopOpacity="0.3" />
            </linearGradient>
            
            <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#edc978" stopOpacity="1" />
              <stop offset="30%" stopColor="#c9973e" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0a0703" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Interactive Stars */}
        <div className="absolute inset-0 w-full h-full">
          {/* Render background glow circles for active star */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500 bg-gradient-radial from-brass/20 via-brass/5 to-transparent"
            style={{
              left: `${activeStar.x}%`,
              top: `${activeStar.y}%`,
              width: '120px',
              height: '120px',
            }}
          />

          {SEVEN_LINEAGES.map((star, index) => {
            const isActive = star.id === activeStarId;
            return (
              <button
                key={star.id}
                onClick={() => setActiveStarId(star.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-20 border-0 bg-transparent"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                }}
              >
                {/* Pulsing Aura */}
                <div
                  className={`absolute -inset-4 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-brass/15 animate-ping opacity-70 scale-100' 
                      : 'bg-transparent group-hover:bg-indigo/10 scale-75'
                  }`}
                />

                {/* Star Point Graphic */}
                <div
                  className={`relative w-4 h-4 rounded-full border flex items-center justify-center shadow-lg transition-all duration-400 ${
                    isActive
                      ? 'bg-gradient-to-r from-brass to-brass-lt border-sand scale-125'
                      : 'bg-[#121820] border-brass/55 group-hover:border-sand group-hover:scale-110'
                  }`}
                >
                  {/* Innermost hot-spot */}
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-ink' : 'bg-brass-lt'}`} />
                  
                  {/* Mini labels on top */}
                  <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-kufi font-bold px-1.5 py-0.5 rounded-md transition-all duration-300 ${
                    isActive 
                      ? 'bg-brass text-ink font-extrabold shadow-md scale-105' 
                      : 'text-sand-dim group-hover:text-sand'
                  }`}>
                    {star.name}
                  </span>

                  {/* Node Order Number (faint) */}
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-brass/60 font-bold select-none">
                    {`0${index + 1}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Small Compass Arrow Deco in bottom left of the sky */}
        <div className="absolute bottom-4 left-4 p-2 bg-ink/40 border border-brass/10 rounded-xl text-[9px] text-brass/70 font-mono flex items-center gap-1.5 select-none z-10">
          <Star className="w-3 h-3 text-brass animate-spin-slow" />
          <span>ASCENDING LINEAGE MAP · 34° N</span>
        </div>
      </div>
    </div>
  );
}
