import { useState } from 'react';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

interface NavbarProps {
  isScrolled: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  scrollToSection: (id: string) => void;
  activeSection?: string;
}

export function Navbar({
  isScrolled,
  theme,
  onToggleTheme,
  scrollToSection,
  activeSection,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'jathum', label: 'الجثوم' },
    { id: 'lineage', label: 'النسب' },
    { id: 'constellation', label: 'الأنساب' },
    { id: 'map', label: 'الديار' },
    { id: 'gallery', label: 'التراث' },
    { id: 'compass', label: 'الفلك' },
    { id: 'wasm', label: 'الوسم' },
    { id: 'poetry', label: 'الشعر' },
    { id: 'archive', label: 'الأرشيف' },
    { id: 'timeline', label: 'التاريخ' },
    { id: 'supporters', label: 'الداعمين' },
    { id: 'contact', label: 'تواصل' },
  ];

  const handleNavigate = (id: string) => {
    setIsMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-400 ${
        isScrolled
          ? 'bg-ink/95 backdrop-blur-md border-brass/20 shadow-lg'
          : 'bg-ink/55 backdrop-blur-sm border-brass/10'
      }`}
    >
      <div className="max-w-[1160px] mx-auto px-6 h-[76px] flex items-center justify-between">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('home');
          }}
          className="flex items-center gap-3 text-lg font-bold font-serif text-sand hover:text-brass-lt transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-lg p-1"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brass to-brass-lt flex items-center justify-center text-ink shadow-[0_6px_18px_rgba(201,162,39,0.35)] p-2.5">
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
        <nav className="hidden lg:flex items-center gap-1" aria-label="التنقل الرئيسي">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(link.id);
              }}
              className={`relative px-3 py-1.5 rounded-full font-semibold text-xs md:text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
                activeSection === link.id
                  ? 'text-brass-lt'
                  : 'text-sand-dim hover:text-brass-lt hover:bg-brass/10'
              }`}
            >
              {activeSection === link.id && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 bg-brass/15 rounded-full -z-10"
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

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 text-brass-lt bg-transparent border-0 focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none rounded-full cursor-pointer"
            aria-label="افتتاح القائمة"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-brass-lt" />
            ) : (
              <Menu className="w-6 h-6 text-brass-lt" />
            )}
          </button>
        </div>
      </div>

      {/* Gold hairline under the header */}
      <div className="gold-hairline absolute bottom-0 inset-x-0" aria-hidden="true" />

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
