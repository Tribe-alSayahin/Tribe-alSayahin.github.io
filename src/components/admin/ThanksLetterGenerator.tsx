'use client';

import { useState } from 'react';
import { Printer, RefreshCw, Users, User } from 'lucide-react';
import { SUPPORTERS_DATA } from '../layout/Supporters.data';

type LetterMode = 'group' | 'individual';

const TODAY = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

const GREGORIAN_TODAY = new Intl.DateTimeFormat('ar', {
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

function buildLetterHtml(opts: {
  hijriDate: string;
  gregorianDate: string;
  openingLine: string;
  closingLine: string;
  signatureName: string;
}): string {
  const supporterRows = SUPPORTERS_DATA.map(
    (s, i) =>
      `<tr>
        <td class="idx">${i + 1}</td>
        <td class="name">${esc(s.name)}</td>
        <td class="role">${esc(s.role)}</td>
      </tr>`,
  ).join('');

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>خطاب شكر وتقدير — قبيلة السياحين</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans+Arabic:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brass:   #c9a24b;
    --brass-lt:#e8c96e;
    --ink:     #0a0805;
    --parchment: #f5eed8;
    --parchment-dark: #e8dcc8;
    --gold-faint: #6b5a30;
  }

  @page {
    size: A4 portrait;
    margin: 15mm 18mm;
  }

  body {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    background: #e8e0d0;
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 1rem;
  }

  .letter {
    background: var(--parchment);
    width: 210mm;
    min-height: 297mm;
    position: relative;
    padding: 20mm 22mm 18mm;
    box-shadow: 0 8px 40px rgba(0,0,0,0.35);
    overflow: hidden;
  }

  /* Outer ornamental border */
  .letter::before {
    content: '';
    position: absolute;
    inset: 6mm;
    border: 2px solid var(--brass);
    border-radius: 2mm;
    pointer-events: none;
  }
  .letter::after {
    content: '';
    position: absolute;
    inset: 9mm;
    border: 0.5px solid var(--brass-lt);
    border-radius: 1mm;
    pointer-events: none;
  }

  /* Corner ornaments */
  .corner {
    position: absolute;
    width: 28px;
    height: 28px;
    fill: var(--brass);
  }
  .corner-tl { top: 12mm; right: 12mm; }
  .corner-tr { top: 12mm; left:  12mm; transform: scaleX(-1); }
  .corner-bl { bottom: 12mm; right: 12mm; transform: scaleY(-1); }
  .corner-br { bottom: 12mm; left:  12mm; transform: scale(-1, -1); }

  /* Header */
  .header { text-align: center; margin-bottom: 8mm; }
  .logo-wrap { display: flex; justify-content: center; margin-bottom: 4mm; }
  .logo-wrap img { width: 72px; height: 72px; object-fit: contain; }

  .tribe-name {
    font-family: 'Aref Ruqaa', serif;
    font-size: 26pt;
    color: var(--brass);
    line-height: 1.2;
    letter-spacing: 0.02em;
  }
  .tribe-sub {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 9pt;
    color: var(--gold-faint);
    letter-spacing: 0.12em;
    margin-top: 2mm;
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 5mm 0;
  }
  .divider-line { flex: 1; height: 1px; background: linear-gradient(to left, transparent, var(--brass), transparent); }
  .divider-diamond {
    width: 8px; height: 8px;
    background: var(--brass);
    transform: rotate(45deg);
    flex-shrink: 0;
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

  /* Title */
  .letter-title {
    font-family: 'Aref Ruqaa', serif;
    font-size: 20pt;
    color: var(--brass);
    text-align: center;
    margin-bottom: 5mm;
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

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Amiri', serif;
    font-size: 11pt;
  }
  thead tr {
    background: var(--brass);
    color: #fff;
  }
  thead th {
    padding: 3mm 4mm;
    text-align: right;
    font-weight: 700;
    font-size: 10pt;
  }
  tbody tr:nth-child(odd)  { background: var(--parchment-dark); }
  tbody tr:nth-child(even) { background: var(--parchment); }
  tbody td { padding: 2.5mm 4mm; vertical-align: middle; }
  td.idx  { width: 10mm; text-align: center; color: var(--gold-faint); font-size: 9pt; }
  td.name { font-weight: 700; color: #12100d; }
  td.role { font-size: 9.5pt; color: #4a3c28; }

  /* Closing */
  .closing { margin-top: 7mm; font-family: 'Amiri', serif; font-size: 12pt; line-height: 2; color: #1a1408; }

  /* Signature */
  .signature {
    margin-top: 8mm;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .sig-block { text-align: center; }
  .sig-label { font-family: 'IBM Plex Sans Arabic', sans-serif; font-size: 9pt; color: var(--gold-faint); }
  .sig-name  { font-family: 'Aref Ruqaa', serif; font-size: 13pt; color: var(--brass); margin-top: 1mm; }
  .sig-line  { width: 55mm; height: 1px; background: var(--brass); margin: 10mm auto 2mm; }

  /* Footer watermark */
  .footer-wm {
    position: absolute;
    bottom: 14mm;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 7pt;
    color: var(--brass-lt);
    opacity: 0.55;
    white-space: nowrap;
    letter-spacing: 0.15em;
  }

  @media print {
    body { background: none; padding: 0; }
    .letter { box-shadow: none; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="letter">

  <!-- Corner ornaments SVG -->
  <svg class="corner corner-tl" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>
  <svg class="corner corner-tr" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>
  <svg class="corner corner-bl" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>
  <svg class="corner corner-br" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>

  <!-- Header -->
  <div class="header">
    <div class="logo-wrap">
      <img src="/logo.svg" alt="شعار قبيلة السياحين" />
    </div>
    <div class="tribe-name">الموقع الرسمي لقبيلة السياحين</div>
    <div class="tribe-sub">توثيق الإرث والموروث التاريخي</div>
  </div>

  <div class="divider">
    <div class="divider-line"></div>
    <div class="divider-diamond"></div>
    <div class="divider-diamond" style="width:5px;height:5px;"></div>
    <div class="divider-diamond"></div>
    <div class="divider-line"></div>
  </div>

  <!-- Dates -->
  <div class="dates">
    <div>التاريخ الهجري: ${esc(opts.hijriDate)}</div>
    <div>التاريخ الميلادي: ${esc(opts.gregorianDate)}</div>
  </div>

  <!-- Title -->
  <div class="letter-title">خطاب شكر وعرفان</div>

  <!-- Opening -->
  <p class="body-text">${esc(opts.openingLine)}</p>

  <!-- Supporters table -->
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
      <tbody>
        ${supporterRows}
      </tbody>
    </table>
  </div>

  <!-- Closing -->
  <div class="closing">
    <p>${esc(opts.closingLine)}</p>
  </div>

  <!-- Signature -->
  <div class="signature">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">إدارة الموقع الرسمي</div>
      <div class="sig-name">${esc(opts.signatureName)}</div>
    </div>
    <div class="sig-block" style="text-align:center;">
      <img src="/logo.svg" alt="" style="width:40px;height:40px;opacity:0.45;" />
    </div>
  </div>

  <div class="footer-wm">الموقع الرسمي لقبيلة السياحين — alsaihani.com</div>
</div>
</body>
</html>`;
}

function buildIndividualLetterHtml(opts: {
  hijriDate: string;
  gregorianDate: string;
  recipientName: string;
  recipientRole: string;
  openingLine: string;
  closingLine: string;
  signatureName: string;
}): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>خطاب شكر خاص — ${esc(opts.recipientName)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Sans+Arabic:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --brass:   #c9a24b;
    --brass-lt:#e8c96e;
    --ink:     #0a0805;
    --parchment: #f5eed8;
    --parchment-dark: #e8dcc8;
    --gold-faint: #6b5a30;
  }

  @page {
    size: A4 portrait;
    margin: 15mm 18mm;
  }

  body {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    background: #e8e0d0;
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 2rem 1rem;
  }

  .letter {
    background: var(--parchment);
    width: 210mm;
    min-height: 297mm;
    position: relative;
    padding: 20mm 22mm 18mm;
    box-shadow: 0 8px 40px rgba(0,0,0,0.35);
    overflow: hidden;
  }

  .letter::before {
    content: '';
    position: absolute;
    inset: 6mm;
    border: 2px solid var(--brass);
    border-radius: 2mm;
    pointer-events: none;
  }
  .letter::after {
    content: '';
    position: absolute;
    inset: 9mm;
    border: 0.5px solid var(--brass-lt);
    border-radius: 1mm;
    pointer-events: none;
  }

  .corner {
    position: absolute;
    width: 28px;
    height: 28px;
    fill: var(--brass);
  }
  .corner-tl { top: 12mm; right: 12mm; }
  .corner-tr { top: 12mm; left:  12mm; transform: scaleX(-1); }
  .corner-bl { bottom: 12mm; right: 12mm; transform: scaleY(-1); }
  .corner-br { bottom: 12mm; left:  12mm; transform: scale(-1, -1); }

  .header { text-align: center; margin-bottom: 8mm; }
  .logo-wrap { display: flex; justify-content: center; margin-bottom: 4mm; }
  .logo-wrap img { width: 72px; height: 72px; object-fit: contain; }

  .tribe-name {
    font-family: 'Aref Ruqaa', serif;
    font-size: 26pt;
    color: var(--brass);
    line-height: 1.2;
    letter-spacing: 0.02em;
  }
  .tribe-sub {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 9pt;
    color: var(--gold-faint);
    letter-spacing: 0.12em;
    margin-top: 2mm;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 5mm 0;
  }
  .divider-line { flex: 1; height: 1px; background: linear-gradient(to left, transparent, var(--brass), transparent); }
  .divider-diamond {
    width: 8px; height: 8px;
    background: var(--brass);
    transform: rotate(45deg);
    flex-shrink: 0;
  }

  .dates {
    text-align: left;
    margin-bottom: 6mm;
    font-size: 9pt;
    color: var(--gold-faint);
    font-family: 'Amiri', serif;
    line-height: 1.9;
  }

  .letter-title {
    font-family: 'Aref Ruqaa', serif;
    font-size: 20pt;
    color: var(--brass);
    text-align: center;
    margin-bottom: 5mm;
  }

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
  .recipient-label {
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 8.5pt;
    color: var(--gold-faint);
    margin-bottom: 1.5mm;
  }
  .recipient-name {
    font-family: 'Aref Ruqaa', serif;
    font-size: 17pt;
    color: var(--brass);
    line-height: 1.3;
  }
  .recipient-role {
    font-family: 'Amiri', serif;
    font-size: 10.5pt;
    color: #4a3c28;
    margin-top: 1mm;
  }
  .recipient-icon {
    font-size: 22pt;
    color: var(--brass);
    opacity: 0.55;
    margin-left: 3mm;
    flex-shrink: 0;
  }

  .body-text {
    font-family: 'Amiri', serif;
    font-size: 12pt;
    line-height: 2.1;
    color: #1a1408;
    text-align: justify;
    margin-bottom: 5mm;
  }

  .closing { margin-top: 7mm; font-family: 'Amiri', serif; font-size: 12pt; line-height: 2; color: #1a1408; }

  .signature {
    margin-top: 8mm;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .sig-block { text-align: center; }
  .sig-label { font-family: 'IBM Plex Sans Arabic', sans-serif; font-size: 9pt; color: var(--gold-faint); }
  .sig-name  { font-family: 'Aref Ruqaa', serif; font-size: 13pt; color: var(--brass); margin-top: 1mm; }
  .sig-line  { width: 55mm; height: 1px; background: var(--brass); margin: 10mm auto 2mm; }

  .footer-wm {
    position: absolute;
    bottom: 14mm;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'IBM Plex Sans Arabic', sans-serif;
    font-size: 7pt;
    color: var(--brass-lt);
    opacity: 0.55;
    white-space: nowrap;
    letter-spacing: 0.15em;
  }

  @media print {
    body { background: none; padding: 0; }
    .letter { box-shadow: none; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="letter">

  <svg class="corner corner-tl" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>
  <svg class="corner corner-tr" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>
  <svg class="corner corner-bl" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>
  <svg class="corner corner-br" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0 L28 0 L28 4 L4 4 L4 28 L0 28 Z"/>
    <path d="M6 6 L20 6 L20 9 L9 9 L9 20 L6 20 Z"/>
    <circle cx="22" cy="6" r="2.5"/>
    <circle cx="6" cy="22" r="2.5"/>
  </svg>

  <!-- Header -->
  <div class="header">
    <div class="logo-wrap">
      <img src="/logo.svg" alt="شعار قبيلة السياحين" />
    </div>
    <div class="tribe-name">الموقع الرسمي لقبيلة السياحين</div>
    <div class="tribe-sub">توثيق الإرث والموروث التاريخي</div>
  </div>

  <div class="divider">
    <div class="divider-line"></div>
    <div class="divider-diamond"></div>
    <div class="divider-diamond" style="width:5px;height:5px;"></div>
    <div class="divider-diamond"></div>
    <div class="divider-line"></div>
  </div>

  <!-- Dates -->
  <div class="dates">
    <div>التاريخ الهجري: ${esc(opts.hijriDate)}</div>
    <div>التاريخ الميلادي: ${esc(opts.gregorianDate)}</div>
  </div>

  <!-- Title -->
  <div class="letter-title">خطاب شكر وعرفان خاص</div>

  <!-- Recipient box -->
  <div class="recipient-box">
    <div style="flex:1;">
      <div class="recipient-label">المُكرَّم / المُكرَّمة</div>
      <div class="recipient-name">${esc(opts.recipientName)}</div>
      <div class="recipient-role">${esc(opts.recipientRole)}</div>
    </div>
    <div class="recipient-icon">✦</div>
  </div>

  <!-- Opening -->
  <p class="body-text">${esc(opts.openingLine)}</p>

  <!-- Closing -->
  <div class="closing">
    <p>${esc(opts.closingLine)}</p>
  </div>

  <!-- Signature -->
  <div class="signature">
    <div class="sig-block">
      <div class="sig-line"></div>
      <div class="sig-label">إدارة الموقع الرسمي</div>
      <div class="sig-name">${esc(opts.signatureName)}</div>
    </div>
    <div class="sig-block" style="text-align:center;">
      <img src="/logo.svg" alt="" style="width:40px;height:40px;opacity:0.45;" />
    </div>
  </div>

  <div class="footer-wm">الموقع الرسمي لقبيلة السياحين — alsaihani.com</div>
</div>
</body>
</html>`;
}

const GROUP_OPENING =
  'بسم الله الرحمن الرحيم، والصلاة والسلام على أشرف الأنبياء والمرسلين، أما بعد:\n\nيسعدنا في الموقع الرسمي لقبيلة السياحين أن نتقدم بأسمى آيات الشكر والتقدير والعرفان لكل من أسهم بسخاء في دعم مسيرة توثيق إرث وتاريخ قبيلة السياحين الكريمة. إن هذا الجهد المبارك ما كان ليرى النور لولا تفضّل هؤلاء الكرام وإيمانهم بأهمية صون الموروث الحضاري.';
const GROUP_CLOSING =
  'وإننا إذ نُقدّم هذا الخطاب إقراراً بفضلهم ووفاءً بحقهم، لنسأل الله العلي القدير أن يجزيهم خير الجزاء، وأن يبارك في أعمالهم وأهليهم وذرياتهم، وأن يجعل هذا العمل صدقةً جاريةً في موازين حسناتهم. والله ولي التوفيق.';

const INDIVIDUAL_OPENING = (name: string) =>
  `بسم الله الرحمن الرحيم، والصلاة والسلام على أشرف الأنبياء والمرسلين، أما بعد:\n\nيتقدم الموقع الرسمي لقبيلة السياحين بأسمى آيات الشكر والتقدير والعرفان إلى المكرَّم / ${name}، الذي أسهم بسخاء وكرم في دعم مسيرة توثيق إرث وتاريخ قبيلة السياحين الكريمة. إن هذا الجهد المبارك ما كان ليرى النور لولا تفضّله وإيمانه بأهمية صون الموروث الحضاري.`;
const INDIVIDUAL_CLOSING =
  'وإننا إذ نُقدّم هذا الخطاب الخاص وفاءً بحقه وإقراراً بفضله، لنسأل الله العلي القدير أن يجزيه خير الجزاء، وأن يبارك في عمله وأهله وذريته، وأن يجعل هذا العمل صدقةً جاريةً في موازين حسناته. والله ولي التوفيق.';

export function ThanksLetterGenerator() {
  const [mode, setMode] = useState<LetterMode>('group');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const [hijriDate, setHijriDate] = useState(TODAY);
  const [gregorianDate, setGregorianDate] = useState(GREGORIAN_TODAY);
  const [openingLine, setOpeningLine] = useState(GROUP_OPENING);
  const [closingLine, setClosingLine] = useState(GROUP_CLOSING);
  const [signatureName, setSignatureName] = useState('حسين بن علي بن بعاج ابن مسيلم');

  const selectedSupporter = SUPPORTERS_DATA[selectedIdx] ?? SUPPORTERS_DATA[0];

  const handleModeChange = (newMode: LetterMode) => {
    setMode(newMode);
    if (newMode === 'individual') {
      setOpeningLine(INDIVIDUAL_OPENING(SUPPORTERS_DATA[selectedIdx]?.name ?? ''));
      setClosingLine(INDIVIDUAL_CLOSING);
    } else {
      setOpeningLine(GROUP_OPENING);
      setClosingLine(GROUP_CLOSING);
    }
  };

  const handleSelectSupporter = (idx: number) => {
    setSelectedIdx(idx);
    if (mode === 'individual') {
      setOpeningLine(INDIVIDUAL_OPENING(SUPPORTERS_DATA[idx]?.name ?? ''));
    }
  };

  const handlePrint = () => {
    const html =
      mode === 'individual'
        ? buildIndividualLetterHtml({
            hijriDate,
            gregorianDate,
            recipientName: selectedSupporter.name,
            recipientRole: selectedSupporter.role,
            openingLine,
            closingLine,
            signatureName,
          })
        : buildLetterHtml({ hijriDate, gregorianDate, openingLine, closingLine, signatureName });
    const win = window.open('', '_blank', 'width=900,height=1100');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 800);
  };

  const handleReset = () => {
    setHijriDate(TODAY);
    setGregorianDate(GREGORIAN_TODAY);
    if (mode === 'individual') {
      setOpeningLine(INDIVIDUAL_OPENING(selectedSupporter.name));
      setClosingLine(INDIVIDUAL_CLOSING);
    } else {
      setOpeningLine(GROUP_OPENING);
      setClosingLine(GROUP_CLOSING);
    }
    setSignatureName('حسين بن علي بن بعاج ابن مسيلم');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-6">
        <h2 className="font-ruqaa text-3xl text-brass-lt mb-1">خطاب شكر وتقدير للداعمين</h2>
        <p className="text-sm text-sand-dim">
          أُنشئ تلقائياً من قائمة الداعمين المعتمدة — اختر النوع ثم قم بتخصيص النص واطبعه أو احفظه PDF.
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
        </div>

        {/* Name selector — shown only in individual mode */}
        {mode === 'individual' && (
          <div className="mt-5 space-y-2">
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

            {/* Selected summary */}
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-brass/30 bg-brass/8 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-brass/20 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-brass-lt" aria-hidden="true" />
              </div>
              <div>
                <p className="font-kufi text-sm text-brass-lt leading-snug">{selectedSupporter.name}</p>
                <p className="font-sans text-xs text-sand-dim">{selectedSupporter.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Settings panel */}
        <section className="rounded-2xl border border-brass/20 bg-ink-2/60 p-6 space-y-5">
          <h3 className="font-kufi text-lg text-brass-lt border-b border-brass/10 pb-3">إعدادات الخطاب</h3>

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

          <div className="space-y-1">
            <label className="font-kufi text-xs text-sand-dim">فقرة الافتتاح</label>
            <textarea
              rows={6}
              value={openingLine}
              onChange={(e) => setOpeningLine(e.target.value)}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm leading-relaxed resize-y focus:outline-none focus:border-brass/50"
            />
          </div>

          <div className="space-y-1">
            <label className="font-kufi text-xs text-sand-dim">فقرة الختام</label>
            <textarea
              rows={4}
              value={closingLine}
              onChange={(e) => setClosingLine(e.target.value)}
              className="w-full rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand text-sm leading-relaxed resize-y focus:outline-none focus:border-brass/50"
            />
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
              onClick={handlePrint}
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

          {/* Parchment card preview */}
          <div
            dir="rtl"
            className="relative rounded-xl border-2 border-[#c9a24b] bg-[#f5eed8] text-[#12100d] p-8 shadow-lg overflow-hidden font-serif"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            {/* Decorative double border */}
            <div className="absolute inset-2 border border-[#c9a24b]/40 rounded-lg pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-5 relative z-10">
              <img src="/logo.svg" alt="الشعار" className="w-14 h-14 mx-auto mb-2" />
              <p
                className="text-2xl font-bold text-[#c9a24b]"
                style={{ fontFamily: 'Aref Ruqaa, serif' }}
              >
                الموقع الرسمي لقبيلة السياحين
              </p>
              <p className="text-[10px] text-[#6b5a30] tracking-widest mt-1" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                توثيق الإرث والموروث التاريخي
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#c9a24b] to-transparent" />
              <div className="w-2 h-2 bg-[#c9a24b] rotate-45" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#c9a24b] to-transparent" />
            </div>

            {/* Dates */}
            <div className="text-right text-[10px] text-[#6b5a30] mb-3 leading-6" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
              <div>التاريخ الهجري: {hijriDate}</div>
              <div>التاريخ الميلادي: {gregorianDate}</div>
            </div>

            {/* Title */}
            <p
              className="text-center text-xl font-bold text-[#c9a24b] mb-3"
              style={{ fontFamily: 'Aref Ruqaa, serif' }}
            >
              {mode === 'individual' ? 'خطاب شكر وعرفان خاص' : 'خطاب شكر وعرفان'}
            </p>

            {/* Recipient box — individual mode only */}
            {mode === 'individual' && (
              <div className="flex items-center gap-3 border border-[#c9a24b] rounded-lg bg-[#e8dcc8] px-4 py-3 mb-4">
                <div className="flex-1">
                  <p className="text-[9px] text-[#6b5a30] mb-1" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>المُكرَّم / المُكرَّمة</p>
                  <p className="text-[15px] font-bold text-[#c9a24b]" style={{ fontFamily: 'Aref Ruqaa, serif' }}>{selectedSupporter.name}</p>
                  <p className="text-[10px] text-[#4a3c28] mt-0.5">{selectedSupporter.role}</p>
                </div>
                <span className="text-[#c9a24b]/50 text-xl">✦</span>
              </div>
            )}

            {/* Opening */}
            <p className="text-[11px] leading-7 text-[#1a1408] mb-4 whitespace-pre-line text-justify">
              {openingLine}
            </p>

            {/* Supporters list preview — group mode only */}
            {mode === 'group' && (
              <>
                <p
                  className="text-center text-[13px] font-bold text-[#c9a24b] border-b border-[#c9a24b]/30 pb-1 mb-2"
                  style={{ fontFamily: 'Aref Ruqaa, serif' }}
                >
                  قائمة الداعمين الكرام المُكرَّمين
                </p>
                <table className="w-full text-[10px] border-collapse mb-4">
                  <thead>
                    <tr className="bg-[#c9a24b] text-white">
                      <th className="py-1 px-2 text-right w-8">#</th>
                      <th className="py-1 px-2 text-right">الاسم</th>
                      <th className="py-1 px-2 text-right">المساهمة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SUPPORTERS_DATA.map((s, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-[#e8dcc8]' : 'bg-[#f5eed8]'}>
                        <td className="py-1 px-2 text-center text-[#6b5a30]">{i + 1}</td>
                        <td className="py-1 px-2 font-bold">{s.name}</td>
                        <td className="py-1 px-2 text-[#4a3c28]">{s.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Closing */}
            <p className="text-[11px] leading-7 text-[#1a1408] mb-5 text-justify">
              {closingLine}
            </p>

            {/* Signature */}
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="w-32 h-px bg-[#c9a24b] mb-1" />
                <p className="text-[9px] text-[#6b5a30]" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                  إدارة الموقع الرسمي
                </p>
                <p
                  className="text-[13px] font-bold text-[#c9a24b]"
                  style={{ fontFamily: 'Aref Ruqaa, serif' }}
                >
                  {signatureName}
                </p>
              </div>
              <img src="/logo.svg" alt="" className="w-8 h-8 opacity-40" />
            </div>

            {/* Watermark */}
            <p
              className="text-center text-[8px] text-[#c9a24b]/50 mt-4 tracking-wider"
              style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
            >
              الموقع الرسمي لقبيلة السياحين — alsaihani.com
            </p>
          </div>

          {/* Info note */}
          <p className="text-xs text-sand-dim text-center">
            المعاينة تقريبية — الطباعة ستُنتج تخطيط A4 كامل
          </p>
        </section>
      </div>

      {/* Supporters count info */}
      <div className="rounded-xl border border-brass/15 bg-brass/5 p-4 text-sm text-sand-dim font-sans">
        <span className="text-brass-lt font-kufi font-bold">ملاحظة: </span>
        {mode === 'individual'
          ? 'في وضع الشكر الفردي يُولَّد خطاب مخصص لكل داعم بشكل منفصل — اختر الاسم من القائمة أعلاه ثم اطبع.'
          : <>الخطاب الجماعي مرتبط تلقائياً بقائمة الداعمين ويحتوي حالياً على <span className="text-brass-lt font-bold">{SUPPORTERS_DATA.length}</span> داعم.</>}
        {' '}لتحديث الأسماء قم بتعديل ملف <code className="text-copper-lt text-xs">Supporters.data.ts</code>.
      </div>
    </div>
  );
}
