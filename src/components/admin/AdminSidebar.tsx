'use client';

import {
  LayoutDashboard,
  Newspaper,
  Users,
  BarChart3,
  Image as ImageIcon,
  MessageSquare,
  Activity,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'posts'
  | 'users'
  | 'analytics'
  | 'media'
  | 'comments'
  | 'activity';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  userEmail?: string;
  onSignOut: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
  { id: 'posts', label: 'الأخبار والمناسبات', icon: Newspaper },
  { id: 'users', label: 'المستخدمين', icon: Users },
  { id: 'comments', label: 'التعليقات', icon: MessageSquare },
  { id: 'media', label: 'الوسائط', icon: ImageIcon },
  { id: 'analytics', label: 'الإحصائيات', icon: BarChart3 },
  { id: 'activity', label: 'سجل النشاطات', icon: Activity },
];

export function AdminSidebar({
  activeTab,
  onTabChange,
  userEmail,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <aside className="rounded-2xl border border-brass/20 bg-ink-2/70 p-4 h-fit">
      <div className="mb-6 pb-4 border-b border-brass/10">
        <p className="font-kufi text-xs text-brass-lt/80 mb-1">الموقع الرسمي</p>
        <h2 className="font-ruqaa text-2xl text-brass-lt">قبيلة السياحين</h2>
      </div>

      <nav aria-label="التنقل الإداري" className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right font-kufi text-sm transition-all focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none ${
                isActive
                  ? 'bg-brass/15 text-brass-lt border border-brass/30'
                  : 'text-sand-dim hover:bg-brass/5 hover:text-sand'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 pt-4 border-t border-brass/10">
        {userEmail && (
          <p className="text-xs text-sand-dim mb-3 truncate" dir="ltr">
            {userEmail}
          </p>
        )}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-right font-kufi text-sm text-copper-lt hover:bg-copper/10 transition-colors focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
