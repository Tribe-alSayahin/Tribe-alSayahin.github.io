'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { SITE_ROUTES } from '../../../lib/navigation';

const CHAPTERS = SITE_ROUTES.filter((r) => r.id !== 'home');
const CHAPTER_NUMS = ['١', '٢', '٣', '٤', '٥'];

const CHAPTER_META: Record<string, { desc: string; updated: string; count: string }> = {
  nasab: {
    desc: 'شجرة النسب الأصيل — هجرة الجثوم، وعمود النسب من المزاحمة إلى عدنان، والأنساب السبعة الكبرى.',
    updated: 'آخر تحديث: ربيع الأول ١٤٤٦',
    count: '٣ وثائق',
  },
  diyar: {
    desc: 'الخريطة التفاعلية لمواطن القبيلة في عالية نجد، الصور الأثرية، ومعالم الهجر والديار.',
    updated: 'آخر تحديث: صفر ١٤٤٦',
    count: '٢ وثائق',
  },
  hawiya: {
    desc: 'الوسم القبلي، ديوان الشعر النبطي، وأعلام الشعراء في سجل رقمي مفتوح.',
    updated: 'آخر تحديث: محرم ١٤٤٦',
    count: '٤ وثائق',
  },
  tarikh: {
    desc: 'الخط الزمني الموثَّق من الجثوم إلى اليوم، والأرشيف الاستشراقي من وثائق الرحالة الأوروبيين.',
    updated: 'آخر تحديث: ذو القعدة ١٤٤٥',
    count: '٦ وثائق',
  },
  news: {
    desc: 'أخبار المجتمع والمناسبات، والداعمون، وقنوات التواصل مع إدارة الموقع.',
    updated: 'آخر تحديث: متجدد',
    count: 'متجدد',
  },
};

/* شعار القبيلة النقشي — SVG هندسي بسيط */
function TribalSeal() {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ width: '80px', height: '80px' }}
    >
      {/* الدائرة الخارجية */}
      <circle cx="60" cy="60" r="54" fill="none" stroke="var(--brass)" strokeWidth="1.2" opacity="0.7" />
      {/* الدائرة الداخلية */}
      <circle cx="60" cy="60" r="44" fill="none" stroke="var(--brass)" strokeWidth="0.7" opacity="0.4" />
      {/* المعينات الأربع */}
      <path
        d="M60 16 L70 60 L60 104 L50 60 Z"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <path
        d="M16 60 L60 70 L104 60 L60 50 Z"
        fill="none"
        stroke="var(--brass)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      {/* نقاط الزوايا */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 60 + 44 * Math.cos(rad);
        const y = 60 + 44 * Math.sin(rad);
        return <circle key={deg} cx={x} cy={y} r="2.5" fill="var(--brass)" opacity="0.8" />;
      })}
      {/* النقطة المركزية */}
      <circle cx="60" cy="60" r="4" fill="var(--brass)" opacity="0.9" />
      <circle cx="60" cy="60" r="8" fill="none" stroke="var(--brass)" strokeWidth="0.7" opacity="0.5" />
      {/* حروف النقش — س */}
      <text
        x="60"
        y="58"
        fontFamily="serif"
        fontSize="14"
        fill="var(--brass)"
        textAnchor="middle"
        dominantBaseline="middle"
        opacity="0.85"
        letterSpacing="2"
      >
        السياحين
      </text>
    </svg>
  );
}

