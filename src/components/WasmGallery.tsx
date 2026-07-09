import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Activity, Info } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface WasmVariation {
  id: string;
  name: string;
  subName: string;
  meaning: string;
  location: string;
  branches: string;
  description: string;
  historicalNote: string;
  path: string; // SVG path of the mark
  extraSvg?: (strokeColor: string) => ReactNode; // Optional extra elements
  camelSpot: { x: number; y: number; label: string }; // Position on the camel diagram
}

const WASM_VARIATIONS: WasmVariation[] = [
  {
    id: 'classic',
    name: 'الباب الأصيل',
    subName: 'وسم الباب بنسبة 3 × 1.5',
    meaning: 'وسم الباب يتكوّن من ثلاثة خطوط مستقيمة بنسبة 3 متر عرض و1.5 متر ارتفاع؛ خط علوي طويل وخطان رأسيان عند الطرفين، وهو مفتوح من الأسفل.',
    location: 'على امتداد الجهة اليسرى من رقبة المطية.',
    branches: 'عامة قبيلة السياحين من المزاحمة من الروقة.',
    description: 'يمثل وسم الباب العلامة التراثية الجامعة، ويظهر بعرض يساوي ضعف الارتفاع، دون خط سفلي أو زخارف إضافية.',
    historicalNote: 'يُعرف وسم الباب ببساطة تكوينه ووضوحه، إذ يتكون من ثلاثة خطوط مستقيمة فقط.',
    path: 'M40,130 L40,70 L160,70 L160,130',
    camelSpot: { x: 38, y: 34, label: 'امتداد الرقبة اليسرى' }
  },
  {
    id: 'mutraq',
    name: 'الباب والمطرق',
    subName: 'وسم التمييز لبعض العوائل والفرسان',
    meaning: 'هيكل الباب الأساسي مع إضافة مطرق (خط عمودي مستقل) بجوار الركيزة اليمنى.',
    location: 'على الرقبة من الجانب الأيسر.',
    branches: 'ذوي سنيان وحمائل من السياحين.',
    description: 'يُستخدم هذا التباين لتمييز حلال بعض الأفخاذ والعوائل المحددة داخل القبيلة للفرز والمتابعة، وهو تقليد بدوي عريق لتنظيم الثروة الحيوانية.',
    historicalNote: 'توارثت العوائل هذا الميسم ليكون بمثابة الهوية الفرعية الحافظة للأصول داخل الإرث الجماعي الكبير للقبيلة.',
    path: 'M45,160 L45,60 L125,60 L125,160',
    extraSvg: (stroke) => (
      <path d="M155,60 L155,160" fill="none" stroke={stroke} strokeWidth="12" strokeLinecap="round" />
    ),
    camelSpot: { x: 42, y: 31, label: 'أعلى الرقبة اليسرى' }
  }
];

