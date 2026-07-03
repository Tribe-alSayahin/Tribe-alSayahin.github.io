import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brass/10 border border-brass/25 text-brass-lt flex items-center justify-center hover:bg-brass/20 hover:border-brass/45 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
      title={theme === 'dark' ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
      aria-label="تبديل مظهر الإضاءة"
      aria-pressed={theme === 'light'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4.5 h-4.5 md:w-5 md:h-5" />
      ) : (
        <Moon className="w-4.5 h-4.5 md:w-5 md:h-5" />
      )}
    </button>
  );
}
