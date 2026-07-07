import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { NAV_LINKS } from '../../lib/navigation';

interface NavbarProps {
  isScrolled: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  scrollToSection: (id: string) => void;
  activeSection?: string;
  onNavigateToAdmin?: () => void;
}

export function Navbar({
  isScrolled,
  theme,
  onToggleTheme,
  scrollToSection,
  activeSection,
  onNavigateToAdmin,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (id: string) => {
    setIsMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* الحاوية تتحول إلى كبسولة عائمة عند التمرير */}
      <div
        className={`transition-all duration-400 ease-brand ${
          isScrolled
            ? 'mx-3 md:mx-6 mt-3 rounded-2xl border border-brass/25 bg-ink/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
            : 'mx-0 mt-0 rounded-none border border-transparent bg-ink/40 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-[1160px] mx-auto px-5 md:px-6 h-[72px] flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('home');
            }}
            className="flex items-center gap-3 text-lg font-bold font-serif text-sand hover:text-brass-lt transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg border border-brass/40 bg-gradient-to-br from-brass/15 to-transparent flex items-center justify-center text-brass shadow-glow-sm p-2">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                stroke="currentColor"
                strokeWidth="22"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                aria-hidden="true"
              >
                <path d="M55,170 L55,50 L145,50 L145,170" />
              </svg>
            </div>
            <span className="flex flex-col items-start gap-1 leading-none">
              <span className="font-kufi text-[10px] font-semibold tracking-[0.22em] text-brass-lt/85">
                الموقع الرسمي
              </span>
              <span className="font-kufi text-lg leading-none">قبيلة السياحين</span>
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="التنقل الرئيسي">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(link.id);
                }}
                className={`relative px-3 py-1.5 rounded-full font-kufi font-semibold text-xs md:text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
                  activeSection === link.id
                    ? 'text-brass-lt'
                    : 'text-sand-dim hover:text-brass-lt hover:bg-brass/10'
                }`}
              >
                {activeSection === link.id && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 bg-brass/15 border border-brass/25 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Navigation Control */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="hidden md:flex items-center gap-1.5 text-xs font-kufi font-semibold text-brass-lt/70 hover:text-brass-lt bg-transparent border border-brass/15 hover:border-brass/35 rounded-full px-3 py-1.5 transition-all focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
                aria-label="لوحة الإدارة"
                title="لوحة الإدارة"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                الإدارة
              </button>
            )}

            {/* Mobile menu toggle */}
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

        {/* خيط ذهبي أسفل الشريط في وضع القمة فقط */}
        {!isScrolled && <div className="gold-hairline absolute bottom-0 inset-x-0" aria-hidden="true" />}
      </div>

      {/* Mobile Navigation Links */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />
    </header>
  );
}
