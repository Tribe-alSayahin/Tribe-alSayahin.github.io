'use client';

import { useState } from 'react';
import { BookOpenText, Printer, RefreshCw, Users, User, Plus, Trash2 } from 'lucide-react';
import { SUPPORTERS_DATA } from '../layout/Supporters.data';
import { OFFICIAL_LOGO_IMAGE_URL } from '../../lib/branding';
import {
  DEFAULT_GROUP_PARAGRAPHS,
  GREGORIAN_TODAY,
  HERITAGE_REQUEST_PARAGRAPHS,
  TODAY,
  buildIndividualLetterHtml,
  buildLetterHtml,
  defaultIndividualParagraphs,
  type LetterMode,
  type SourceMode,
} from './ThanksLetterGeneratorParts/letter-template';

export { HERITAGE_REQUEST_PARAGRAPHS } from './ThanksLetterGeneratorParts/letter-template';

export function ThanksLetterGenerator() {
  const [mode, setMode] = useState<LetterMode>('group');
  const [sourceMode, setSourceMode] = useState<SourceMode>('list');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [freeFormName, setFreeFormName] = useState('');
  const [freeFormRole, setFreeFormRole] = useState('');

  const [hijriDate, setHijriDate] = useState(TODAY);
  const [gregorianDate, setGregorianDate] = useState(GREGORIAN_TODAY);
  const [bodyParagraphs, setBodyParagraphs] = useState<string[]>(DEFAULT_GROUP_PARAGRAPHS);
  const [signatureName, setSignatureName] = useState('حسين بن علي بن بعاج ابن مسيلم');
  const [referenceNumber, setReferenceNumber] = useState('');

  const selectedSupporter = SUPPORTERS_DATA[selectedIdx] ?? SUPPORTERS_DATA[0];

  const getRecipientName = () =>
    mode === 'individual'
      ? (sourceMode === 'list' ? selectedSupporter.name : freeFormName)
      : mode === 'heritage-request'
        ? freeFormName
        : '';

  const getRecipientRole = () =>
    mode === 'individual'
      ? (sourceMode === 'list' ? selectedSupporter.role : freeFormRole)
      : mode === 'heritage-request'
        ? freeFormRole
        : '';

  const handleModeChange = (newMode: LetterMode) => {
    setMode(newMode);
    if (newMode === 'individual') {
      const name = sourceMode === 'list' ? (SUPPORTERS_DATA[selectedIdx]?.name ?? '') : freeFormName;
      setBodyParagraphs(defaultIndividualParagraphs(name));
    } else if (newMode === 'heritage-request') {
      setSourceMode('manual');
      setBodyParagraphs(HERITAGE_REQUEST_PARAGRAPHS);
    } else {
      setBodyParagraphs(DEFAULT_GROUP_PARAGRAPHS);
    }
  };

  const handleSelectSupporter = (idx: number) => {
    setSelectedIdx(idx);
    if (mode === 'individual' && sourceMode === 'list') {
      setBodyParagraphs(defaultIndividualParagraphs(SUPPORTERS_DATA[idx]?.name ?? ''));
    }
  };

  const handleSourceModeChange = (sm: SourceMode) => {
    setSourceMode(sm);
    if (mode === 'individual') {
      const name = sm === 'list' ? (SUPPORTERS_DATA[selectedIdx]?.name ?? '') : freeFormName;
      setBodyParagraphs(defaultIndividualParagraphs(name));
    }
  };

  const updateParagraph = (idx: number, value: string) => {
    setBodyParagraphs((prev) => prev.map((p, i) => (i === idx ? value : p)));
  };

  const addParagraph = () => setBodyParagraphs((prev) => [...prev, '']);

  const removeParagraph = (idx: number) =>
    setBodyParagraphs((prev) => prev.filter((_, i) => i !== idx));

  const handlePrint = async () => {
    const html =
      mode !== 'group'
        ? buildIndividualLetterHtml({
            hijriDate,
            gregorianDate,
            recipientName: getRecipientName(),
            recipientRole: getRecipientRole(),
            bodyParagraphs,
            signatureName,
            referenceNumber: referenceNumber || undefined,
            letterKind: mode === 'heritage-request' ? 'heritage-request' : 'thanks',
          })
        : buildLetterHtml({
            hijriDate,
            gregorianDate,
            bodyParagraphs,
            signatureName,
            referenceNumber: referenceNumber || undefined,
          });
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) return;
    win.document.write(html);
    win.document.close();

    const fontsReady = win.document.fonts?.ready ?? Promise.resolve();
    const imagesReady = Promise.all(
      Array.from(win.document.images, (image) => image.decode().catch(() => undefined)),
    );
    await Promise.race([
      Promise.all([fontsReady, imagesReady]),
      new Promise<void>((resolve) => window.setTimeout(resolve, 4000)),
    ]);

    win.focus();
    win.print();
  };

  const handleReset = () => {
    setHijriDate(TODAY);
    setGregorianDate(GREGORIAN_TODAY);
    setReferenceNumber('');
    if (mode === 'individual') {
      const name = sourceMode === 'list' ? selectedSupporter.name : freeFormName;
      setBodyParagraphs(defaultIndividualParagraphs(name));
    } else if (mode === 'heritage-request') {
      setBodyParagraphs(HERITAGE_REQUEST_PARAGRAPHS);
    } else {
      setBodyParagraphs(DEFAULT_GROUP_PARAGRAPHS);
    }
    setSignatureName('حسين بن علي بن بعاج ابن مسيلم');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-6">
        <h2 className="font-ruqaa text-3xl text-brass-lt mb-1">منشئ الخطابات الرسمية</h2>
        <p className="text-sm text-sand-dim">
          أنشئ خطابات الشكر أو دعوات توثيق الموروث، ثم خصص النص واطبعه أو احفظه PDF.
        </p>
      </div>

      {/* Mode selector */}
      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        <h3 className="font-kufi text-sm text-sand-dim mb-3">نوع الخطاب</h3>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleModeChange('group')}
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 font-kufi text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
              mode === 'group'
                ? 'bg-brass/25 border-brass/60 text-brass-lt'
                : 'border-brass/20 text-sand-dim hover:bg-brass/10 hover:text-sand'
            }`}
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            خطاب جماعي (كل الداعمين)
          </button>
          <button
            onClick={() => handleModeChange('individual')}
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 font-kufi text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
              mode === 'individual'
                ? 'bg-brass/25 border-brass/60 text-brass-lt'
                : 'border-brass/20 text-sand-dim hover:bg-brass/10 hover:text-sand'
            }`}
          >
            <User className="w-4 h-4" aria-hidden="true" />
            شكر فردي خاص
          </button>
          <button
            onClick={() => handleModeChange('heritage-request')}
            className={`flex items-center gap-2 rounded-xl border px-5 py-3 font-kufi text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
              mode === 'heritage-request'
                ? 'bg-brass/25 border-brass/60 text-brass-lt'
                : 'border-brass/20 text-sand-dim hover:bg-brass/10 hover:text-sand'
            }`}
          >
            <BookOpenText className="w-4 h-4" aria-hidden="true" />
            دعوة لتوثيق الموروث
          </button>
        </div>

        {/* Individual mode: source toggle + name/role */}
        {mode === 'individual' && (
          <div className="mt-5 space-y-4">
            <div className="flex gap-5">
              <label className="flex items-center gap-2 font-kufi text-sm text-sand cursor-pointer">
                <input
                  type="radio"
                  checked={sourceMode === 'list'}
                  onChange={() => handleSourceModeChange('list')}
                  className="accent-brass"
                />
                من قائمة الداعمين
              </label>
              <label className="flex items-center gap-2 font-kufi text-sm text-sand cursor-pointer">
                <input
                  type="radio"
                  checked={sourceMode === 'manual'}
                  onChange={() => handleSourceModeChange('manual')}
                  className="accent-brass"
                />
                إدخال يدوي
              </label>
            </div>

            {sourceMode === 'list' ? (
              <>
                <div className="space-y-2">
                  <label className="font-kufi text-xs text-sand-dim">اختر الاسم المُكرَّم</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {SUPPORTERS_DATA.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectSupporter(i)}
                        className={`flex flex-col items-start gap-0.5 rounded-lg border px-4 py-2.5 text-right transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
                          selectedIdx === i
                            ? 'bg-brass/20 border-brass/55 text-sand'
                            : 'border-brass/15 text-sand-dim hover:bg-brass/8 hover:text-sand'
                        }`}
                      >
                        <span className="font-kufi text-sm leading-snug">{s.name}</span>
                        <span className="font-sans text-[11px] text-sand-dim/70 leading-tight">{s.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-brass/30 bg-brass/8 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-brass/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-brass-lt" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-kufi text-sm text-brass-lt leading-snug">{selectedSupporter.name}</p>
                    <p className="font-sans text-xs text-sand-dim">{selectedSupporter.role}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-kufi text-xs text-sand-dim">اسم المُكرَّم</label>
                  <input
                    value={freeFormName}
                    onChange={(e) => setFreeFormName(e.target.value)}
                    placeholder="مثال: خالد بن عيد بن بعاج ابن مسيلم"
                    className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm focus:outline-none focus:border-brass/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-kufi text-xs text-sand-dim">صفة المُكرَّم</label>
                  <input
                    value={freeFormRole}
                    onChange={(e) => setFreeFormRole(e.target.value)}
                    placeholder="مثال: داعم توثيق الإرث والموروث التاريخي"
                    className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm focus:outline-none focus:border-brass/50"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'heritage-request' && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="heritage-recipient-name" className="font-kufi text-xs text-sand-dim">
                اسم الموجّه إليه
              </label>
              <input
                id="heritage-recipient-name"
                value={freeFormName}
                onChange={(e) => setFreeFormName(e.target.value)}
                placeholder="مثال: الشيخ فلان بن فلان"
                className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sm text-sand focus:border-brass/50 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="heritage-recipient-role" className="font-kufi text-xs text-sand-dim">
                صفته أو مجال معرفته
              </label>
              <input
                id="heritage-recipient-role"
                value={freeFormRole}
                onChange={(e) => setFreeFormRole(e.target.value)}
                placeholder="مثال: من أعيان القبيلة، أو باحث ومؤرخ"
                className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sm text-sand focus:border-brass/50 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Settings panel */}
        <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-6 space-y-5">
          <h3 className="font-kufi text-lg text-brass-lt border-b border-brass/10 pb-3">إعدادات الخطاب</h3>

          <div className="space-y-1">
            <label className="font-kufi text-xs text-sand-dim">رقم الإشارة (اختياري)</label>
            <input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="مثال: ش-2025-001"
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm focus:outline-none focus:border-brass/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-kufi text-xs text-sand-dim">التاريخ الهجري</label>
            <input
              value={hijriDate}
              onChange={(e) => setHijriDate(e.target.value)}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm focus:outline-none focus:border-brass/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-kufi text-xs text-sand-dim">التاريخ الميلادي</label>
            <input
              value={gregorianDate}
              onChange={(e) => setGregorianDate(e.target.value)}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm focus:outline-none focus:border-brass/50"
            />
          </div>

          {/* Body paragraphs (editable array) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-kufi text-xs text-sand-dim">
                {mode === 'group' ? 'فقرات الخطاب (الأولى افتتاح، الأخيرة ختام)' : 'فقرات الخطاب'}
              </label>
              <button
                onClick={addParagraph}
                className="flex items-center gap-1 text-xs text-brass-lt hover:text-sand transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
              >
                <Plus className="w-3 h-3" />
                إضافة فقرة
              </button>
            </div>
            {bodyParagraphs.map((p, i) => (
              <div key={i} className="relative">
                <textarea
                  rows={i === 0 ? 6 : 4}
                  value={p}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm leading-relaxed resize-y focus:outline-none focus:border-brass/50"
                />
                {bodyParagraphs.length > 1 && (
                  <button
                    onClick={() => removeParagraph(i)}
                    className="absolute top-2 left-2 text-sand-dim/50 hover:text-red-400 transition-colors focus-visible:outline-none"
                    aria-label="حذف الفقرة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <label className="font-kufi text-xs text-sand-dim">اسم الموقّع</label>
            <input
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm focus:outline-none focus:border-brass/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { void handlePrint(); }}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brass/20 border border-brass/35 px-4 py-3 font-kufi text-sm text-brass-lt hover:bg-brass/30 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              طباعة / حفظ PDF
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-brass/20 px-4 py-3 font-kufi text-sm text-sand-dim hover:text-sand hover:bg-brass/5 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
              aria-label="إعادة الضبط"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* Live preview */}
        <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-6 space-y-4">
          <h3 className="font-kufi text-lg text-brass-lt border-b border-brass/10 pb-3">معاينة الخطاب</h3>

          <div
            dir="rtl"
            className="relative rounded-xl overflow-hidden shadow-lg"
            style={{ fontFamily: 'Amiri, serif', background: 'linear-gradient(160deg,#ffffff 0%,#f7f1e6 100%)' }}
          >
            {/* Sadou top strip preview */}
            <div
              className="h-5 w-full"
              style={{ background: '#0a0805', backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 8px,#c9a24b22 8px,#c9a24b22 10px)' }}
            />

            {/* Inner letter area */}
            <div
              className="relative px-8 pb-6 pt-4"
              style={{ border: '2px solid #c9a24b', borderTop: 'none', borderBottom: 'none' }}
            >
              {/* Arabesque background hint */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cdefs%3E%3Cpattern id='ar' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M30,6 L33,18 L44,14 L40,25 L52,28 L40,31 L44,42 L33,38 L30,50 L27,38 L16,42 L20,31 L8,28 L20,25 L16,14 L27,18 Z' fill='%23c9a24b' opacity='0.07'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23ar)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', opacity: 0.5 }}
              />
              {/* Inner double border */}
              <div className="absolute inset-y-0 inset-x-2 border-x border-[#c9a24b]/30 pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-4">
                  <img src={OFFICIAL_LOGO_IMAGE_URL} alt="الشعار" className="w-12 h-12 mx-auto mb-2 object-cover rounded-full border border-[#c9a24b]" />
                  <p className="text-xl font-bold" style={{ fontFamily: 'Aref Ruqaa, serif', color: '#c9a24b' }}>
                    الموقع الرسمي لقبيلة السياحين
                  </p>
                  <p className="text-[9px] tracking-widest mt-1" style={{ color: '#6b5a30', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                    توثيق الإرث والموروث التاريخي
                  </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left,transparent,#c9a24b,transparent)' }} />
                  <div className="w-2 h-2 rotate-45" style={{ background: '#c9a24b' }} />
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right,transparent,#c9a24b,transparent)' }} />
                </div>

                {/* Ref + Dates */}
                <div className="text-right text-[9px] mb-3 leading-6" style={{ color: '#6b5a30', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                  {referenceNumber && <div>رقم الإشارة: {referenceNumber}</div>}
                  <div>التاريخ الهجري: {hijriDate}</div>
                  <div>التاريخ الميلادي: {gregorianDate}</div>
                </div>

                {/* Title */}
                <p className="text-center text-lg font-bold mb-3" style={{ fontFamily: 'Aref Ruqaa, serif', color: '#c9a24b' }}>
                  {mode === 'heritage-request'
                    ? 'دعوة للمساهمة في توثيق الموروث'
                    : mode === 'individual'
                      ? 'خطاب شكر وعرفان خاص'
                      : 'خطاب شكر وعرفان'}
                </p>

                {/* Recipient box — personal letters only */}
                {mode !== 'group' && (
                  <div className="flex items-center gap-3 rounded-lg px-4 py-3 mb-3" style={{ border: '1px solid #c9a24b', background: '#e8dcc8' }}>
                    <div className="flex-1">
                      <p className="text-[8px] mb-1" style={{ color: '#6b5a30', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>المُكرَّم</p>
                      <p className="text-[14px] font-bold" style={{ fontFamily: 'Aref Ruqaa, serif', color: '#c9a24b' }}>
                        {getRecipientName() || '\u2014'}
                      </p>
                      <p className="text-[9px] mt-0.5" style={{ color: '#4a3c28' }}>{getRecipientRole() || '\u2014'}</p>
                    </div>
                    <span style={{ color: '#c9a24b', opacity: 0.55, fontSize: 18 }}>&#x2726;</span>
                  </div>
                )}

                {/* Body paragraphs */}
                {bodyParagraphs.map((p, i) => (
                  <p key={i} className="text-[10px] leading-7 mb-3 whitespace-pre-line text-justify" style={{ color: '#1a1408' }}>
                    {p}
                  </p>
                ))}

                {/* Supporters table — group mode only */}
                {mode === 'group' && (
                  <>
                    <p
                      className="text-center text-[11px] font-bold mb-2 pb-1"
                      style={{ fontFamily: 'Aref Ruqaa, serif', color: '#c9a24b', borderBottom: '1px solid #c9a24b44' }}
                    >
                      قائمة الداعمين الكرام المُكرَّمين
                    </p>
                    <table className="w-full text-[9px] border-collapse mb-3">
                      <thead>
                        <tr style={{ background: '#c9a24b', color: '#fff' }}>
                          <th className="py-1 px-2 text-right w-8">#</th>
                          <th className="py-1 px-2 text-right">الاسم</th>
                          <th className="py-1 px-2 text-right">المساهمة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SUPPORTERS_DATA.map((s, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? '#e8dcc8' : '#f5eed8' }}>
                            <td className="py-1 px-2 text-center" style={{ color: '#6b5a30' }}>{i + 1}</td>
                            <td className="py-1 px-2 font-bold">{s.name}</td>
                            <td className="py-1 px-2" style={{ color: '#4a3c28' }}>{s.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {/* Signature */}
                <div className="flex justify-center items-end mt-4">
                  <div className="text-center">
                    <div className="w-28 h-px mb-1" style={{ background: '#c9a24b' }} />
                    <p className="text-[8px]" style={{ color: '#6b5a30', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                      إدارة الموقع الرسمي
                    </p>
                    <p className="text-[11px] font-bold" style={{ fontFamily: 'Aref Ruqaa, serif', color: '#c9a24b' }}>
                      {signatureName}
                    </p>
                  </div>
                </div>

                {/* Watermark */}
                <p className="text-center text-[7px] mt-3 tracking-wider" style={{ color: '#c9a24b', opacity: 0.5, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                  الموقع الرسمي لقبيلة السياحين &mdash; alsaihani.com
                </p>
              </div>
            </div>

            {/* Sadou bottom strip preview */}
            <div
              className="h-5 w-full"
              style={{ background: '#0a0805', backgroundImage: 'repeating-linear-gradient(90deg,transparent,transparent 8px,#c9a24b22 8px,#c9a24b22 10px)' }}
            />
          </div>

          <p className="text-xs text-sand-dim text-center">
            المعاينة تقريبية &mdash; الطباعة ستُنتج تخطيط A4 كامل بكامل التفاصيل البصرية
          </p>
        </section>
      </div>

      {/* Note */}
      <div className="rounded-xl border border-brass/15 bg-brass/5 p-4 text-sm text-sand-dim font-sans">
        <span className="text-brass-lt font-kufi font-bold">ملاحظة: </span>
        {mode === 'heritage-request'
          ? 'خطاب دعوة مخصص لأعيان القبيلة ورواتها والباحثين والمؤرخين؛ أدخل اسم الشخص وصفته، وراجع النص قبل الطباعة.'
          : mode === 'individual'
            ? 'في وضع الشكر الفردي يُولَّد خطاب مخصص — اختر الاسم من القائمة أو أدخله يدوياً ثم اطبع.'
            : (
            <>الخطاب الجماعي مرتبط تلقائياً بقائمة الداعمين ويحتوي حالياً على{' '}
              <span className="text-brass-lt font-bold">{SUPPORTERS_DATA.length}</span> داعم.
            </>
            )}
        {mode !== 'heritage-request' && (
          <> لتحديث الأسماء قم بتعديل ملف <code className="text-copper-lt text-xs">Supporters.data.ts</code>.</>
        )}
      </div>
    </div>
  );
}
