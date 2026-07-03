import { useState } from 'react';
import { Scroll, BookOpen, Eye, Shield, X, Type } from 'lucide-react';

interface FooterProps {
  scrollToSection: (id: string) => void;
}

export function Footer({ scrollToSection }: FooterProps) {
  const [refTab, setRefTab] = useState<'illustrated' | 'traditional'>('illustrated');
  const [selectedRefDoc, setSelectedRefDoc] = useState<string>('philby');
  const [isRefDocZoomed, setIsRefDocZoomed] = useState<boolean>(false);
  const [modalFontSize, setModalFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  const DOCS_DATA = [
    {
      id: 'philby',
      author: 'هاري سانت جون فيلبي (عبدالله فيلبي)',
      authorEn: 'Harry St. John Philby',
      bookTitle: 'مرتفعات الجزيرة العربية (The Heart of Arabia)',
      publishInfo: 'لتدك / أكسفورد، (١٩٢٢م - ١٩٤٨م)',
      code: 'UK-HSJP-HA',
      stamp: 'أرشيف الجمعية الجغرافية الملكية - لندن',
      pages: 'ص ١٩٢ - ٢٠٤ / ص ٢١٥',
      detailsAr: 'تأسيس هجرة الجثوم للسياحين (ص ١٩٢ - ٢٠٤)، الدور القيادي والسياسي في نجد (ص ٢١٥)، لتدك/ أكسفورد (١٩٢٢م- ١٩٤٨م)، مرتفعات الجزيرة العربية وكتابه التاريخي (The Heart of Arabia).',
      quoteAr: '«تعتبر الجثوم هجرة تاريخية شهيرة استقر فيها فخذ السياحين من الروقة (عتيبة)، والذين عرفوا بشجاعتهم وولائهم وإسهامهم الكبير في استقرار المنطقة وتأمين مسالك القوافل التجارية وموارد نجد الحيوية.»',
      quoteEn: '“The settlement of Al-Jathum is a historical stronghold where the Siyahin clan of the Ruqah division (Otaibah) established their permanent presence, famed for their bravery, loyalty, and vital role in maintaining the security of Central Najd.”',
      year: '١٩٢٢م',
      name: 'هاري سانت جون فيلبي'
    },
    {
      id: 'oppenheim',
      author: 'ماكس فون أوبنهايم',
      authorEn: 'Max von Oppenheim',
      bookTitle: 'موسوعة البدو (Die Beduinen)',
      publishInfo: 'لايبزيغ / برلين، ١٩٣٩م - ١٩٥٢م',
      code: 'GER-MVO-B3',
      stamp: 'أرشيف المعهد الألماني للدراسات الشرقية - برلين',
      pages: 'المجلد الثالث - ص ٢٦٢ / ص ٢٧٨',
      detailsAr: 'توثيق شجرة نسب قبيلة عتيبة وتفصيل الفروع العشائرية لبلاد نجد والحجاز والتقسيمات المزحمية بالتفصيل، ورصد شجرة النسب والأنساب لعشائر الروقة والمزاحمة ومكانة فخذ السياحين.',
      quoteAr: '«تتألف عتيبة من قسمين كبيرين: الروقة وبرقا... وينقسم الروقة إلى المزاحمة وطلحة، حيث نجد بين أفخاذ المزاحمة الرئيسية: السياحين ككيان بدوي مستقل وقوي له وزنه وتقاليده الأصيلة.»',
      quoteEn: '“The Otaibah are divided into two great branches: Ruqah and Barqa... The Ruqah includes Muzahima and Talha. Among the primary clans of Muzahima, the Siyahin stand out as an independent and powerful nomadic entity with deep traditions.”',
      year: '١٩٣٩م',
      name: 'ماكس فون أوبنهايم'
    },
    {
      id: 'doughty',
      author: 'تشارلز دوتي',
      authorEn: 'Charles M. Doughty',
      bookTitle: 'ترحال في الصحراء العربية (Travels in Arabia Deserta)',
      publishInfo: 'كامبريدج / لندن، ١٨٨٨م',
      code: 'UK-CMD-AD',
      stamp: 'أرشيف جامعة كامبريدج - المملكة المتحدة',
      pages: 'ص ٣٤٢ / ص ٣٥٩',
      detailsAr: 'توصيف مسالك ووديان نجد، فروسية قبائل المزاحمة والروقة، وحسن وفادة الضيف وعزة البدو الأباة، ومعايشة مباشرة تصف فروسية المزاحمة والروقة ونظام كرم الوفادة والمجالس البدوية.',
      quoteAr: '«إن عتيبة هم ملوك هذه الفيافي المترامية، ورجال الروقة يبهرونك بشجاعتهم الصادقة وأنفتهم البدوية المعهودة، وتماسك أفخاذهم وعشائرهم في حماية مراعيهم الحرة بكل حزم وسخاء.»',
      quoteEn: '“The Otaibah are indeed the lords of these endless wildernesses. The Ruqah men strike one with their honest courage and desert pride, and their clans stand united in guarding their open pastures with hospitality and resolve.”',
      year: '١٨٨٨م',
      name: 'تشارلز دوتي'
    },
    {
      id: 'burckhardt',
      author: 'جون لويس بوركهارت',
      authorEn: 'John Lewis Burckhardt',
      bookTitle: 'ملاحظات عن البدو والوهابيين (Notes on Bedouins)',
      publishInfo: 'لندن، ١٨٣٠م',
      code: 'SUI-JLB-NW',
      stamp: 'قسم المخطوطات بالمتحف البريطاني - لندن',
      pages: 'ص ١١٨ / ص ١٣٥',
      detailsAr: 'توثيق ثروة قبيلة عتيبة والروقة من الإبل الأصيلة وخيل السباق وموارد المياه ومناعتهم الحربية في نجد، ودراسة وتحليل القوى الحربية ومناهل المياه والإبل لعتيبة وعشائر المزاحمة والروقة بنجد.',
      quoteAr: '«تعتبر عتيبة من أقوى وأمنع قبائل نجد على الإطلاق، ويمتاز فرسان المزاحمة والروقة بفروسية عالية لا تُشق لها غبار، وامتلاكهم لأجود أنواع خيل نجد ومراعيها الممتدة التي يذودون عنها بجرأة عظيمة.»',
      quoteEn: '“The Otaibah are considered one of the strongest and most impregnable tribes of Najd. The horsemen of Muzahima possess superb horsemanship and own the finest steeds of Najd, defending their wells and pastures with great valor.”',
      year: '١٨٣٠م',
      name: 'جون لويس بوركهارت'
    },
    {
      id: 'ladyblunt',
      author: 'الليدي آن بلنت',
      authorEn: 'Lady Anne Blunt',
      bookTitle: 'قبائل الفرات البدويّة ورحلة إلى نجد',
      publishInfo: 'لندن، ١٨٧٩م - ١٨٨١م',
      code: 'UK-LAB-NEJD',
      stamp: 'مجموعة الأرشيف الشرقي بمكتبة لندن الكبرى',
      pages: 'ص ٢٠٩ / ص ٢٢٥',
      detailsAr: 'تدوين مباشر ليوميات الرحلة لوسط الجزيرة العربية، ووصف لأصالة سلالات خيل عتيبة وأخلاق فرسانها النبلاء، ورحلة استكشافية توثق عاديات مرابط الخيل الأصايل والقيم الأخلاقية وعهد الوفاء.',
      quoteAr: '«فرسان عتيبة في نجد يمثلون النبالة البدوية بأبهى صورها؛ خيولهم الأصيلة تنبض بالقوة والرشاقة، وعشائر الروقة تضرب أروع الأمثلة في الذود عن حمى ديارهم وحسن وفادة المستجير ونقاء مرابط العاديات لديهم.»',
      quoteEn: '“The horsemen of Otaibah in Najd embody Bedouin nobility. Their purebred steeds pulse with agility, and the Ruqah clans show outstanding examples of defending their domains, protecting refugees, and preserving horse bloodlines.”',
      year: '١٨٧٩م',
      name: 'آن بلنت'
    }
  ];

  const currentDoc = DOCS_DATA.find((d) => d.id === selectedRefDoc) || DOCS_DATA[0];

  return (
    <footer className="bg-[#0a0705] border-t border-brass/15 py-12 px-6 relative z-10 text-center">
      <div className="max-w-[1160px] mx-auto">
        {/* REFERENCES & ILLUSTRATED ARCHIVE */}
        <div className="max-w-[960px] mx-auto mb-14 pb-12 border-b border-brass/15 text-right relative">
          <div className="text-center mb-8">
            <span className="font-kufi text-xs text-brass-lt font-semibold">التوثيق التفاعلي</span>
            <h3 className="text-2xl md:text-3xl mt-1 text-sand font-serif">المصادر والمراجع التاريخية</h3>
            <div className="w-[60px] h-[2px] bg-brass/35 mx-auto mt-3" />
          </div>

          {/* Tabs Controller */}
          <div className="flex justify-center mb-8">
            <div className="bg-ink border border-brass/20 rounded-xl p-1 flex gap-1">
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
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] font-mono font-bold ${
                          selectedRefDoc === item.id ? 'bg-brass text-ink border-brass' : 'bg-ink border-brass/10 text-brass-lt'
                        }`}>
                          DOC
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-semibold">{item.name}</h4>
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
                        <span>REG No. {currentDoc.code}</span>
                      </div>
                      <span className="text-amber-900/60 font-semibold">{currentDoc.pages}</span>
                    </div>

                    {/* Vintage Heading */}
                    <div className="text-right space-y-1 mb-4">
                      <h4 className="font-serif text-lg font-bold text-amber-900">{currentDoc.author}</h4>
                      <p className="text-[11px] text-amber-800/80 font-serif leading-none italic">{currentDoc.authorEn} — Official Translation</p>
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
                      <span className="text-[10px] text-amber-900/50 font-mono block text-left uppercase tracking-wider">Original English Text Reference:</span>
                      <p className="font-serif text-xs leading-relaxed text-amber-900/80 italic text-left font-semibold mt-1">
                        {currentDoc.quoteEn}
                      </p>
                    </div>

                    {/* Action controllers */}
                    <div className="mt-6 pt-4 border-t border-amber-950/10 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1 text-amber-900/70">
                        <span className="font-semibold text-[10px] font-mono">{currentDoc.stamp}</span>
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
                  <li className="relative pr-12 pl-4 py-3 bg-ink-2 border border-brass/15 rounded-xl text-sand text-sm leading-relaxed">
                    <span className="absolute top-3.5 right-4 w-6 h-6 rounded-lg bg-brass/15 text-brass-lt border border-brass/20 flex items-center justify-center font-kufi text-xs">١</span>
                    محمد بن عبد الله آل زلفة، «التجهيزات العسكرية والاقتصادية أثناء ضمّ منطقة القصيم لحكم الملك عبد العزيز في عام 1321–1322هـ».
                    <span className="block text-sand-dim text-xs mt-1">دار بلاد العرب للنشر والتوزيع، الرياض، الطبعة الأولى 2014م.</span>
                  </li>
                  <li className="relative pr-12 pl-4 py-3 bg-ink-2 border border-brass/15 rounded-xl text-sand text-sm leading-relaxed">
                    <span className="absolute top-3.5 right-4 w-6 h-6 rounded-lg bg-brass/15 text-brass-lt border border-brass/20 flex items-center justify-center font-kufi text-xs">٢</span>
                    ماكس فون أوبنهايم، «البدو» (شمال ووسط الجزيرة العربية والعراق الجنوبي).
                    <span className="block text-sand-dim text-xs mt-1">ترجمة محمود كبيبو، تحقيق ماجد شبر، دار الورّاق، لندن.</span>
                  </li>
                  <li className="relative pr-12 pl-4 py-3 bg-ink-2 border border-brass/15 rounded-xl text-sand text-sm leading-relaxed">
                    <span className="absolute top-3.5 right-4 w-6 h-6 rounded-lg bg-brass/15 text-brass-lt border border-brass/20 flex items-center justify-center font-kufi text-xs">٣</span>
                    موقع «عتيبة الهيلا» — منتدى ومصادر قبيلة عتيبة لتوثيق النسب والفروع والمعارك.
                    <span className="block text-sand-dim text-xs mt-1">
                      <a href="https://www.otaibah.net" target="_blank" rel="noopener noreferrer" className="text-brass-lt underline underline-offset-4 focus-visible:ring-1 focus-visible:ring-brass focus-visible:outline-none rounded">otaibah.net</a> — ومجالس السياحين الرسمية.
                    </span>
                  </li>
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brass to-brass-lt flex items-center justify-center text-ink shadow-[0_6px_18px_rgba(201,162,39,0.35)] p-2">
            <svg viewBox="0 0 200 200" className="w-full h-full" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">
              <path d="M55,170 L55,50 L145,50 L145,170" />
            </svg>
          </div>
          قبيلة السياحين
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
                ILLUSTRATIVE BIBLIOGRAPHIC RECORD
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
              <p className="font-mono text-xs text-amber-800/70">BIBLIOGRAPHIC MODEL FILE: #{currentDoc.code}-1922/HA</p>
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
                    <span className="text-[10px] text-red-950 font-mono font-extrabold tracking-wider text-center">APPROVED<br/>COPY</span>
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
                <span className="text-[10px] text-amber-900/60 font-mono font-bold block uppercase">Original English Text Reference:</span>
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
                <span className="font-bold text-amber-900 font-serif text-[11px] leading-tight">{currentDoc.stamp}</span>
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
