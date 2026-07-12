import { useEffect, useRef } from 'react';
import { NAV_LINKS } from '../../lib/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  activeSection?: string;
}

function isActiveLink(activeSection: string | undefined, link: typeof NAV_LINKS[number]): boolean {
  if (!activeSection) return false;
  if (activeSection === link.id) return true;
  return link.sections?.some((s) => s.id === activeSection) ?? false;
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

  return (
    <div
      ref={menuRef}
      id="mobile-navigation-menu"
      className={`lg:hidden absolute top-[92px] inset-x-3 bg-ink/88 backdrop-blur-2xl border border-brass/25 rounded-3xl shadow-glow-sm flex flex-col items-stretch gap-1 p-5 transition-all duration-400 z-40 ${
        isOpen ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-hidden={!isOpen}
      aria-modal={isOpen}
      aria-labelledby="mobile-navigation-title"
    >
      <h2 id="mobile-navigation-title" className="w-full text-center text-xs font-kufi text-brass-lt/90 pb-3 border-b border-brass/10 mb-2">
        التنقل السريع
      </h2>
      {NAV_LINKS.map((link) => (
        <div key={link.id} className="flex flex-col">
          <a
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(link.id);
            }}
            className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all border focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
              isActiveLink(activeSection, link)
                ? 'text-brass-lt bg-brass/12 border-brass/20'
                : 'text-sand border-transparent hover:text-brass-lt hover:bg-brass/10 hover:border-brass/15'
            }`}
            tabIndex={isOpen ? 0 : -1}
          >
            {link.label}
          </a>
          {link.sections && link.sections.length > 0 && (
            <div className="grid grid-cols-2 gap-2 px-3 pb-2 pt-1">
              {link.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(section.id);
                  }}
                  className={`text-center py-2 rounded-lg text-xs font-kufi transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
                    activeSection === section.id
                      ? 'text-brass-lt bg-brass/10 border border-brass/20'
                      : 'text-sand-dim hover:text-brass-lt hover:bg-brass/5 border border-transparent'
                  }`}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {section.label}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
