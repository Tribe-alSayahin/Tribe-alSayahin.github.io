'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { SITE_ROUTES } from '../../lib/navigation';
import { OFFICIAL_LOGO_IMAGE_URL } from '../../lib/branding';
import { useScrollState } from '../../hooks/useScrollState';

function isLinkActive(linkHref: string, pathname: string): boolean {
  if (linkHref === '/') {
    return pathname === '/';
  }
  return pathname.startsWith(linkHref.replace(/#$/, ''));
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrollState(40);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div
        className={`transition-all duration-400 ease-brand ${
          isScrolled
            ? 'mx-3 md:mx-8 mt-3 rounded-2xl border border-brass/30 bg-ink/84 backdrop-blur-2xl shadow-elev-2'
            : 'mx-0 mt-0 rounded-none border border-transparent bg-gradient-to-b from-ink/80 to-ink/35 backdrop-blur-md'
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 h-[76px] flex items-center justify-between relative">
          <span
            className={`absolute inset-x-5 md:inset-x-8 bottom-0 h-px bg-gradient-to-l from-transparent via-brass/35 to-transparent transition-opacity duration-300 ${
              isScrolled ? 'opacity-0' : 'opacity-100'
            }`}
            aria-hidden="true"
          />
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-bold font-serif text-sand hover:text-brass-lt transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-xl p-1"
          >
            <div className="w-11 h-11 rounded-xl border border-brass/50 bg-ink/70 flex items-center justify-center shadow-glow-sm overflow-hidden">
              <img
                src={OFFICIAL_LOGO_IMAGE_URL}
                alt="شعار قبيلة السياحين"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="flex flex-col items-start gap-1 leading-none">
              <span className="font-kufi text-[10px] font-semibold tracking-[0.22em] text-brass-lt/85">
                الموقع الرسمي
              </span>
              <span className="font-kufi text-base md:text-lg leading-none">قبيلة السياحين</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-brass/5 border border-brass/10 rounded-full px-1.5 py-1" aria-label="التنقل الرئيسي">
            {SITE_ROUTES.filter((link) => link.id !== 'home').map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`relative px-3.5 py-2 font-kufi font-semibold text-xs md:text-sm transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-full ${
                  isLinkActive(link.href, pathname)
                    ? 'text-brass-lt bg-brass/10'
                    : 'text-sand-dim hover:text-brass-lt'
                }`}
              >
                <span className="relative">{link.label}</span>
                {isLinkActive(link.href, pathname) && (
                  <motion.span
                    layoutId="nav-active-line"
                    className="absolute bottom-1 inset-x-3 h-px bg-brass-lt rounded-full"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 text-brass-lt bg-transparent border-0 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-full cursor-pointer"
              aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-brass-lt" />
              ) : (
                <Menu className="w-6 h-6 text-brass-lt" />
              )}
            </button>
          </div>
        </div>

        {!isScrolled && <div className="gold-hairline absolute bottom-0 inset-x-0" aria-hidden="true" />}
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
}
