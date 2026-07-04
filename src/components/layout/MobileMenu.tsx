import { useEffect, useRef } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  activeSection?: string;
}

export function MobileMenu({ isOpen, onClose, onNavigate, activeSection }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on ESC key press + focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el): el is HTMLElement => el instanceof HTMLElement);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'jathum', label: 'هجرة الجثوم' },
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

  return (
    <div
      ref={menuRef}
      id="mobile-navigation-menu"
      className={`lg:hidden absolute top-[76px] inset-x-0 bg-ink/98 border-b border-brass/20 flex flex-col items-center gap-1 p-5 transition-all duration-400 z-40 ${
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
          tabIndex={isOpen ? 0 : -1}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
