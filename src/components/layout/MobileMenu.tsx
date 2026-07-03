import { useEffect, useRef } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  activeSection?: string;
}

export function MobileMenu({ isOpen, onClose, onNavigate, activeSection }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'about', label: 'عن القبيلة' },
    { id: 'lineage', label: 'النسب' },
    { id: 'constellation', label: 'الأنساب السبعة' },
    { id: 'map', label: 'الديار والهجرات' },
    { id: 'gallery', label: 'الشاهد البصري' },
    { id: 'compass', label: 'اللوحة الفلكية' },
    { id: 'wasm', label: 'علامات الوسم' },
    { id: 'poetry', label: 'مجلس الشعراء' },
    { id: 'archive', label: 'الأرشيف والمصادر' },
    { id: 'timeline', label: 'التاريخ والمآثر' },
    { id: 'supporters', label: 'داعمو الإرث' },
    { id: 'contact', label: 'تواصل' },
  ];

  return (
    <div
      ref={menuRef}
      id="mobile-navigation-menu"
      className={`md:hidden absolute top-[76px] inset-x-0 bg-ink/98 border-b border-brass/20 flex flex-col items-center gap-1 p-5 transition-all duration-400 z-40 ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="قائمة التنقل للهواتف"
    >
      {navLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(link.id);
          }}
          className={`w-full text-center py-3 rounded-lg font-semibold text-sm transition-all focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
            activeSection === link.id
              ? 'text-brass-lt bg-brass/10'
              : 'text-sand hover:text-brass-lt hover:bg-brass/10'
          }`}
          role="button"
          tabIndex={0}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