export default function PreviewArchiveClient() {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [navCompact, setNavCompact] = useState(false);
  const prefersReduced = useReducedMotion();
  const lastScrollY = useRef(0);

  const BANNER_H = bannerDismissed ? 0 : 44;
  const BAR_H = 68;

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (!bannerDismissed) {
        setNavCompact(current > 60);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [bannerDismissed]);

  const handleDismiss = () => {
    setBannerDismissed(true);
    setNavCompact(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        color: 'var(--sand)',
        overflowX: 'clip',
        paddingTop: `${BANNER_H + BAR_H}px`,
        transition: prefersReduced ? 'none' : 'padding-top 0.35s ease',
      }}
      dir="rtl"
    >
      {/* ═══════════════════════════════════════════════
          N12 — Banner + Retract
          ══════════════════════════════════════════════ */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          insetInline: 0,
          zIndex: 50,
          transform: navCompact
            ? `translateY(${-BANNER_H}px)`
            : 'translateY(0)',
          transition: prefersReduced ? 'none' : 'transform 0.32s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* البانر الذهبي */}
        {!bannerDismissed && (
          <div
            style={{
              height: `${BANNER_H}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              background:
                'linear-gradient(100deg, color-mix(in srgb, var(--brass) 90%, var(--copper)), color-mix(in srgb, var(--brass-lt) 80%, var(--brass)))',
              color: 'var(--ink)',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-kufi)',
              letterSpacing: '0.1em',
              paddingInline: '1rem',
              position: 'relative',
            }}
          >
            <span>
              الروقة من عتيبة &ensp;·&ensp; هجرة الجثوم ١٤٠٠+ سنة &ensp;·&ensp; السيحاني
            </span>
            <button
              onClick={handleDismiss}
              aria-label="إغلاق البانر"
              style={{
                position: 'absolute',
                left: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--ink)',
                opacity: 0.6,
                display: 'flex',
                alignItems: 'center',
                padding: '0.25rem',
                borderRadius: '0.25rem',
                transition: 'opacity 0.2s ease',
              }}
              className="banner-dismiss"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* شريط التنقل */}
        <div
          style={{
            height: `${BAR_H}px`,
            background: 'color-mix(in srgb, var(--ink) 90%, transparent)',
            backdropFilter: 'blur(16px) saturate(140%)',
            borderBottom: '1px solid color-mix(in srgb, var(--brass) 18%, transparent)',
            display: 'flex',
            alignItems: 'center',
            paddingInline: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '1160px',
              margin: '0 auto',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '1rem',
                color: 'var(--sand)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                transition: 'color 0.3s ease',
              }}
              className="archive-wordmark"
            >
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: 'var(--brass-lt)', opacity: 0.7 }}>
                الموقع الرسمي
              </span>
              <span>قبيلة السياحين</span>
            </Link>

            <nav
              aria-label="التنقل الرئيسي"
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              className="archive-nav"
            >
              {CHAPTERS.map((ch) => (
                <Link
                  key={ch.id}
                  href={ch.href}
                  style={{
                    fontFamily: 'var(--font-kufi)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    color: 'var(--sand-dim)',
                    textDecoration: 'none',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '9999px',
                    transition: 'color 0.2s ease, background 0.2s ease',
                  }}
                  className="archive-nav-link"
                >
                  {ch.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          البطل — Index-First (قصير 60vh)
          ══════════════════════════════════════════════ */}
      <section
        aria-label="مدخل الأرشيف"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          padding: '3rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          background:
            'radial-gradient(circle at 70% 50%, color-mix(in srgb, var(--indigo) 20%, transparent), transparent 30rem), var(--ink)',
          borderBottom: '1px solid color-mix(in srgb, var(--brass) 12%, transparent)',
        }}
      >
        {/* نمط خفيف */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='26' viewBox='0 0 44 26'%3E%3Cg fill='none' stroke='%23c9a24b' stroke-width='1.1'%3E%3Cpath d='M0 13 11 2 22 13 11 24Z'/%3E%3Cpath d='M22 13 33 2 44 13 33 24Z'/%3E%3C/g%3E%3Cg fill='%23c9a24b'%3E%3Ccircle cx='11' cy='13' r='1.7'/%3E%3Ccircle cx='33' cy='13' r='1.7'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '88px 52px',
            backgroundRepeat: 'repeat',
            opacity: 0.04,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            zIndex: 10,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          {/* الشعار النقشي */}
          <div style={{ opacity: 0.85 }}>
            <TribalSeal />
          </div>

          {/* النص */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                color: 'var(--brass-lt)',
                marginBottom: '1rem',
                opacity: 0.7,
              }}
            >
              الأرشيف الرقمي الموثَّق
            </p>

            <h1
              style={{
                fontFamily: 'var(--font-ruqaa)',
                fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)',
                color: 'var(--sand)',
                lineHeight: 1.25,
                margin: '0 0 1rem',
                maxWidth: '460px',
              }}
            >
              قبيلة السياحين — الأرشيف الرقمي
            </h1>

            {/* خط فاصل */}
            <div
              aria-hidden="true"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                maxWidth: '280px',
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background:
                    'linear-gradient(to left, color-mix(in srgb, var(--brass) 50%, transparent), transparent)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-kufi)',
                  fontSize: '0.55rem',
                  color: 'var(--brass)',
                  letterSpacing: '0.2em',
                  opacity: 0.6,
                }}
              >
                ✦
              </span>
              <span
                style={{
                  flex: 1,
                  height: '1px',
                  background:
                    'linear-gradient(to right, color-mix(in srgb, var(--brass) 50%, transparent), transparent)',
                }}
              />
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                color: 'var(--sand-dim)',
                lineHeight: 1.75,
                maxWidth: '440px',
                margin: 0,
              }}
            >
              توثيق النسب والديار والشعر والأرشيف الاستشراقي — سجل مفتوح قابل للمراجعة.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          القائمة المُفهرسة — Index-First
          ══════════════════════════════════════════════ */}
      <main
        id="main-content"
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: '3rem 2rem 5rem',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-kufi)',
            fontSize: '0.62rem',
            letterSpacing: '0.2em',
            color: 'var(--brass-lt)',
            marginBottom: '2rem',
            opacity: 0.6,
          }}
        >
          أبواب الأرشيف — {CHAPTERS.length} أبواب
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {CHAPTERS.map((ch, i) => {
            const meta = CHAPTER_META[ch.id];
            return (
              <li
                key={ch.id}
                style={{
                  borderTop:
                    i === 0
                      ? '1px solid color-mix(in srgb, var(--brass) 35%, transparent)'
                      : '1px solid color-mix(in srgb, var(--brass) 14%, transparent)',
                }}
              >
                <Link
                  href={ch.href}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '6rem 1fr auto',
                    gap: '1.5rem',
                    padding: '2rem 0',
                    textDecoration: 'none',
                    alignItems: 'center',
                    transition: 'background 0.2s ease',
                    borderRadius: '0.5rem',
                  }}
                  className="archive-row"
                >
                  {/* الرقم الكبير كعلامة مائية */}
                  <span
                    style={{
                      fontFamily: 'var(--font-ruqaa)',
                      fontSize: '3.5rem',
                      lineHeight: 1,
                      color: 'var(--brass)',
                      opacity: 0.18,
                      userSelect: 'none',
                    }}
                    aria-hidden="true"
                  >
                    {CHAPTER_NUMS[i]}
                  </span>

                  {/* المحتوى */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h2
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.25rem',
                          color: 'var(--sand)',
                          margin: 0,
                          lineHeight: 1.4,
                          transition: 'color 0.2s ease',
                        }}
                        className="archive-title"
                      >
                        {ch.label}
                      </h2>
                      <span
                        style={{
                          fontFamily: 'var(--font-kufi)',
                          fontSize: '0.6rem',
                          color: 'var(--brass-lt)',
                          opacity: 0.6,
                          letterSpacing: '0.1em',
                        }}
                      >
                        {meta.count}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.85rem',
                        color: 'var(--sand-dim)',
                        lineHeight: 1.7,
                        margin: '0 0 0.6rem',
                        maxWidth: '560px',
                      }}
                    >
                      {meta.desc}
                    </p>
                    <span
                      style={{
                        fontFamily: 'var(--font-kufi)',
                        fontSize: '0.6rem',
                        color: 'var(--sand-dim)',
                        opacity: 0.45,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {meta.updated}
                    </span>
                  </div>

                  {/* سهم */}
                  <span
                    style={{
                      color: 'var(--brass-lt)',
                      opacity: 0.4,
                      fontSize: '1.25rem',
                      fontFamily: 'var(--font-sans)',
                      transition: 'opacity 0.2s ease, transform 0.2s ease',
                    }}
                    className="archive-arrow"
                    aria-hidden="true"
                  >
                    ←
                  </span>
                </Link>
              </li>
            );
          })}
          {/* خط ختامي */}
          <li
            style={{
              borderTop: '1px solid color-mix(in srgb, var(--brass) 35%, transparent)',
            }}
          />
        </ul>
      </main>

      {/* ═══════════════════════════════════════════════
          Ft3-variant — 2-column footer
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
            marginBottom: '2rem',
          }}
        >
          {/* العمود الأيمن: معلومات القبيلة */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                color: 'var(--brass-lt)',
                marginBottom: '1rem',
                opacity: 0.6,
              }}
            >
              قبيلة السياحين
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['من المزاحمة', 'من الروقة', 'من عتيبة الهيلا', 'admin@alsaihani.com'].map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.78rem',
                    color: 'var(--sand-dim)',
                    lineHeight: 1.9,
                    borderBottom: '1px solid color-mix(in srgb, var(--brass) 7%, transparent)',
                    paddingBottom: '0.35rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  {item.includes('@') ? (
                    <a
                      href={`mailto:${item}`}
                      style={{ color: 'var(--brass-lt)', textDecoration: 'none' }}
                      className="footer-email"
                    >
                      {item}
                    </a>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* الفاصل العمودي */}
          <div
            style={{
              width: '1px',
              background:
                'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--brass) 28%, transparent), transparent)',
              alignSelf: 'stretch',
            }}
            aria-hidden="true"
          />

          {/* العمود الأيسر: أبواب الأرشيف */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                color: 'var(--brass-lt)',
                marginBottom: '1rem',
                opacity: 0.6,
              }}
            >
              أبواب الأرشيف
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {CHAPTERS.map((ch, i) => (
                <li
                  key={ch.id}
                  style={{
                    borderBottom: '1px solid color-mix(in srgb, var(--brass) 7%, transparent)',
                    paddingBottom: '0.35rem',
                    marginBottom: '0.35rem',
                  }}
                >
                  <Link
                    href={ch.href}
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.78rem',
                      color: 'var(--sand-dim)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.6rem',
                      transition: 'color 0.2s ease',
                      lineHeight: 1.9,
                    }}
                    className="footer-link"
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-kufi)',
                        fontSize: '0.55rem',
                        color: 'var(--brass)',
                        opacity: 0.55,
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

        {/* الشريط السفلي */}
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            paddingTop: '1.25rem',
            borderTop: '1px solid color-mix(in srgb, var(--brass) 10%, transparent)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.72rem',
              color: 'var(--sand-dim)',
              opacity: 0.45,
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} الموقع الرسمي لقبيلة السياحين
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.55rem',
                color: 'var(--sand-dim)',
                opacity: 0.3,
                letterSpacing: '0.1em',
              }}
            >
              HALLMARK · Index-First · N12 · Ft3-variant · معاينة — noindex
            </span>
            <Link
              href="/preview/"
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.62rem',
                color: 'var(--brass-lt)',
                textDecoration: 'none',
                opacity: 0.6,
              }}
            >
              ← المعاينات
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        .banner-dismiss:hover { opacity: 0.9 !important; }
        .banner-dismiss:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--ink); border-radius: 0.25rem; }
        .archive-wordmark:hover { color: var(--brass-lt) !important; }
        .archive-wordmark:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        .archive-nav-link:hover { color: var(--brass-lt) !important; background: color-mix(in srgb, var(--brass) 8%, transparent) !important; }
        .archive-nav-link:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 9999px; }
        .archive-row:hover .archive-title { color: var(--brass-lt) !important; }
        .archive-row:hover .archive-arrow { opacity: 0.85 !important; transform: translateX(-3px); }
        .archive-row:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); }
        .footer-link:hover { color: var(--brass-lt) !important; }
        .footer-link:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        .footer-email:hover { color: var(--brass) !important; }
        .footer-email:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        @media (max-width: 768px) {
          [style*="gridTemplateColumns: 'auto 1fr'"] { grid-template-columns: 1fr !important; }
          [style*="gridTemplateColumns: '6rem 1fr auto'"] { grid-template-columns: 3rem 1fr auto !important; }
          [style*="gridTemplateColumns: '1fr 1px 1fr'"] { grid-template-columns: 1fr !important; }
          .archive-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}
