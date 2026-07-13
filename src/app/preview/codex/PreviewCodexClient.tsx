'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { SITE_ROUTES } from '../../../lib/navigation';

const CHAPTERS = SITE_ROUTES.filter((r) => r.id !== 'home');

const CHAPTER_NUMS = ['١', '٢', '٣', '٤', '٥'];
const CHAPTER_DESCRIPTIONS: Record<string, string> = {
  nasab:
    'توثيق نسب فخذ السياحين من المزاحمة من الروقة من عتيبة الهيلا، وشجرة النسب الأصيل، وهجرة الجثوم أول الديار.',
  diyar:
    'رحلة في ديار القبيلة: الخريطة التفاعلية لمواطن السياحين، الصور الأثرية، ومعالم المواقع الرئيسية.',
  hawiya:
    'الهوية القبلية في وسمها ولهجتها وشعرها النبطي — الديوان الرقمي لقصائد الأجداد وأعلام الشعراء.',
  tarikh:
    'الخط الزمني الموثَّق لأحداث القبيلة، والأرشيف الاستشراقي، ووثائق نجد من رحلات الرحالة والعلماء.',
  news:
    'مجتمع القبيلة الرقمي: أخبار المناسبات والفعاليات، والداعمون، وقنوات التواصل مع الإدارة.',
};

/* SVG خطوط نجد المبسّطة — طبقة خلفية في البطل */
function NajdMapSVG() {
  return (
    <svg
      viewBox="0 0 800 520"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.12,
        pointerEvents: 'none',
      }}
    >
      {/* وادي الرمة */}
      <path
        d="M 60 200 C 120 190 180 210 250 195 C 310 182 370 200 440 188 C 510 175 570 195 640 180 C 700 168 750 185 800 175"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* وادي حنيفة */}
      <path
        d="M 320 60 C 330 120 310 180 325 250 C 338 315 320 380 335 450 C 342 490 338 505 340 520"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* وادي الدواسر */}
      <path
        d="M 150 320 C 220 310 290 330 360 318 C 430 306 480 325 540 315 C 600 305 650 320 720 310"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="6 4"
      />
      {/* الطريق الرئيسي */}
      <path
        d="M 100 420 C 200 415 300 408 400 415 C 500 422 600 410 700 418"
        fill="none"
        stroke="var(--copper)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* موقع المزاحمة */}
      <circle cx="330" cy="250" r="5" fill="var(--brass)" opacity="0.8" />
      <circle cx="330" cy="250" r="12" fill="none" stroke="var(--brass)" strokeWidth="1" opacity="0.4" />
      {/* نجد */}
      <circle cx="500" cy="220" r="3" fill="var(--brass)" opacity="0.5" />
      {/* الرياض */}
      <circle cx="410" cy="300" r="4" fill="var(--copper)" opacity="0.6" />
      {/* خطوط الحدود الجغرافية */}
      <path
        d="M 50 100 C 100 80 200 90 300 100 C 400 110 500 85 600 95 C 680 103 740 90 800 100"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="0.7"
        strokeDasharray="3 6"
        opacity="0.5"
      />
      <path
        d="M 50 440 C 150 430 250 445 400 438 C 550 431 680 443 800 435"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="0.7"
        strokeDasharray="3 6"
        opacity="0.5"
      />
      {/* تسمية نجد */}
      <text
        x="480"
        y="200"
        fontFamily="serif"
        fontSize="14"
        fill="var(--brass)"
        opacity="0.4"
        textAnchor="middle"
        letterSpacing="3"
      >
        نَجْد
      </text>
      <text
        x="330"
        y="285"
        fontFamily="serif"
        fontSize="10"
        fill="var(--brass)"
        opacity="0.5"
        textAnchor="middle"
      >
        المزاحمة
      </text>
    </svg>
  );
}

