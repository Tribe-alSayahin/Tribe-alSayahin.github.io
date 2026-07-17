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
  ScrollText,
  CalendarDays,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '../../lib/admin-users';
import { ADMIN_TAB_DEFINITIONS, getAllowedAdminTabs, type AdminTab } from '../../lib/admin-access';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  currentRole: UserRole | null;
  userEmail?: string;
  onSignOut: () => void;
}

const NAV_ICONS: Record<AdminTab, LucideIcon> = {
  dashboard: LayoutDashboard,
  posts: Newspaper,
  poetry: BookOpen,
  events: CalendarDays,
  users: Users,
  visitors: Users,
  comments: MessageSquare,
  media: ImageIcon,
  analytics: BarChart3,
  activity: Activity,
  'thanks-letter': ScrollText,
};

const NAV_ITEMS = ADMIN_TAB_DEFINITIONS.map((item) => ({
  ...item,
  icon: NAV_ICONS[item.id],
}));

export function AdminSidebar({
  activeTab,
  onTabChange,
  currentRole,
  userEmail,
  onSignOut,
}: AdminSidebarProps) {
  const allowedTabs = getAllowedAdminTabs(currentRole);

  return (
    <aside className="rounded-2xl border border-brass/20 bg-ink-2/70 p-4 h-fit">
      <div className="mb-6 pb-4 border-b border-brass/10">
        <p className="font-kufi text-xs text-brass-lt/80 mb-1">الموقع الرسمي</p>
        <h2 className="font-ruqaa text-2xl text-brass-lt">قبيلة السياحين</h2>
      </div>

      <nav aria-label="التنقل الإداري" className="space-y-1">
        {NAV_ITEMS.filter((item) => allowedTabs.includes(item.id)).map((item) => {
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
