import { useState } from 'react';
import { Scroll, BookOpen, Eye, Shield, X, Type } from 'lucide-react';
import { ORIENTALIST_REFS, LOCAL_REFS } from '../../lib/references';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export function Footer({ scrollToSection }: FooterProps) {
  const [refTab, setRefTab] = useState<'illustrated' | 'traditional'>('illustrated');
  const [selectedRefDoc, setSelectedRefDoc] = useState<string>('philby');
  const [isRefDocZoomed, setIsRefDocZoomed] = useState<boolean>(false);
  const [modalFontSize, setModalFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  // استخدام السجل الموحد — المرجع الوحيد للحقيقة
  const DOCS_DATA = ORIENTALIST_REFS;
  const currentDoc = DOCS_DATA.find((d) => d.id === selectedRefDoc) ?? DOCS_DATA[0];

  return (
    <footer className="section-surface bg-ink-2 border-t border-brass/15 py-20 md:py-24 px-5 md:px-8 relative z-10 text-center">
      {/* شريط سدو زخرفي أعلى التذييل */}
      <div className="section-divider absolute top-0 inset-x-0 -translate-y-1/2" aria-hidden="true" />
      <div className="max-w-[1160px] mx-auto">
        {/* REFERENCES & ILLUSTRATED ARCHIVE */}
        <div className="editorial-card max-w-[1040px] mx-auto mb-14 p-6 md:p-10 pb-12 border-b border-brass/15 text-right relative">
          <div className="text-center mb-8">
            <span className="font-kufi text-xs text-brass-lt font-semibold">التوثيق التفاعلي</span>
            <h3 className="text-2xl md:text-3xl mt-1 text-sand font-serif">المصادر والمراجع التاريخية</h3>
            <div className="w-[60px] h-[2px] bg-brass/35 mx-auto mt-3" />
          </div>

          {/* Tabs Controller */}
          <div className="flex justify-center mb-8">
            <div className="bg-ink border border-brass/20 rounded-2xl p-1.5 flex gap-1">
              <button
                onClick={() => setRefTab('illustrated')}
                className={`px-5 py-2 rounded-lg text-xs md:text-sm font-kufi transition-all flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none border-0 ${
                  refTab === 'illustrated'
                    ? 'bg-gradient-to-r from-brass to-brass-lt text-ink font-bold shadow-md'
                    : 'text-sand-dim hover:text-sand'
                }`}
                role="tab"
                aria-selected={refTab === 'illustrated'}
                aria-controls="illustrated-panel"
              >
                <Scroll className="w-4 h-4" />
                الأرشيف الاستشراقي المصوّر
              </button>
              <button
                onClick={() => setRefTab('traditional')}
                className={`px-5 py-2 rounded-lg text-xs md:text-sm font-kufi transition-all flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none border-0 ${
                  refTab === 'traditional'
                    ? 'bg-gradient-to-r from-brass to-brass-lt text-ink font-bold shadow-md'
                    : 'text-sand-dim hover:text-sand'
                }`}
                role="tab"
                aria-selected={refTab === 'traditional'}
                aria-controls="traditional-panel"
              >
                <BookOpen className="w-4 h-4" />
                المراجع والمدونات العامة
              </button>
            </div>
          </div>

          {/* Tab contents */}
          <div id="tab-panels-container">
            {refTab === 'illustrated' ? (
              <div id="illustrated-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" role="tabpanel">
                {/* Left: Document Selector Menu */}
                <div className="lg:col-span-5 space-y-2.5">
                  <p className="text-xs font-kufi text-brass-lt/80 mb-2 mr-1">اختر وثيقة المستشرق لعرض مقتبسها المصور:</p>
                  
                  {DOCS_DATA.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedRefDoc(item.id)}
                      className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
                        selectedRefDoc === item.id
                          ? 'bg-brass/10 border-brass text-brass-lt shadow-md'
                          : 'bg-ink-2/45 border-brass/10 text-sand-dim hover:text-sand hover:bg-ink-2/90'
                      }`}
                      role="button"
                      aria-pressed={selectedRefDoc === item.id}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] font-kufi font-bold ${
                          selectedRefDoc === item.id ? 'bg-brass text-ink border-brass' : 'bg-ink border-brass/10 text-brass-lt'
                        }`}>
                          وث
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold">{item.shortName}</h4>
                          <span className="text-[10px] text-sand-dim/60 font-mono block mt-0.5">{item.code}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono opacity-60 group-hover:text-brass-lt">{item.year}</span>
                    </button>
                  ))}
                </div>

                {/* Right: Simulated Aged Parchment Document Quote */}
                <div className="lg:col-span-7">
                  <div className="bg-gradient-to-br from-[#faf6ec] via-[#f5edd9] to-[#eaddbd] border-[#cfbfa2] border-4 rounded-2xl p-6 md:p-8 text-amber-950 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                    {/* Decorative background watermarks */}
                    <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'var(--sadu)', backgroundSize: '60px 40px' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-amber-900/5 rounded-full flex items-center justify-center pointer-events-none">
                      <Shield className="w-32 h-32 text-amber-900/5 stroke-[1]" />
                    </div>

                    {/* Top Stamp / Code metadata */}
                    <div className="flex justify-between items-center border-b border-amber-950/20 pb-4 mb-4 text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-amber-900/80 font-bold bg-amber-950/5 px-2 py-1 rounded border border-amber-950/10">
                        <span className="w-2 h-2 rounded-full bg-red-700 animate-pulse" />
                        <span>رقم القيد: {currentDoc.code}</span>
                      </div>
                      <span className="text-amber-900/60 font-semibold">{currentDoc.pages}</span>
                    </div>

                    {/* Vintage Heading */}
                    <div className="text-right space-y-1 mb-4">
                      <h4 className="font-serif text-lg font-bold text-amber-900">{currentDoc.author}</h4>
                      <p className="text-[11px] text-amber-800/80 font-serif leading-none italic">{currentDoc.authorEn} — ترجمة عربية توضيحية</p>
                      <p className="text-xs text-amber-950/80 font-serif font-semibold mt-1">كتاب: <span className="underline decoration-amber-950/30 underline-offset-4">{currentDoc.bookTitle}</span> ({currentDoc.publishInfo})</p>
                    </div>

                    {/* Arabic Translated Quote Card */}
                    <div className="bg-[#fffdf9]/95 border-r-4 border-amber-800 p-4 rounded-xl shadow-inner my-3 space-y-2 text-right relative">
                      {/* Wax Seal Overlay Simulation */}
                      <div className="absolute bottom-[-10px] left-3 w-12 h-12 rounded-full bg-red-800/25 border-2 border-red-800/40 flex items-center justify-center rotate-12 select-none pointer-events-none opacity-80">
                        <span className="text-[7px] text-red-950 font-mono font-bold">ARCHIVE</span>
                      </div>
                      
                      <span className="text-[10px] text-amber-900/60 font-kufi tracking-wider block">النص العربي الموثق:</span>
                      <p className="font-serif text-sm md:text-base leading-relaxed text-amber-950 font-bold italic">
                        {currentDoc.quoteAr}
                      </p>
                    </div>

                    {/* Original English Quote Section */}
                    <div className="text-left mt-2 border-t border-amber-950/10 pt-3">
                      <span className="text-[10px] text-amber-900/50 font-kufi block text-left tracking-wider">النص الإنجليزي المرجعي:</span>
                      <p className="font-serif text-xs leading-relaxed text-amber-900/80 italic text-left font-semibold mt-1">
                        {currentDoc.quoteEn}
                      </p>
                    </div>

                    {/* Action controllers */}
                    <div className="mt-6 pt-4 border-t border-amber-950/10 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 text-amber-900/70">
                        <span className="font-semibold text-[10px] font-mono">{currentDoc.archive}</span>
                      </div>
                      <button
                        onClick={() => setIsRefDocZoomed(true)}
                        className="bg-amber-950 text-[#fffdf9] hover:bg-amber-900 font-kufi text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-md focus-visible:ring-2 focus-visible:ring-amber-950 focus-visible:outline-none"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        تفحص الوثيقة المصوّرة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div id="traditional-panel" role="tabpanel">
                <ol className="space-y-4 text-right">
                  {LOCAL_REFS.map((ref, i) => (
                    <li key={ref.id} className="relative pr-12 pl-4 py-3 bg-ink-2 border border-brass/15 rounded-xl text-sand text-sm leading-relaxed">
                      <span className="absolute top-3.5 right-4 w-6 h-6 rounded-lg bg-brass/15 text-brass-lt border border-brass/20 flex items-center justify-center font-kufi text-xs">
                        {['١','٢','٣','٤','٥'][i] ?? i + 1}
                      </span>
                      {ref.author}، {ref.bookTitle}، الصفحات: {ref.pages}.
                      <span className="block text-sand-dim text-xs mt-1">{ref.publisher}، الطبعة الأولى {ref.year}.</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Footer Brand Logo & Copyright */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          className="logo flex items-center justify-center gap-3 text-lg font-bold font-serif text-sand hover:text-brass-lt transition-colors mb-4 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-lg p-1 w-fit mx-auto"
        >
          <div className="w-10 h-10 rounded-lg border border-brass/40 bg-gradient-to-br from-brass/15 to-transparent flex items-center justify-center text-brass shadow-glow-sm p-2">
            <svg viewBox="0 0 200 200" className="w-full h-full" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">
              <path d="M55,170 L55,50 L145,50 L145,170" />
            </svg>
          </div>
          <span className="flex flex-col items-start gap-1 leading-none text-right">
            <span className="font-kufi text-[10px] font-semibold tracking-[0.22em] text-brass-lt/85">
              الموقع الرسمي
            </span>
            <span className="font-kufi text-lg leading-none">قبيلة السياحين</span>
          </span>
        </a>
        <p className="text-sand-dim text-sm">
          © {new Date().getFullYear()} الموقع الرسمي لقبيلة السياحين — جميع الحقوق محفوظة
        </p>
        <p className="font-kufi text-xs text-brass-lt/70 tracking-wider mt-2">
          من المزاحمة • من الروقة • من عتيبة الهيلا
        </p>
      </div>

      {/* ZOOMED ARCHIVAL DOCUMENT MODAL */}
      {isRefDocZoomed && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-doc-title">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsRefDocZoomed(false)} />
          
          <div className="relative bg-gradient-to-br from-[#faf6ec] via-[#f5edd9] to-[#eaddbd] border-[#bda682] border-8 rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-2xl space-y-6 text-amber-950 animate-[scaleIn_0.3s_ease-out_forwards] max-h-[90vh] overflow-y-auto z-10">
            {/* Vintage Header Watermark */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="px-3 py-1 bg-amber-950/10 border border-amber-950/20 text-amber-900/95 rounded font-mono text-[10px] font-bold">
                سجل ببليوغرافي توضيحي
              </div>
            </div>

            <button
              onClick={() => setIsRefDocZoomed(false)}
              className="absolute top-4 right-4 w-9 h-9 bg-amber-950/10 hover:bg-amber-950/20 rounded-full flex items-center justify-center text-amber-900 cursor-pointer border-0 focus-visible:ring-2 focus-visible:ring-amber-950 focus-visible:outline-none"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Banner */}
            <div className="text-center space-y-2 border-b border-amber-950/20 pb-6 pt-4">
              <span className="font-kufi text-[11px] text-amber-800 tracking-[3px] font-bold">أرشيف توضيحي للمستشرقين (محاكاة ببليوغرافية)</span>
              <h4 id="modal-doc-title" className="text-2xl md:text-3xl font-serif font-extrabold text-amber-900 leading-tight">مراجعة بيبليوغرافيّة توضيحيّة</h4>
              <p className="font-kufi text-xs text-amber-800/70">ملف ببليوغرافي توضيحي: #{currentDoc.code}-1922/HA</p>
            </div>

            {/* Font Size Selector Control Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-amber-950/5 border border-amber-950/10 rounded-2xl px-4 py-3">
              <span className="font-kufi text-xs text-amber-900 font-bold flex items-center gap-1.5">
                <Type className="w-4 h-4 text-amber-800" />
                أداة تعديل حجم الخط (لكبار السن والقرّاء):
              </span>
              <div className="flex items-center gap-1 bg-amber-950/10 p-1 rounded-xl">
                <button
                  onClick={() => setModalFontSize('normal')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer border-0 ${
                    modalFontSize === 'normal'
                      ? 'bg-amber-900 text-amber-50 shadow-md scale-105'
                      : 'text-amber-900/85 hover:bg-amber-950/10'
                  }`}
                >
                  افتراضي
                </button>
                <button
                  onClick={() => setModalFontSize('large')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer border-0 ${
                    modalFontSize === 'large'
                      ? 'bg-amber-900 text-amber-50 shadow-md scale-105'
                      : 'text-amber-900/85 hover:bg-amber-950/10'
                  }`}
                >
                  كبير (أ+)
                </button>
                <button
                  onClick={() => setModalFontSize('huge')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer border-0 ${
                    modalFontSize === 'huge'
                      ? 'bg-amber-900 text-amber-50 shadow-md scale-105'
                      : 'text-amber-900/85 hover:bg-amber-950/10'
                  }`}
                >
                  كبير جداً (أ++)
                </button>
              </div>
            </div>

            {/* Content description */}
            <div className="space-y-4 text-right">
              <div className="bg-[#f0e4c5]/80 p-4 rounded-xl border border-amber-950/10 text-xs md:text-sm leading-relaxed">
                <span className="font-bold text-amber-900 font-kufi block mb-1">تفاصيل وموقع التوثيق بالملف الأرشيفي:</span>
                <p className={`font-serif text-amber-950 font-semibold leading-relaxed ${
                  modalFontSize === 'normal' ? 'text-xs md:text-sm' :
                  modalFontSize === 'large' ? 'text-sm md:text-base' : 'text-base md:text-lg'
                }`}>{currentDoc.detailsAr}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-amber-900/60 font-kufi font-bold block">مقتبس المستشرق الموثّق:</span>
                <div className="bg-[#fffdf9] border-r-6 border-red-800 p-6 rounded-xl shadow-md relative">
                  {/* Big vintage wax seal background watermark */}
                  <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-red-800/10 border border-red-800/20 flex items-center justify-center rotate-45 select-none pointer-events-none">
                    <span className="text-[10px] text-red-950 font-kufi font-extrabold tracking-wider text-center">نسخة<br/>أرشيفية</span>
                  </div>
                  <p className={`font-serif leading-relaxed text-amber-950 font-bold italic ${
                    modalFontSize === 'normal' ? 'text-base md:text-lg' :
                    modalFontSize === 'large' ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
                  }`}>
                    {currentDoc.quoteAr}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-amber-950/10">
                <span className="text-[10px] text-amber-900/60 font-kufi font-bold block">النص الإنجليزي المرجعي:</span>
                <div className="bg-amber-950/5 p-4 rounded-xl">
                  <p className={`font-serif leading-relaxed text-amber-900 font-semibold italic text-left ${
                    modalFontSize === 'normal' ? 'text-xs md:text-sm' :
                    modalFontSize === 'large' ? 'text-sm md:text-base' : 'text-base md:text-lg'
                  }`}>
                    {currentDoc.quoteEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Document metadata table / footer */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-amber-950/20 text-xs text-right font-serif">
              <div>
                <span className="text-amber-800/60 font-kufi block">المصدر الأصلي:</span>
                <span className="font-bold text-amber-900 font-serif">{currentDoc.bookTitle}</span>
              </div>
              <div>
                <span className="text-amber-800/60 font-kufi block">رقم الصفحة/المجلد:</span>
                <span className="font-bold text-amber-900 font-mono">{currentDoc.pages}</span>
              </div>
              <div>
                <span className="text-amber-800/60 font-kufi block">رمز التسجيل الدولي:</span>
                <span className="font-bold text-amber-900 font-mono">{currentDoc.code}</span>
              </div>
              <div>
                <span className="text-amber-800/60 font-kufi block">جهة الحفظ والتوثيق:</span>
                <span className="font-bold text-amber-900 font-serif text-[11px] leading-tight">{currentDoc.archive}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setIsRefDocZoomed(false)}
                className="bg-amber-950 hover:bg-amber-900 text-[#fffdf9] font-kufi text-xs font-bold px-8 py-3.5 rounded-xl cursor-pointer border-0 shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-950 focus-visible:outline-none"
              >
                إغلاق مستند الأرشيف
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