export function WasmGallery() {
  const [selectedVar, setSelectedVar] = useState<WasmVariation>(WASM_VARIATIONS[0]);
  const [hoveredVar, setHoveredVar] = useState<WasmVariation | null>(null);

  return (
    <div id="wasm-gallery" className="mt-space-16 pt-space-12 border-t border-brass/15 text-right">
      <div className="max-w-[1160px] mx-auto">
        
        {/* Title */}
        <div className="text-center mb-space-10">
          <span className="font-kufi text-[11px] text-brass-lt font-bold block mb-space-1">
            ✦ التوثيق الميداني والتباينات ✦
          </span>
          <h3 className="text-2xl md:text-4xl font-serif text-sand font-bold">
            معرض تباينات وسم الباب التاريخية
          </h3>
          <p className="max-w-[720px] mx-auto mt-space-3 text-sand-dim text-xs md:text-sm leading-relaxed">
            تتعدد تباينات وسم «الباب» بين فروع وعوائل قبيلة السياحين لتشكل خريطة تراثية دقيقة لحفظ الأنساب وفحص الحلال وتوثيق الأصالة والمفاخر التاريخية.
          </p>
        </div>

        {/* Dynamic Display Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-8 items-stretch">
          
          {/* Right Area: Interactive Grid of Variations */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-space-4">
            {WASM_VARIATIONS.map((item) => {
              const isSelected = selectedVar.id === item.id;
              return (
                <Card
                  key={item.id}
                  onClick={() => setSelectedVar(item)}
                  onMouseEnter={() => setHoveredVar(item)}
                  onMouseLeave={() => setHoveredVar(null)}
                  className={`relative flex flex-col justify-between p-space-5 rounded-2xl border text-right transition-all duration-base cursor-pointer ${
                    isSelected
                      ? 'bg-[#18283a] border-brass shadow-glow-md'
                      : 'bg-ink-2/40 border-brass/10 hover:border-brass/40 hover:bg-[#132030]/60'
                  }`}
                >
                  {/* Selected Indicator Glow */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-16 h-16 bg-radial from-brass/10 to-transparent blur-md rounded-full pointer-events-none" />
                  )}

                  <div className="flex justify-between items-start gap-space-3 w-full mb-space-3">
                    {/* SVG thumbnail of the Wasm */}
                    <div className="w-16 h-16 rounded-xl bg-[#0e1622] border border-brass/15 p-space-2 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_4px_rgba(201,151,62,0.2)]">
                        <path
                          d={item.path}
                          fill="none"
                          stroke={isSelected ? 'var(--brass-lt)' : 'rgba(201,151,62,0.6)'}
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {item.extraSvg && item.extraSvg(isSelected ? 'var(--brass-lt)' : 'rgba(201,151,62,0.6)')}
                      </svg>
                    </div>

                    <div className="grow">
                      <h4 className="font-serif text-lg font-bold text-sand group-hover:text-brass-lt transition-colors">
                        {item.name}
                      </h4>
                      <p className="font-kufi text-[10px] text-brass-lt/90 mt-space-0.5">
                        {item.subName}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-sand-dim/85 leading-relaxed line-clamp-2 mt-space-2 border-t border-brass/5 pt-space-2">
                    {item.meaning}
                  </p>

                  <div className="flex items-center justify-between mt-space-3 text-[10px] text-brass-lt font-semibold">
                    <span className="flex items-center gap-space-1">
                      <Activity className="w-3 h-3 opacity-70" /> {item.location.split(' ')[0] || 'الرقبة'}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Left Area: Detailed Mark Display & Camel Anatomy Blueprint */}
          <Card hoverGlow={false} className="lg:col-span-5 bg-gradient-to-b from-[#142232] to-ink-2 border border-brass/20 rounded-3xl p-space-6 md:p-space-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Ambient background grid pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(201,151,62,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(201,151,62,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedVar.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-space-6 relative z-10"
              >
                {/* Header Info */}
                <div className="border-b border-brass/10 pb-space-4">
                  <div className="mb-space-1.5">
                    <Badge variant="brass" showDot={true}>
                      <Shield className="w-3.5 h-3.5 text-brass-lt" />
                      توثيق الميسم المعتمد
                    </Badge>
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-sand">
                    {selectedVar.name}
                  </h4>
                  <p className="text-xs text-brass-lt font-serif italic mt-space-0.5">
                    {selectedVar.subName}
                  </p>
                </div>

                {/* Simulated Hot Branding Vector Animation */}
                <div className="flex justify-center items-center py-space-4 relative group">
                  <div className="absolute -inset-4 bg-radial from-brass/5 to-transparent blur-lg rounded-full pointer-events-none" />
                  <div className="w-40 h-40 bg-[#0c121d] rounded-2xl border border-brass/15 p-space-4 flex items-center justify-center relative shadow-inner">
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_12px_rgba(201,151,62,0.4)]">
                      <motion.path
                        d={selectedVar.path}
                        fill="none"
                        stroke="var(--brass)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, strokeDasharray: 360, strokeDashoffset: 360 }}
                        animate={{ pathLength: 1, strokeDashoffset: 0 }}
                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                      />
                      {selectedVar.extraSvg && (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                        >
                          {selectedVar.extraSvg('var(--brass)')}
                        </motion.g>
                      )}
                    </svg>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-space-3.5 text-sm">
                  <div className="bg-ink/50 border border-brass/10 p-space-3.5 rounded-xl">
                    <span className="font-kufi text-xs text-brass-lt font-bold block mb-space-1">المعنى والدلالة:</span>
                    <p className="text-sand-dim text-xs leading-relaxed">{selectedVar.meaning}</p>
                  </div>

                  <div className="bg-ink/50 border border-brass/10 p-space-3.5 rounded-xl">
                    <span className="font-kufi text-xs text-brass-lt font-bold block mb-space-1">الموضع ومكان الكي:</span>
                    <p className="text-sand-dim text-xs leading-relaxed">{selectedVar.location}</p>
                  </div>

                  <div className="bg-ink/50 border border-brass/10 p-space-3.5 rounded-xl">
                    <span className="font-kufi text-xs text-brass-lt font-bold block mb-space-1">الأفخاذ والعوائل الموسومة:</span>
                    <p className="text-sand-dim text-xs leading-relaxed font-semibold text-brass-lt">{selectedVar.branches}</p>
                  </div>

                  <div className="bg-brass/5 border border-brass/10 p-space-3.5 rounded-xl">
                    <span className="font-kufi text-xs text-brass-lt font-bold block mb-space-1 flex items-center gap-space-1">
                      <Sparkles className="w-3 h-3" /> الملاحظة التاريخية:
                    </span>
                    <p className="text-sand-dim text-xs leading-relaxed italic">{selectedVar.historicalNote}</p>
                  </div>
                </div>

                {/* Interactive Camel Diagram positioning blueprint */}
                <div className="border-t border-brass/10 pt-space-4 mt-space-4">
                  <span className="font-kufi text-[10px] text-brass-lt block mb-space-2 font-bold">
                    مخطط الموضع التشريحي على المطية:
                  </span>
                  <div className="relative h-28 bg-ink-2/80 rounded-xl border border-brass/10 flex items-center justify-center overflow-hidden">
                    {/* Camel Silhouette SVG */}
                    <svg viewBox="0 0 300 120" className="w-full h-full opacity-35 max-w-[200px]" fill="currentColor">
                      <path
                        d="M 50 100 Q 40 90 40 70 Q 40 40 45 30 Q 50 20 60 10 Q 70 5 80 15 Q 85 20 90 35 L 95 60 Q 110 50 130 50 Q 150 48 180 52 Q 210 55 230 60 Q 250 65 255 75 Q 260 85 255 95 L 250 115 L 240 115 L 245 95 Q 240 85 220 85 Q 195 85 180 90 L 175 115 L 165 115 L 172 90 Q 150 90 130 90 L 125 115 L 115 115 L 122 85 Q 100 85 85 90 L 80 115 L 70 115 L 78 85 Q 60 85 50 100 Z"
                        fill="var(--sand-dim)"
                      />
                    </svg>

                    {/* Glowing Spot */}
                    <div
                      className="absolute w-4 h-4 rounded-full bg-brass border border-sand animate-ping pointer-events-none"
                      style={{
                        left: `${selectedVar.camelSpot.x}%`,
                        top: `${selectedVar.camelSpot.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                    <div
                      className="absolute w-2.5 h-2.5 rounded-full bg-brass shadow-[0_0_10px_#c9973e] border border-white pointer-events-none"
                      style={{
                        left: `${selectedVar.camelSpot.x}%`,
                        top: `${selectedVar.camelSpot.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />

                    {/* Label Overlay */}
                    <div className="absolute bottom-2 right-2 bg-ink/90 border border-brass/20 rounded-md px-2 py-0.5 text-[9px] text-sand font-kufi">
                      {selectedVar.camelSpot.label}
                    </div>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-space-2 text-[10px] text-brass-lt/60 justify-center border-t border-brass/5 pt-space-4 mt-space-6">
              <Info className="w-3.5 h-3.5" />
              <span>ميثاق السياحين المعتمد • منصة التوثيق التفاعلية للوسم</span>
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}

export default WasmGallery;
