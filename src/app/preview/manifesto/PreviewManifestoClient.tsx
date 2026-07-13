'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { SITE_ROUTES } from '../../../lib/navigation';

const CHAPTERS = SITE_ROUTES.filter((r) => r.id !== 'home');
const CHAPTER_NUMS = ['١', '٢', '٣', '٤', '٥'];

const ASSERTIONS = [
  {
    id: 'nasab',
    label: 'الأصول',
    claim: 'نحن أبناء الجثوم — أول هجرة رسَّخ فيها السياحين قدمهم في عالية نجد.',
    sub: 'النسب موثَّق وصولاً إلى عدنان، والفخر ليس ادعاءً بل سجلاً.',
    href: '/nasab/',
  },
  {
    id: 'diyar',
    label: 'الديار',
    claim: 'ديارنا في المزاحمة وما حولها ليست حدوداً جغرافية — هي ذاكرة حية.',
    sub: 'خرائط تفاعلية، صور أثرية، ومعالم لا تُمحى بتغيير الأسماء.',
    href: '/diyar/',
  },
  {
    id: 'hawiya',
    label: 'الهوية',
    claim: 'الشعر النبطي ليس فناً — هو سجل القبيلة قبل أن يعرف الناس الكتابة.',
    sub: 'الديوان الرقمي يحمل أصوات الأجداد ولا يسمح لها بالنسيان.',
    href: '/hawiya/',
  },
  {
    id: 'tarikh',
    label: 'التاريخ',
    claim: 'وثائق الرحالة الأوروبيين أثبتت حضورنا حين كان الشك ممكناً.',
    sub: 'الأرشيف الاستشراقي موظَّف لخدمة الرواية، لا لتحكيمها.',
    href: '/tarikh/',
  },
  {
    id: 'news',
    label: 'المجتمع',
    claim: 'القبيلة ليست ماضياً يُستحضر — هي مجتمع حاضر يصنع غده.',
    sub: 'مناسبات، فعاليات، وقنوات تواصل تربط أبناء القبيلة أينما كانوا.',
    href: '/news/',
  },
];

