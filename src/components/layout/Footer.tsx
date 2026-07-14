'use client';

import Link from 'next/link';
import { BookOpen, Mail } from 'lucide-react';
import { LOCAL_REFS } from '../../lib/references';
import { SITE_ROUTES } from '../../lib/navigation';
import { OFFICIAL_LOGO_IMAGE_URL } from '../../lib/branding';

export function Footer() {
  return (
    <footer className="section-surface bg-ink-2 border-t-2 border-brass/20 py-20 md:py-28 lg:py-32 px-5 md:px-8 relative z-10 text-center overflow-hidden">
      <div className="footer-sadu" aria-hidden="true" />
      <div className="section-divider absolute top-0 inset-x-0 -translate-y-1/2" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_18%_18%,color-mix(in_srgb,var(--brass)_10%,transparent),transparent_24rem),radial-gradient(circle_at_86%_78%,color-mix(in_srgb,var(--indigo)_18%,transparent),transparent_24rem)]" aria-hidden="true" />
      <div className="max-w-[1160px] mx-auto relative z-10">
        <section className="editorial-card max-w-[1040px] mx-auto mb-14 md:mb-16 p-6 sm:p-8 md:p-10 pb-12 border-b border-brass/20 text-right backdrop-blur-lg">
          <div className="text-center mb-8 md:mb-10">
            <span className="font-kufi text-xs md:text-sm text-brass-lt font-semibold tracking-widest">مراجع قابلة للمراجعة</span>
            <h3 className="text-xl sm:text-2xl md:text-3xl mt-2 text-sand font-serif leading-[1.4]">المصادر والمراجع التاريخية</h3>
            <div className="w-[60px] h-[2px] bg-brass/40 mx-auto mt-4" />
          </div>

          <div className="flex items-start gap-space-3 max-w-2xl mx-auto mb-space-8 p-space-4 rounded-2xl bg-brass/5 border border-brass/15">
            <BookOpen className="w-5 h-5 text-brass-lt shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs md:text-sm text-sand-dim leading-relaxed">
              تُعرض المراجع المتاحة بصيغتها الببليوغرافية فقط. لا تُعرض اقتباسات أو نماذج مصوّرة قبل التحقق من النسخ الأصلية.
            </p>
          </div>

          <ol className="grid gap-space-5 text-right sm:grid-cols-2">
            {LOCAL_REFS.map((ref, index) => (
              <li
                key={ref.id}
                className="relative pr-12 pl-4 py-4 bg-ink-2/78 border border-brass/18 rounded-2xl text-sand text-sm leading-relaxed hover:border-brass/40 hover:shadow-glow-sm transition-all duration-300"
              >
                <span className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-brass/12 text-brass-lt border border-brass/25 flex items-center justify-center font-kufi text-xs font-semibold">
                  {['١', '٢', '٣', '٤', '٥'][index] ?? index + 1}
                </span>
                {ref.author}، {ref.bookTitle}، الصفحات: {ref.pages}.
                <span className="block text-sand-dim text-xs mt-2 opacity-80">
                  {ref.publisher}، الطبعة الأولى {ref.year}.
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="footer-links">
          {SITE_ROUTES.map((link) => (
            <Link
              key={link.id}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:admin@alsaihani.com"
            className="inline-flex items-center gap-1.5 text-brass-lt hover:text-brass"
            aria-label="مراسلة إدارة الموقع"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            admin@alsaihani.com
          </a>
        </div>

        <div className="flex items-center justify-center mt-6 mb-2">
          <a
            href="https://snapchat.com/t/Ohhqg5X1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="حساب القبيلة على سناب شات"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFFC00]/10 border border-[#FFFC00]/30 text-[#FFFC00] hover:bg-[#FFFC00]/20 hover:border-[#FFFC00]/60 transition-all duration-300 font-kufi text-sm"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.065.003C8.835-.063 5.81 1.603 4.07 4.37c-.9 1.44-1.087 3.103-1.027 4.748-.455.213-.93.373-1.42.474-.492.1-.736.578-.64 1.048.1.47.56.755 1.04.665.18-.035.36-.08.534-.133.11-.035.218-.07.326-.108l.01.01c-.278.508-.422 1.072-.418 1.645.005.818.384 1.585 1.037 2.082.11.083.22.158.332.225-.193.595-.458 1.164-.79 1.693-.55.888-1.27 1.665-2.122 2.28-.183.13-.22.383-.083.557.14.175.4.206.577.073.64-.478 1.21-1.043 1.697-1.68.193-.255.37-.517.528-.79.24.1.485.19.737.268 1.058.333 2.17.424 3.28.27.166-.022.33-.05.49-.085.1.186.21.367.33.54.693 1.013 1.683 1.785 2.83 2.216.15.056.315.023.43-.085.114-.107.148-.27.085-.41-.284-.618-.425-1.293-.41-1.974V18.7c0-.01 0-.02.002-.03.01-.03.02-.057.037-.08.04-.05.097-.084.16-.09.283-.027.563-.085.83-.175.35-.12.677-.29.977-.498.147-.104.175-.31.062-.447-.113-.138-.317-.157-.455-.043-.23.176-.48.322-.748.432-.212.087-.433.146-.658.175-.185.022-.367.08-.527.175-.16.095-.29.23-.378.395-.085.162-.13.344-.128.528v.08c.005.362.055.72.15 1.068-.913-.508-1.665-1.266-2.157-2.185-.155-.286-.29-.582-.4-.886-.06-.165-.216-.278-.39-.278-.014 0-.028 0-.043.002-.158.012-.312.04-.463.08-.14.04-.283.07-.427.093-.863.13-1.74.06-2.573-.2-.243-.077-.48-.17-.708-.28.03-.056.06-.113.087-.17.22-.457.362-.95.42-1.457.018-.155-.066-.305-.21-.37-.26-.118-.505-.257-.732-.415-.386-.266-.618-.705-.62-1.173-.002-.46.2-.895.545-1.19.066-.057.095-.14.078-.222-.016-.08-.07-.148-.148-.183-.22-.098-.446-.178-.678-.237-.094-.025-.163-.11-.163-.207 0-.098.072-.183.167-.204.72-.15 1.42-.42 2.052-.8.015-.01.032-.016.05-.016.015 0 .03.003.042.01.04.02.067.054.073.097.004.03-.004.062-.022.086-.1.128-.15.29-.14.454.005.063.038.12.09.155.05.035.115.044.174.023.39-.14.805-.192 1.218-.15.37.038.73.14 1.064.306.1.05.22.033.302-.044.082-.077.1-.198.044-.295-.31-.53-.458-1.14-.428-1.754C6.57 3.74 9.05 1.997 11.795 2.003c2.742.005 5.22 1.753 5.92 4.42.066.255.097.515.093.776.005.566-.13 1.124-.393 1.623-.058.107-.04.24.045.328.086.088.216.115.33.067.368-.155.754-.228 1.143-.216.27.01.534.067.784.167.17.067.357.01.464-.14.106-.15.094-.355-.03-.49-.256-.282-.567-.505-.914-.653-.197-.085-.405-.147-.618-.187.05-.205.082-.414.093-.625.01-.18.008-.36-.004-.54C18.528 2.3 15.538.07 12.065.003z" />
            </svg>
            live.asya7een
          </a>
        </div>

        <Link
          href="/"
          className="logo flex items-center justify-center gap-3 text-lg font-bold font-serif text-sand hover:text-brass-lt transition-colors mb-4 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-lg p-1 w-fit mx-auto"
        >
          <div className="w-10 h-10 rounded-lg border border-brass/50 bg-ink/70 flex items-center justify-center shadow-glow-sm overflow-hidden">
            <img
              src={OFFICIAL_LOGO_IMAGE_URL}
              alt="شعار قبيلة السياحين"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="flex flex-col items-start gap-1 leading-none text-right">
            <span className="font-kufi text-[10px] font-semibold tracking-[0.22em] text-brass-lt/85">
              الموقع الرسمي
            </span>
            <span className="font-kufi text-lg leading-none">قبيلة السياحين</span>
          </span>
        </Link>
        <p className="text-sand-dim text-sm">
          © {new Date().getFullYear()} الموقع الرسمي لقبيلة السياحين — جميع الحقوق محفوظة
        </p>
        <p className="font-kufi text-xs text-brass-lt/70 tracking-wider mt-2">
          من المزاحمة • من الروقة • من عتيبة الهيلا
        </p>
      </div>
    </footer>
  );
}