export default function PreviewCodexClient() {
  const [scrolled, setScrolled] = useState(false);
  const _prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        color: 'var(--sand)',
        overflowX: 'clip',
      }}
      dir="rtl"
    >
      {/* ═══════════════════════════════════════════════
          N6 — Newspaper Masthead
          ══════════════════════════════════════════════ */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: scrolled
            ? 'color-mix(in srgb, var(--ink) 95%, transparent)'
            : 'var(--ink)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
          borderBottom: '1px solid color-mix(in srgb, var(--brass) 20%, transparent)',
        }}
      >
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '1.25rem 2rem 0' }}>
          {/* سطر التعريف */}
          <p
            style={{
              fontFamily: 'var(--font-kufi)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: 'var(--sand-dim)',
              textAlign: 'center',
              marginBottom: '0.6rem',
              opacity: 0.7,
            }}
          >
            الموقع الرسمي لقبيلة السياحين&ensp;·&ensp;الروقة من عتيبة&ensp;·&ensp;هجرة الجثوم
          </p>

          {/* اسم القبيلة كعنوان صحيفة */}
          <h1
            style={{
              fontFamily: 'var(--font-ruqaa)',
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              color: 'var(--sand)',
              textAlign: 'center',
              lineHeight: 0.95,
              margin: '0 0 0.75rem',
              letterSpacing: '-0.01em',
              background: 'linear-gradient(120deg, var(--brass) 0%, var(--brass-lt) 45%, var(--brass) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            قبيلة السياحين
          </h1>

          {/* روابط الفصول */}
          <nav
            aria-label="التنقل الرئيسي"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.25rem',
              flexWrap: 'wrap',
              marginBottom: '1.1rem',
            }}
          >
            {CHAPTERS.map((ch) => (
              <Link
                key={ch.id}
                href={ch.href}
                style={{
                  fontFamily: 'var(--font-kufi)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  color: 'var(--sand-dim)',
                  padding: '0.3rem 0.75rem',
                  textDecoration: 'none',
                  borderRadius: '9999px',
                  transition: 'color 0.3s ease',
                }}
                className="mast-link"
              >
                {ch.label}
              </Link>
            ))}
          </nav>

          {/* الخط المزدوج */}
          <div aria-hidden="true" style={{ position: 'relative', height: '5px' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background:
                  'linear-gradient(to left, transparent, var(--brass), transparent)',
                opacity: 0.6,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: 0,
                right: 0,
                height: '1px',
                background:
                  'linear-gradient(to left, transparent, color-mix(in srgb, var(--brass) 35%, transparent), transparent)',
              }}
            />
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          البطل — غير متماثل (Long Document opening)
          ══════════════════════════════════════════════ */}
      <section
        aria-label="مدخل الديوان"
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 30% 50%, color-mix(in srgb, var(--indigo) 22%, transparent), transparent 40rem), var(--ink)',
        }}
      >
        <NajdMapSVG />

        {/* غبار الخلفية */}
        <div className="dust-layer" aria-hidden="true" />

        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            padding: '5rem 2rem 4rem',
            width: '100%',
            position: 'relative',
            zIndex: 10,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* عمود المحتوى الأيمن */}
          <div>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                color: 'var(--brass-lt)',
                marginBottom: '1.5rem',
              }}
            >
              الديوان الرقمي الموثَّق
            </span>

            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
                color: 'var(--sand)',
                lineHeight: 1.5,
                maxWidth: '520px',
                margin: '0 0 2rem',
                fontWeight: 400,
              }}
            >
              البوابة الرقمية الموثقة لقبيلة السياحين — إرث تالد وديار أصيلة في سجل مفتوح للأجيال.
            </p>

            {/* الخط الفاصل المزخرف */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', maxWidth: '320px' }}
              aria-hidden="true"
            >
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background:
                    'linear-gradient(to left, color-mix(in srgb, var(--brass) 55%, transparent), transparent)',
                }}
              />
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  transform: 'rotate(45deg)',
                  background: 'linear-gradient(135deg, var(--brass), var(--brass-lt))',
                }}
              />
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background:
                    'linear-gradient(to right, color-mix(in srgb, var(--brass) 55%, transparent), transparent)',
                }}
              />
            </div>

            <Link
              href="/nasab/"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                color: 'var(--brass-lt)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderBottom: '1px solid color-mix(in srgb, var(--brass) 40%, transparent)',
                paddingBottom: '0.15rem',
                transition: 'color 0.3s ease, border-color 0.3s ease',
              }}
              className="codex-cta"
            >
              ابدأ من الأصول
              <span aria-hidden="true" style={{ fontFamily: 'var(--font-sans)' }}>←</span>
            </Link>
          </div>

          {/* رقم السنة الضخم */}
          <div
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-ruqaa)',
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              lineHeight: 1,
              color: 'var(--brass)',
              opacity: 0.08,
              letterSpacing: '-0.02em',
              userSelect: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ١٤٤٦
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          قائمة الفصول — Long Document TOC
          ══════════════════════════════════════════════ */}
      <main
        id="main-content"
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '4rem 2rem 6rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-kufi)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'var(--brass-lt)',
            marginBottom: '2.5rem',
          }}
        >
          محتويات الديوان
        </p>

        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {CHAPTERS.map((ch, i) => (
            <li
              key={ch.id}
              style={{
                borderTop:
                  i === 0
                    ? '1px solid color-mix(in srgb, var(--brass) 30%, transparent)'
                    : '1px solid color-mix(in srgb, var(--brass) 12%, transparent)',
              }}
            >
              <Link
                href={ch.href}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.5rem 1fr auto',
                  gap: '1.25rem',
                  padding: '1.75rem 0',
                  textDecoration: 'none',
                  alignItems: 'start',
                  transition: 'opacity 0.2s ease',
                }}
                className="chapter-row"
              >
                {/* رقم الفصل */}
                <span
                  style={{
                    fontFamily: 'var(--font-ruqaa)',
                    fontSize: '2rem',
                    color: 'var(--brass)',
                    opacity: 0.5,
                    lineHeight: 1,
                    paddingTop: '0.15rem',
                  }}
                  aria-hidden="true"
                >
                  {CHAPTER_NUMS[i]}
                </span>

                {/* نص الفصل */}
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-kufi)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.14em',
                      color: 'var(--brass-lt)',
                      marginBottom: '0.4rem',
                      opacity: 0.7,
                    }}
                  >
                    الفصل {ch.chapter}
                  </p>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.3rem',
                      color: 'var(--sand)',
                      margin: '0 0 0.6rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {ch.label}
                  </h2>
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.88rem',
                      color: 'var(--sand-dim)',
                      lineHeight: 1.75,
                      margin: 0,
                      maxWidth: '480px',
                    }}
                  >
                    {CHAPTER_DESCRIPTIONS[ch.id] ?? ''}
                  </p>
                </div>

                {/* سهم الانتقال */}
                <span
                  style={{
                    color: 'var(--brass-lt)',
                    opacity: 0.5,
                    fontSize: '1.1rem',
                    paddingTop: '1.8rem',
                    fontFamily: 'var(--font-sans)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                  aria-hidden="true"
                  className="chapter-arrow"
                >
                  ←
                </span>
              </Link>
            </li>
          ))}
          {/* خط ختامي */}
          <li
            style={{
              borderTop: '1px solid color-mix(in srgb, var(--brass) 30%, transparent)',
            }}
          />
        </ol>
      </main>

      {/* ═══════════════════════════════════════════════
          Ft4 — Dense Typographic Footer
          ══════════════════════════════════════════════ */}
      <footer
        style={{
          background: 'var(--ink-2)',
          borderTop: '1px solid color-mix(in srgb, var(--brass) 18%, transparent)',
          padding: '3rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1px 1fr',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* عمود بيانات القبيلة */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.62rem',
                letterSpacing: '0.16em',
                color: 'var(--brass-lt)',
                marginBottom: '0.75rem',
                opacity: 0.7,
              }}
            >
              بيانات القبيلة
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                color: 'var(--sand-dim)',
                lineHeight: 1.9,
                margin: 0,
              }}
            >
              فخذ السياحين (السيحاني) من المزاحمة من الروقة من عتيبة الهيلا.
              هجرة الجثوم — أول موطن مؤسَّس في عالية نجد.
              سلسلة النسب موثَّقة وصولاً إلى عدنان.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.72rem',
                color: 'var(--brass)',
                marginTop: '1rem',
                opacity: 0.8,
              }}
            >
              المزاحمة · الروقة · عتيبة الهيلا
            </p>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.72rem',
                color: 'var(--sand-dim)',
                marginTop: '1.5rem',
                opacity: 0.55,
              }}
            >
              © {new Date().getFullYear()} الموقع الرسمي لقبيلة السياحين
            </p>
          </div>

          {/* الخط الفاصل العمودي */}
          <div
            style={{
              width: '1px',
              background:
                'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--brass) 30%, transparent), transparent)',
              alignSelf: 'stretch',
            }}
            aria-hidden="true"
          />

          {/* عمود فهرس الفصول */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.62rem',
                letterSpacing: '0.16em',
                color: 'var(--brass-lt)',
                marginBottom: '0.75rem',
                opacity: 0.7,
              }}
            >
              فهرس الأبواب
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {CHAPTERS.map((ch, i) => (
                <li key={ch.id} style={{ marginBottom: '0.4rem' }}>
                  <Link
                    href={ch.href}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.8rem',
                      color: 'var(--sand-dim)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      gap: '0.75rem',
                      alignItems: 'baseline',
                      transition: 'color 0.2s ease',
                    }}
                    className="footer-link"
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-kufi)',
                        fontSize: '0.6rem',
                        color: 'var(--brass)',
                        opacity: 0.6,
                        minWidth: '1rem',
                      }}
                    >
                      {CHAPTER_NUMS[i]}
                    </span>
                    {ch.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* شريط المعاينة */}
        <div
          style={{
            maxWidth: '1160px',
            margin: '2rem auto 0',
            paddingTop: '1.5rem',
            borderTop: '1px solid color-mix(in srgb, var(--brass) 8%, transparent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-kufi)',
              fontSize: '0.6rem',
              color: 'var(--sand-dim)',
              opacity: 0.4,
              letterSpacing: '0.1em',
            }}
          >
            HALLMARK · Long Document · N6 · Ft4 · هذه معاينة تصميمية — noindex
          </span>
          <Link
            href="/preview/"
            style={{
              fontFamily: 'var(--font-kufi)',
              fontSize: '0.65rem',
              color: 'var(--brass-lt)',
              textDecoration: 'none',
              opacity: 0.65,
              letterSpacing: '0.08em',
            }}
          >
            ← العودة للمعاينات
          </Link>
        </div>
      </footer>

      <style>{`
        .mast-link:hover { color: var(--brass-lt) !important; }
        .mast-link:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 9999px; }
        .chapter-row:hover .chapter-arrow { opacity: 0.9 !important; transform: translateX(-3px); }
        .chapter-row:hover h2 { color: var(--brass-lt) !important; }
        .chapter-row:focus-visible { outline: none; }
        .chapter-row:focus-visible h2 { text-decoration: underline; text-decoration-color: var(--brass); }
        .codex-cta:hover { color: var(--brass) !important; border-color: var(--brass) !important; }
        .codex-cta:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        .footer-link:hover { color: var(--brass-lt) !important; }
        .footer-link:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        @media (max-width: 640px) {
          [style*="gridTemplateColumns: '1fr auto'"] { grid-template-columns: 1fr !important; }
          [style*="gridTemplateColumns: '1fr 1px 1fr'"] { grid-template-columns: 1fr !important; }
          [style*="gridTemplateColumns: '3.5rem 1fr auto'"] { grid-template-columns: 2.5rem 1fr auto !important; }
        }
      `}</style>
    </div>
  );
}