export default function PreviewManifestoClient() {
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 60) {
        setNavVisible(true);
      } else if (current > lastScrollY.current + 8) {
        setNavVisible(false);
      } else if (current < lastScrollY.current - 8) {
        setNavVisible(true);
      }
      lastScrollY.current = current;
    };
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
          N9 — Edge-Aligned Minimal (Hides on scroll-down)
          ══════════════════════════════════════════════ */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          insetInline: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 2.5rem',
          transform: navVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: prefersReduced ? 'none' : 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: navVisible ? 'auto' : 'none',
        }}
        aria-hidden={!navVisible}
      >
        {/* الشعار أقصى اليمين */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-ruqaa)',
            fontSize: '1.2rem',
            color: 'var(--sand)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
            transition: 'color 0.3s ease',
          }}
          className="manifesto-wordmark"
          tabIndex={navVisible ? 0 : -1}
        >
          قبيلة السياحين
        </Link>

        {/* الروابط أقصى اليسار */}
        <nav aria-label="التنقل الرئيسي" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.id}
              href={ch.href}
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                color: 'var(--sand-dim)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              className="manifesto-nav-link"
              tabIndex={navVisible ? 0 : -1}
            >
              {ch.label}
            </Link>
          ))}
        </nav>

        {/* خط ذهبي رفيع في الأسفل */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(to left, transparent, color-mix(in srgb, var(--brass) 30%, transparent), transparent)',
          }}
          aria-hidden="true"
        />
      </header>

      {/* ═══════════════════════════════════════════════
          البطل — Manifesto (نص مباشرة على الخلفية)
          ══════════════════════════════════════════════ */}
      <section
        aria-label="مدخل البيان"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* خلفية السدو المعزَّزة */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='26' viewBox='0 0 44 26'%3E%3Cg fill='none' stroke='%23c9a24b' stroke-width='1.1'%3E%3Cpath d='M0 13 11 2 22 13 11 24Z'/%3E%3Cpath d='M22 13 33 2 44 13 33 24Z'/%3E%3C/g%3E%3Cg fill='%23c9a24b'%3E%3Ccircle cx='11' cy='13' r='1.7'/%3E%3Ccircle cx='33' cy='13' r='1.7'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '66px 39px',
            backgroundRepeat: 'repeat',
            opacity: 0.15,
          }}
        />

        {/* تدرجات عمق */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, color-mix(in srgb, var(--ink) 80%, transparent) 100%), radial-gradient(circle at 10% 20%, color-mix(in srgb, var(--indigo) 28%, transparent), transparent 35rem)',
          }}
        />

        {/* غبار */}
        <div className="dust-layer" aria-hidden="true" />

        {/* المحتوى */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '900px',
            margin: '0 auto',
            padding: '8rem 2rem 4rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-kufi)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              color: 'var(--brass-lt)',
              display: 'block',
              marginBottom: '2rem',
              opacity: 0.8,
            }}
          >
            الموقع الرسمي لقبيلة السياحين
          </span>

          {/* العنوان الضخم */}
          <h1
            style={{
              fontFamily: 'var(--font-ruqaa)',
              fontSize: 'clamp(3.5rem, 11vw, 8rem)',
              lineHeight: 1.05,
              margin: '0 0 1.5rem',
              fontStyle: 'normal',
              letterSpacing: '-0.01em',
            }}
          >
            <span
              style={{
                display: 'block',
                background:
                  'linear-gradient(120deg, var(--brass) 0%, var(--brass-lt) 45%, var(--brass) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 24px color-mix(in srgb, var(--brass) 40%, transparent))',
              }}
            >
              نحن السياحين
            </span>
          </h1>

          {/* الخط الفاصل الضيق */}
          <div
            style={{
              width: '4rem',
              height: '2px',
              background: 'var(--brass)',
              marginBottom: '2rem',
              opacity: 0.7,
            }}
            aria-hidden="true"
          />

          {/* pull-quote */}
          <blockquote
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
              color: 'var(--sand-dim)',
              lineHeight: 1.65,
              margin: '0 0 3rem',
              maxWidth: '520px',
              borderRight: '3px solid color-mix(in srgb, var(--brass) 50%, transparent)',
              paddingRight: '1.5rem',
              fontStyle: 'normal',
            }}
          >
            البوابة الرقمية الموثقة لإرث القبيلة — نسباً وديارًا وشعراً وتاريخاً في سجل مفتوح لكل الأجيال.
          </blockquote>

          <Link
            href="/nasab/"
            style={{
              fontFamily: 'var(--font-kufi)',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              color: 'var(--ink)',
              background: 'linear-gradient(120deg, var(--brass) 0%, var(--brass-lt) 100%)',
              padding: '0.85rem 2.5rem',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            }}
            className="manifesto-cta"
          >
            استكشف الديوان
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          الأقسام الإعلانية — Manifesto sections
          ══════════════════════════════════════════════ */}
      <main
        id="main-content"
        style={{ position: 'relative' }}
      >
        {/* N3 side-rail: قائمة الفصول الرأسية (للشاشات الكبيرة) */}
        <aside
          aria-label="فصول الموقع"
          style={{
            position: 'fixed',
            left: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
          className="side-rail"
        >
          {CHAPTERS.map((ch, i) => (
            <Link
              key={ch.id}
              href={ch.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
              }}
              className="side-rail-item"
              title={ch.label}
            >
              <span
                style={{
                  fontFamily: 'var(--font-kufi)',
                  fontSize: '0.58rem',
                  color: 'var(--brass)',
                  opacity: 0.6,
                  minWidth: '1rem',
                }}
              >
                {CHAPTER_NUMS[i]}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-kufi)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  color: 'var(--sand-dim)',
                  writingMode: 'vertical-rl',
                  opacity: 0.6,
                }}
              >
                {ch.label}
              </span>
            </Link>
          ))}
        </aside>

        {ASSERTIONS.map((a, i) => (
          <article
            key={a.id}
            style={{
              padding: '6rem 2rem',
              background:
                i % 2 === 0
                  ? 'var(--ink)'
                  : 'linear-gradient(180deg, color-mix(in srgb, var(--indigo) 12%, transparent), var(--ink-2) 50%, var(--ink))',
              borderTop: '1px solid color-mix(in srgb, var(--brass) 10%, transparent)',
            }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto', paddingRight: '5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-kufi)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  color: 'var(--brass-lt)',
                  opacity: 0.7,
                  display: 'block',
                  marginBottom: '1.25rem',
                }}
              >
                {CHAPTER_NUMS[i]}&ensp;—&ensp;{a.label}
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-ruqaa)',
                  fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                  color: 'var(--sand)',
                  lineHeight: 1.35,
                  margin: '0 0 1.25rem',
                  fontStyle: 'normal',
                  maxWidth: '620px',
                }}
              >
                {a.claim}
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem',
                  color: 'var(--sand-dim)',
                  lineHeight: 1.8,
                  margin: '0 0 1.75rem',
                  maxWidth: '480px',
                }}
              >
                {a.sub}
              </p>

              <Link
                href={a.href}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.9rem',
                  color: 'var(--brass-lt)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: '1px solid color-mix(in srgb, var(--brass) 35%, transparent)',
                  paddingBottom: '0.1rem',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
                className="manifesto-section-link"
              >
                {a.label} ←
              </Link>
            </div>
          </article>
        ))}
      </main>

      {/* ═══════════════════════════════════════════════
          Ft5 — Statement Footer
          ══════════════════════════════════════════════ */}
      <footer
        style={{
          background: 'var(--ink-2)',
          borderTop: '1px solid color-mix(in srgb, var(--brass) 20%, transparent)',
          padding: '5rem 2rem 3.5rem',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* الجملة الختامية الكبيرة */}
          <p
            style={{
              fontFamily: 'var(--font-ruqaa)',
              fontSize: 'clamp(1.75rem, 5vw, 3.25rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              maxWidth: '14ch',
              margin: '0 0 3rem',
              color: 'var(--sand)',
              fontStyle: 'normal',
            }}
          >
            إرث تالد وديار أصيلة
          </p>

          {/* الخط الفاصل */}
          <div
            style={{
              height: '1px',
              background:
                'linear-gradient(to left, transparent, color-mix(in srgb, var(--brass) 40%, transparent), transparent)',
              marginBottom: '2rem',
            }}
            aria-hidden="true"
          />

          {/* الميتا */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-kufi)',
                fontSize: '0.9rem',
                color: 'var(--sand-dim)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              className="footer-wordmark"
            >
              قبيلة السياحين
            </Link>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.75rem',
                color: 'var(--sand-dim)',
                opacity: 0.5,
              }}
            >
              © {new Date().getFullYear()} الموقع الرسمي · جميع الحقوق محفوظة
            </span>
          </div>
        </div>

        {/* شريط المعاينة */}
        <div
          style={{
            maxWidth: '900px',
            margin: '2rem auto 0',
            paddingTop: '1.25rem',
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
              fontSize: '0.58rem',
              color: 'var(--sand-dim)',
              opacity: 0.35,
              letterSpacing: '0.1em',
            }}
          >
            HALLMARK · Manifesto · N9 · Ft5 · معاينة تصميمية — noindex
          </span>
          <Link
            href="/preview/"
            style={{
              fontFamily: 'var(--font-kufi)',
              fontSize: '0.65rem',
              color: 'var(--brass-lt)',
              textDecoration: 'none',
              opacity: 0.6,
              letterSpacing: '0.08em',
            }}
          >
            ← العودة للمعاينات
          </Link>
        </div>
      </footer>

      <style>{`
        .manifesto-wordmark:hover { color: var(--brass-lt) !important; }
        .manifesto-wordmark:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        .manifesto-nav-link:hover { color: var(--brass-lt) !important; }
        .manifesto-nav-link:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        .manifesto-cta:hover { box-shadow: var(--glow-brass-md); transform: translateY(-2px); }
        .manifesto-cta:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--ink), 0 0 0 4px var(--brass); }
        .manifesto-section-link:hover { color: var(--brass) !important; border-color: var(--brass) !important; }
        .manifesto-section-link:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        .side-rail-item:hover { opacity: 1 !important; }
        .side-rail-item:hover span { opacity: 1 !important; color: var(--brass-lt) !important; }
        .side-rail-item:focus-visible { outline: none; }
        .footer-wordmark:hover { color: var(--brass-lt) !important; }
        .footer-wordmark:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--brass); border-radius: 0.25rem; }
        @media (max-width: 768px) {
          .side-rail { display: none !important; }
          [style*="paddingRight: '5rem'"] { padding-right: 0 !important; }
        }
        @media (max-width: 640px) {
          [style*="padding: '8rem 2rem 4rem'"] { padding: 6rem 1.5rem 3rem !important; }
        }
      `}</style>
    </div>
  );
}
