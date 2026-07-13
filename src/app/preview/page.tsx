import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'معاينة التصاميم — الاتجاهات الثلاثة',
  robots: { index: false, follow: false },
};

const DESIGNS = [
  {
    id: 'codex',
    number: '١',
    title: 'ديوان المخطوطة',
    subtitle: 'Long Document · N6 Masthead · Ft4 Dense',
    desc: 'الصفحة كمخطوطة رقمية طولية — ناف جريدة مركزي، بطل غير متماثل، قائمة فصول منظَّمة.',
    accent: 'var(--brass)',
  },
  {
    id: 'manifesto',
    number: '٢',
    title: 'بيان الهوية',
    subtitle: 'Manifesto · N9 Edge-Aligned · Ft5 Statement',
    desc: 'الصفحة كوثيقة إعلانية — حروف ضخمة على الخلفية مباشرة، ناف شفاف يختفي، قفلة واحدة.',
    accent: 'var(--copper)',
  },
  {
    id: 'archive',
    number: '٣',
    title: 'بوابة الأرشيف',
    subtitle: 'Index-First · N12 Banner · Ft3-variant',
    desc: 'الصفحة كفهرس أرشيف استشراقي — بانر ذهبي سريع، هيرو قصير، قائمة مُفهرسة واثقة.',
    accent: 'var(--emerald)',
  },
];

export default function PreviewIndexPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        color: 'var(--sand)',
        padding: '6rem 2rem 4rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-kufi)',
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              color: 'var(--brass-lt)',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            HALLMARK · معاينة التصاميم
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-ruqaa)',
              fontSize: 'clamp(2rem,5vw,3.5rem)',
              color: 'var(--sand)',
              lineHeight: 1.3,
              margin: '0 0 1rem',
            }}
          >
            الاتجاهات التصميمية الثلاثة
          </h1>
          <p
            style={{
              color: 'var(--sand-dim)',
              fontSize: '0.95rem',
              lineHeight: 1.8,
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            معاينة مقترحات إعادة تصميم الصفحة الرئيسية — اختر الاتجاه الأنسب.
          </p>
          <div
            style={{
              height: '1px',
              background:
                'linear-gradient(to left, transparent, color-mix(in srgb, var(--brass) 50%, transparent), transparent)',
              margin: '2rem auto',
              maxWidth: '360px',
            }}
            aria-hidden="true"
          />
        </header>

        {/* Design cards */}
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1.5rem' }}>
          {DESIGNS.map((d) => (
            <li key={d.id}>
              <Link
                href={`/preview/${d.id}/`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '3.5rem 1fr',
                  gap: '1.5rem',
                  padding: '1.75rem',
                  borderRadius: '1rem',
                  border: '1px solid color-mix(in srgb, var(--brass) 20%, transparent)',
                  background:
                    'linear-gradient(145deg, color-mix(in srgb, var(--coffee) 80%, transparent), color-mix(in srgb, var(--ink-2) 95%, transparent))',
                  textDecoration: 'none',
                  transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                  alignItems: 'start',
                }}
                className="preview-card"
              >
                <span
                  style={{
                    fontFamily: 'var(--font-ruqaa)',
                    fontSize: '2.5rem',
                    lineHeight: 1,
                    color: d.accent,
                    opacity: 0.7,
                    display: 'block',
                    paddingTop: '0.15rem',
                  }}
                  aria-hidden="true"
                >
                  {d.number}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-kufi)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.12em',
                      color: 'var(--sand-dim)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {d.subtitle}
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
                    {d.title}
                  </h2>
                  <p
                    style={{
                      color: 'var(--sand-dim)',
                      fontSize: '0.88rem',
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {d.desc}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <p
          style={{
            marginTop: '3rem',
            textAlign: 'center',
            color: 'var(--sand-dim)',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-kufi)',
            letterSpacing: '0.08em',
            opacity: 0.6,
          }}
        >
          هذه الصفحات للمعاينة الداخلية فقط · noindex
        </p>
      </div>

      <style>{`
        .preview-card:hover {
          border-color: color-mix(in srgb, var(--brass) 45%, transparent) !important;
          transform: translateY(-3px);
          box-shadow: var(--elev-2), var(--glow-brass-sm);
        }
        .preview-card:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px var(--brass);
        }
      `}</style>
    </div>
  );
}
