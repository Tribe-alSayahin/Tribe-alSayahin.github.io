import { SUPPORTERS_DATA } from '../../layout/Supporters.data';
import { OFFICIAL_LOGO_IMAGE_URL } from '../../../lib/branding';

export type LetterMode = 'group' | 'individual' | 'heritage-request';
export type SourceMode = 'list' | 'manual';
type PersonalLetterKind = 'thanks' | 'heritage-request';

export const TODAY = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

export const GREGORIAN_TODAY = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br/>');
}
// ─── SVG helpers ──────────────────────────────────────────────────────────────

/** Corner ornament SVG path (reused in all four corners via CSS transform) */
const CORNER_PATH = `<path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>`;

// ─── Shared letter CSS ────────────────────────────────────────────────────────

const LETTER_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brass:         #c9a24b;
    --brass-lt:      #e8c96e;
    --ink:           #0a0805;
    --parchment:     #f5eed8;
    --parchment-dark:#e8dcc8;
    --gold-faint:    #6b5a30;
    --burgundy:      #8B1A1A;
  }

  @page { size: A4 portrait; margin: 0; }

  html, body {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    background: #e8e0d0;
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 1rem;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }

  img, svg {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .letter {
    background: linear-gradient(160deg, #ffffff 0%, #f7f1e6 100%);
    width: 210mm;
    height: 297mm;
    min-height: 297mm;
    position: relative;
    padding: 0 0 28px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.35);
    overflow: hidden;
  }

  /* Arabesque background — 8-pointed star tile at low opacity */
  .arabesque-bg {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cdefs%3E%3Cpattern id='ar' x='0' y='0' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M30,6 L33,18 L44,14 L40,25 L52,28 L40,31 L44,42 L33,38 L30,50 L27,38 L16,42 L20,31 L8,28 L20,25 L16,14 L27,18 Z' fill='%23c9a24b' opacity='0.07'/%3E%3Ccircle cx='30' cy='28' r='3' fill='%23c9a24b' opacity='0.04'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='60' height='60' fill='url(%23ar)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    pointer-events: none;
    z-index: 0;
  }

  /* Sadou strip containers */
  .sadou-top  { position: relative; z-index: 2; width: 100%; height: 28px; line-height: 0; font-size: 0; }
  .sadou-bottom { position: absolute; bottom: 0; left: 0; z-index: 2; width: 100%; height: 28px; line-height: 0; font-size: 0; }

  /* Inner content area */
  .letter-inner { position: relative; z-index: 1; padding: 6mm 22mm 8mm; }

  /* Ornamental border frames */
  .letter-border       { position: absolute; inset: 28px 6mm 34px; border: 2px solid var(--brass); border-radius: 2mm; pointer-events: none; z-index: 2; }
  .letter-border-inner { position: absolute; inset: 28px 9mm 34px; border: 0.5px solid var(--brass-lt); border-radius: 1mm; pointer-events: none; z-index: 2; }

  /* Corner ornaments */
  .corner    { position: absolute; width: 28px; height: 28px; fill: var(--brass); z-index: 3; }
  .corner-tl { top: 36px; right: 12mm; }
  .corner-tr { top: 36px; left:  12mm; transform: scaleX(-1); }
  .corner-bl { bottom: 36px; right: 12mm; transform: scaleY(-1); }
  .corner-br { bottom: 36px; left:  12mm; transform: scale(-1,-1); }

  /* "Water of gold" gradient text */
  .gold-text {
    background: linear-gradient(135deg, #d9b64e 0%, #b8862b 30%, #caa03a 65%, #7a5a15 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  /* Header */
  .header { text-align: center; margin-bottom: 6mm; padding-top: 4mm; }
  .logo-wrap { display: flex; justify-content: center; align-items: center; margin-bottom: 3mm; }
  .official-seal {
    width: 24mm;
    height: 24mm;
    object-fit: contain;
    border-radius: 50%;
  }
  .tribe-name {
    font-family: 'Aref Ruqaa', serif;
    font-size: 26pt;
    line-height: 1.2;
    letter-spacing: 0.02em;
    background: linear-gradient(135deg, #d9b64e, #b8862b, #caa03a, #7a5a15);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
  .tribe-sub {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 9pt;
    color: var(--gold-faint);
    letter-spacing: 0.12em;
    margin-top: 2mm;
  }

  /* Divider */
  .divider { display: flex; align-items: center; gap: 6px; margin: 5mm 0; }
  .divider-line { flex: 1; height: 1px; background: linear-gradient(to left, transparent, var(--brass), transparent); }
  .divider-diamond { width: 8px; height: 8px; background: var(--brass); transform: rotate(45deg); flex-shrink: 0; }

  /* Reference number */
  .ref-number {
    text-align: left;
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 8pt;
    color: var(--gold-faint);
    margin-bottom: 2mm;
    letter-spacing: 0.05em;
  }

  /* Date block */
  .dates {
    text-align: left;
    margin-bottom: 6mm;
    font-size: 9pt;
    color: var(--gold-faint);
    font-family: 'Amiri', serif;
    line-height: 1.9;
  }

  /* Letter title with gold gradient */
  .letter-title {
    font-family: 'Aref Ruqaa', serif;
    font-size: 20pt;
    text-align: center;
    margin-bottom: 5mm;
    background: linear-gradient(135deg, #d9b64e, #b8862b, #caa03a, #7a5a15);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }

  /* Body text */
  .body-text {
    font-family: 'Amiri', serif;
    font-size: 12pt;
    line-height: 2.1;
    color: #1a1408;
    text-align: justify;
    margin-bottom: 5mm;
  }

  .compact-letter .header { margin-bottom: 3mm; padding-top: 2mm; }
  .compact-letter .divider { margin: 3mm 0; }
  .compact-letter .dates { margin-bottom: 3mm; line-height: 1.6; }
  .compact-letter .letter-title { font-size: 17pt; margin-bottom: 3mm; }
  .compact-letter .recipient-box { padding: 3mm 6mm; margin-bottom: 4mm; }
  .compact-letter .body-text { font-size: 11pt; line-height: 1.75; margin-bottom: 3mm; }
  .compact-letter .signature { margin-top: 4mm; }
  .compact-letter .footer-wm { margin-top: 3mm; }

  /* Supporters table */
  .supporters-section { margin: 6mm 0; }
  .supporters-title {
    font-family: 'Aref Ruqaa', serif;
    font-size: 14pt;
    color: var(--brass);
    margin-bottom: 3mm;
    text-align: center;
    border-bottom: 1px solid var(--brass-lt);
    padding-bottom: 2mm;
  }
  table { width: 100%; border-collapse: collapse; font-family: 'Amiri', serif; font-size: 11pt; }
  thead tr  { background: var(--brass); color: #fff; }
  thead th  { padding: 3mm 4mm; text-align: right; font-weight: 700; font-size: 10pt; }
  tbody tr:nth-child(odd)  { background: var(--parchment-dark); }
  tbody tr:nth-child(even) { background: var(--parchment); }
  tbody td  { padding: 2.5mm 4mm; vertical-align: middle; }
  td.idx    { width: 10mm; text-align: center; color: var(--gold-faint); font-size: 9pt; }
  td.name   { font-weight: 700; color: #12100d; }
  td.role   { font-size: 9.5pt; color: #4a3c28; }

  /* Recipient highlight box */
  .recipient-box {
    border: 1.5px solid var(--brass);
    border-radius: 3mm;
    background: var(--parchment-dark);
    padding: 5mm 7mm;
    margin-bottom: 6mm;
    display: flex;
    align-items: center;
    gap: 4mm;
  }
  .recipient-label { font-family: 'IBM Plex Sans Arabic', sans-serif; font-size: 8.5pt; color: var(--gold-faint); margin-bottom: 1.5mm; }
  .recipient-name {
    font-family: 'Aref Ruqaa', serif;
    font-size: 17pt;
    line-height: 1.3;
    background: linear-gradient(135deg, #d9b64e, #b8862b, #caa03a, #7a5a15);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
  .recipient-role { font-family: 'Amiri', serif; font-size: 10.5pt; color: #4a3c28; margin-top: 1mm; }
  .recipient-icon { font-size: 22pt; color: var(--brass); opacity: 0.55; margin-left: 3mm; flex-shrink: 0; }

  /* Closing & signature */
  .closing { margin-top: 7mm; font-family: 'Amiri', serif; font-size: 12pt; line-height: 2; color: #1a1408; }
  .signature { margin-top: 8mm; display: flex; justify-content: center; align-items: flex-end; }
  .sig-block { text-align: center; }
  .sig-label { font-family: 'IBM Plex Sans Arabic', sans-serif; font-size: 9pt; color: var(--gold-faint); }
  .sig-name  { font-family: 'Aref Ruqaa', serif; font-size: 13pt; color: var(--brass); margin-top: 1mm; }
  .sig-line  { width: 55mm; height: 1px; background: var(--brass); margin: 10mm auto 2mm; }

  /* Footer watermark */
  .footer-wm {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 7pt;
    color: var(--brass-lt);
    opacity: 0.55;
    text-align: center;
    margin-top: 6mm;
    letter-spacing: 0.15em;
  }

  @media print {
    html, body {
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      background: none;
      padding: 0;
      display: block;
      overflow: hidden;
    }
    .letter {
      width: 210mm;
      height: 297mm;
      min-height: 297mm;
      box-shadow: none;
      overflow: hidden;
      break-after: page;
      page-break-after: always;
    }
    .letter-inner { padding: 6mm 22mm 8mm; }
    .official-seal { width: 24mm; height: 24mm; }
    .no-print { display: none !important; }
  }
`;

/** Shared HTML head — fonts + styles */
function letterHead(title: string): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans+Arabic:wght@300;400;600&family=Reem+Kufi:wght@400;600&display=swap" rel="stylesheet"/>
<style>${LETTER_CSS}</style>
</head>
<body>`;
}

/** Sadou geometric strip SVG (diamonds + burgundy triangles on dark ground) */
const SADOU_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="28" preserveAspectRatio="xMinYMid slice">
      <rect width="100%" height="28" fill="#0a0805"/>
      <defs>
        <pattern id="sadou" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <polygon points="14,4 22,14 14,24 6,14" fill="#c9a24b" opacity="0.9"/>
          <polygon points="14,9 18,14 14,19 10,14" fill="#0a0805"/>
          <polygon points="0,0 6,0 0,8"   fill="#8B1A1A" opacity="0.85"/>
          <polygon points="28,0 22,0 28,8" fill="#8B1A1A" opacity="0.85"/>
          <polygon points="0,28 6,28 0,20"   fill="#8B1A1A" opacity="0.85"/>
          <polygon points="28,28 22,28 28,20" fill="#8B1A1A" opacity="0.85"/>
        </pattern>
      </defs>
      <rect width="100%" height="28" fill="url(#sadou)"/>
      <line x1="0" y1="0.5"  x2="100%" y2="0.5"  stroke="#c9a24b" stroke-width="1"   opacity="0.5"/>
      <line x1="0" y1="27.5" x2="100%" y2="27.5" stroke="#c9a24b" stroke-width="0.5" opacity="0.35"/>
    </svg>`;

/** Shared structural elements: arabesque bg, sadou strips, border frames, corner ornaments */
function structuralElements(): string {
  return `
  <div class="arabesque-bg"></div>
  <div class="sadou-top">${SADOU_SVG}</div>
  <div class="sadou-bottom">${SADOU_SVG}</div>
  <div class="letter-border"></div>
  <div class="letter-border-inner"></div>
  <svg class="corner corner-tl" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">${CORNER_PATH}</svg>
  <svg class="corner corner-tr" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">${CORNER_PATH}</svg>
  <svg class="corner corner-bl" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">${CORNER_PATH}</svg>
  <svg class="corner corner-br" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">${CORNER_PATH}</svg>`;
}

/** Shared header block: official tribal seal + tribe name */
function letterHeader(): string {
  return `<div class="header">
    <div class="logo-wrap">
      <img class="official-seal" src="${OFFICIAL_LOGO_IMAGE_URL}" alt="ختم قبيلة السياحين"/>
    </div>
    <div class="tribe-name">الموقع الرسمي لقبيلة السياحين</div>
    <div class="tribe-sub">توثيق الإرث والموروث التاريخي</div>
  </div>`;
}

/** Shared divider element */
const DIVIDER_HTML = `<div class="divider">
    <div class="divider-line"></div>
    <div class="divider-diamond"></div>
    <div class="divider-diamond" style="width:5px;height:5px;"></div>
    <div class="divider-diamond"></div>
    <div class="divider-line"></div>
  </div>`;

// ─── Default text values ──────────────────────────────────────────────────────

export const DEFAULT_GROUP_PARAGRAPHS = [
  'بسم الله الرحمن الرحيم، والصلاة والسلام على أشرف الأنبياء والمرسلين، أما بعد:\n\nيسعدنا في الموقع الرسمي لقبيلة السياحين أن نتقدم بأسمى آيات الشكر والتقدير والعرفان لكل من أسهم بسخاء في دعم مسيرة توثيق إرث وتاريخ قبيلة السياحين الكريمة. إن هذا الجهد المبارك ما كان ليرى النور لولا تفضّل هؤلاء الكرام وإيمانهم بأهمية صون الموروث الحضاري.',
  'وإننا إذ نُقدّم هذا الخطاب إقراراً بفضلهم ووفاءً بحقهم، لنسأل الله العلي القدير أن يجزيهم خير الجزاء، وأن يبارك في أعمالهم وأهليهم وذرياتهم، وأن يجعل هذا العمل صدقةً جاريةً في موازين حسناتهم. والله ولي التوفيق.',
];

export const defaultIndividualParagraphs = (name: string) => [
  `بسم الله الرحمن الرحيم، والصلاة والسلام على أشرف الأنبياء والمرسلين، أما بعد:\n\nيتقدم الموقع الرسمي لقبيلة السياحين بأسمى آيات الشكر والتقدير والعرفان إلى المكرَّم / ${name}، الذي أسهم بسخاء وكرم في دعم مسيرة توثيق إرث وتاريخ قبيلة السياحين الكريمة. إن هذا الجهد المبارك ما كان ليرى النور لولا تفضّله وإيمانه بأهمية صون الموروث الحضاري.`,
  'وإننا إذ نُقدّم هذا الخطاب الخاص وفاءً بحقه وإقراراً بفضله، لنسأل الله العلي القدير أن يجزيه خير الجزاء، وأن يبارك في عمله وأهله وذريته، وأن يجعل هذا العمل صدقةً جاريةً في موازين حسناته. والله ولي التوفيق.',
];

export const HERITAGE_REQUEST_PARAGRAPHS = [
  'بسم الله الرحمن الرحيم، والصلاة والسلام على أشرف الأنبياء والمرسلين، أما بعد:\n\nيسر الموقع الرسمي لقبيلة السياحين أن يتوجه إلى مقامكم الكريم بهذه الدعوة؛ تقديراً لما عُرف عنكم من عناية بتاريخ القبيلة وموروثها، وإيماناً بأن ما لدى أهل المعرفة والرواية من محفوظات وشواهد يمثل أمانة ثمينة تستحق الجمع والصون للأجيال القادمة.',
  'نأمل منكم التكرم بمشاركتنا ما يتوفر لديكم من قصص موثقة، أو قصائد نبطية، أو روايات تاريخية، أو وثائق وصور ومعلومات تتصل برجالات القبيلة وديارها ومواقفها. ونخص بهذه الدعوة أعيان القبيلة ورواتها، كما نرحب بإسهامات الباحثين والمؤرخين عامة، مع بيان المصدر واسم الراوي والتاريخ كلما أمكن؛ حفظاً للأمانة العلمية وحقوق أصحاب المادة.',
  'ويمكنكم إرسال المادة والتواصل مع إدارة التوثيق من خلال قسم «تواصل معنا» في الموقع الرسمي: alsaihani.com/news/#contact. وستُراجع المشاركات بعناية قبل اعتمادها أو نشرها، مع حفظ نسبة المادة إلى صاحبها ومصدرها. شاكرين لكم تعاونكم، ومقدرين إسهامكم في خدمة تاريخ قبيلة السياحين وموروثها، والله ولي التوفيق.',
];

// ─── Letter HTML builders ─────────────────────────────────────────────────────

export function buildLetterHtml(opts: {
  hijriDate: string;
  gregorianDate: string;
  bodyParagraphs: string[];
  signatureName: string;
  referenceNumber?: string;
}): string {
  const supporterRows = SUPPORTERS_DATA.map(
    (s, i) =>
      `<tr>
        <td class="idx">${i + 1}</td>
        <td class="name">${esc(s.name)}</td>
        <td class="role">${esc(s.role)}</td>
      </tr>`,
  ).join('');

  // First paragraph = opening, last = closing, rest go before the table
  const opening = opts.bodyParagraphs[0] ?? '';
  const closing = opts.bodyParagraphs[opts.bodyParagraphs.length - 1] ?? '';
  const middle = opts.bodyParagraphs.length > 2 ? opts.bodyParagraphs.slice(1, -1) : [];

  return `${letterHead('خطاب شكر وتقدير — قبيلة السياحين')}
<div class="letter">
  ${structuralElements()}

  <div class="letter-inner">
    ${letterHeader()}
    ${DIVIDER_HTML}

    ${opts.referenceNumber ? `<div class="ref-number">رقم الإشارة: ${esc(opts.referenceNumber)}</div>` : ''}

    <div class="dates">
      <div>التاريخ الهجري: ${esc(opts.hijriDate)}</div>
      <div>التاريخ الميلادي: ${esc(opts.gregorianDate)}</div>
    </div>

    <div class="letter-title">خطاب شكر وعرفان</div>

    <p class="body-text">${esc(opening)}</p>
    ${middle.map((p) => `<p class="body-text">${esc(p)}</p>`).join('\n    ')}

    <div class="supporters-section">
      <div class="supporters-title">قائمة الداعمين الكرام المُكرَّمين</div>
      <table>
        <thead>
          <tr>
            <th style="width:10mm">#</th>
            <th>الاسم الكريم</th>
            <th>المساهمة</th>
          </tr>
        </thead>
        <tbody>${supporterRows}</tbody>
      </table>
    </div>

    <div class="closing"><p>${esc(closing)}</p></div>

    <div class="signature">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-label">إدارة الموقع الرسمي</div>
        <div class="sig-name">${esc(opts.signatureName)}</div>
      </div>
    </div>

    <div class="footer-wm">الموقع الرسمي لقبيلة السياحين — alsaihani.com</div>
  </div>
</div>
</body></html>`;
}

export function buildIndividualLetterHtml(opts: {
  hijriDate: string;
  gregorianDate: string;
  recipientName: string;
  recipientRole: string;
  bodyParagraphs: string[];
  signatureName: string;
  referenceNumber?: string;
  letterKind?: PersonalLetterKind;
}): string {
  const isHeritageRequest = opts.letterKind === 'heritage-request';
  const documentTitle = isHeritageRequest
    ? `دعوة لتوثيق الموروث — ${esc(opts.recipientName)}`
    : `خطاب شكر خاص — ${esc(opts.recipientName)}`;
  const letterTitle = isHeritageRequest
    ? 'دعوة للمساهمة في توثيق الموروث'
    : 'خطاب شكر وعرفان خاص';

  return `${letterHead(documentTitle)}
<div class="letter${isHeritageRequest ? ' compact-letter' : ''}">
  ${structuralElements()}

  <div class="letter-inner">
    ${letterHeader()}
    ${DIVIDER_HTML}

    ${opts.referenceNumber ? `<div class="ref-number">رقم الإشارة: ${esc(opts.referenceNumber)}</div>` : ''}

    <div class="dates">
      <div>التاريخ الهجري: ${esc(opts.hijriDate)}</div>
      <div>التاريخ الميلادي: ${esc(opts.gregorianDate)}</div>
    </div>

    <div class="letter-title">${letterTitle}</div>

    <div class="recipient-box">
      <div style="flex:1;">
        <div class="recipient-label">المُكرَّم</div>
        <div class="recipient-name">${esc(opts.recipientName)}</div>
        <div class="recipient-role">${esc(opts.recipientRole)}</div>
      </div>
      <div class="recipient-icon">&#x2726;</div>
    </div>

    ${opts.bodyParagraphs.map((p) => `<p class="body-text">${esc(p)}</p>`).join('\n    ')}

    <div class="signature">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-label">إدارة الموقع الرسمي</div>
        <div class="sig-name">${esc(opts.signatureName)}</div>
      </div>
    </div>

    <div class="footer-wm">الموقع الرسمي لقبيلة السياحين — alsaihani.com</div>
  </div>
</div>
</body></html>`;
}

// ─── Component ────────────────────────────────────────────────────────────────
