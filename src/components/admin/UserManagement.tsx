'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Shield, UserPlus, Trash2, Search } from 'lucide-react';
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUserRole,
  deleteAdminUser,
  type AdminUser,
  type UserRole,
} from '../../lib/admin-users';
import { ConfirmModal } from './ConfirmModal';

interface UserManagementProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

export function UserManagement({ onNotify }: UserManagementProps = {}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('editor');
  const [newUserName, setNewUserName] = useState('');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await fetchAdminUsers();
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      setUsers(data || []);
      setError('');
    }
    setIsLoading(false);
  }, [onNotify]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        (user.full_name ?? '').toLowerCase().includes(term) ||
        (user.email ?? '').toLowerCase().includes(term) ||
        user.user_id.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
  }, [users, search]);

  const superAdmins = users.filter((u) => u.role === 'super_admin');
  const isOnlySuperAdmin = (user: AdminUser) =>
    user.role === 'super_admin' && superAdmins.length === 1;

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) {
      setError('البريد الإلكتروني مطلوب');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const { error: insertError } = await createAdminUser({
      email: newUserEmail.trim(),
      role: newUserRole,
      full_name: newUserName || null,
    });

    if (insertError) {
      setError(insertError.message);
      onNotify?.(insertError.message, 'error');
      setIsSubmitting(false);
      return;
    }

    setNewUserEmail('');
    setNewUserRole('editor');
    setNewUserName('');
    setShowAddForm(false);
    onNotify?.('تم إضافة المستخدم بنجاح', 'success');
    await loadUsers();
    setIsSubmitting(false);
  };

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    const { error } = await updateAdminUserRole(userId, newRole);
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      onNotify?.('تم تحديث الدور بنجاح', 'success');
      await loadUsers();
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (isOnlySuperAdmin(user)) {
      onNotify?.('لا يمكن حذف المشرف العام الوحيد', 'error');
      setDeleteTarget(null);
      return;
    }

    const { error } = await deleteAdminUser(user.id);
    if (error) {
      setError(error.message);
      onNotify?.(error.message, 'error');
    } else {
      onNotify?.('تم حذف المستخدم بنجاح', 'success');
      await loadUsers();
    }
    setDeleteTarget(null);
  };

  const roleColors: Record<UserRole, string> = {
    super_admin: 'bg-copper/20 text-copper-lt border-copper/30',
    admin: 'bg-brass/20 text-brass-lt border-brass/30',
    editor: 'bg-emerald/20 text-emerald-lt border-emerald/30',
  };

  const roleLabels: Record<UserRole, string> = {
    super_admin: 'مشرف عام',
    admin: 'مشرف',
    editor: 'محرر',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-brass/25 bg-brass/8 flex items-center justify-center">
            <Shield className="w-5 h-5 text-brass-lt" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-ruqaa text-xl text-sand">إدارة المستخدمين</h3>
            <p className="text-sm text-sand-dim">إدارة صلاحيات المشرفين والمحررين</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brass/30 text-sm font-kufi text-brass-lt hover:bg-brass/10 transition-colors focus-visible:ring-2 focus-visible:ring-brass focus-visible:outline-none"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          إضافة مستخدم
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
          <h4 className="font-kufi text-lg text-brass-lt mb-4">إضافة مستخدم جديد</h4>
          <form onSubmit={(e) => { void handleAddUser(e); }} className="grid gap-3">
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
              required
            />
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="الاسم الكامل (اختياري)"
              className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as UserRole)}
              className="rounded-lg border border-brass/20 bg-ink/70 px-3 py-2 text-sand focus:outline-none focus:border-brass/50"
            >
              <option value="editor">محرر</option>
              <option value="admin">مشرف</option>
              <option value="super_admin">مشرف عام</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brass/20 border border-brass/35 px-4 py-2 text-sm font-kufi text-brass-lt hover:bg-brass/30 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'جارٍ الإضافة...' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-sand/25 px-4 py-2 text-sm font-kufi text-sand-dim hover:bg-sand/10 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-brass/20 bg-ink-2/60 p-5">
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-dim" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو البريد أو الدور"
            className="w-full rounded-lg border border-brass/20 bg-ink/70 pr-9 pl-3 py-2 text-sm text-sand placeholder:text-sand-dim/60 focus:outline-none focus:border-brass/50"
          />
        </div>

        {isLoading ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">جارٍ تحميل المستخدمين...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-sm font-kufi text-sand-dim py-8 text-center">لا يوجد مستخدمين مطابقين.</p>
        ) : (
          <div className="grid gap-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-brass/15 bg-ink/50 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-lg text-sand truncate">
                    {user.full_name || 'بدون اسم'}
                  </p>
                  <p className="text-sm text-sand-dim truncate" dir="ltr">
                    {user.email ?? user.user_id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={user.role}
                    onChange={(e) => { void handleUpdateRole(user.id, e.target.value as UserRole); }}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-kufi focus:outline-none focus:border-brass/50 ${roleColors[user.role]}`}
                  >
                    <option value="editor">{roleLabels.editor}</option>
                    <option value="admin">{roleLabels.admin}</option>
                    <option value="super_admin">{roleLabels.super_admin}</option>
                  </select>
                  <button
                    onClick={() => setDeleteTarget(user)}
                    disabled={isOnlySuperAdmin(user)}
                    className="p-2 rounded-lg border border-copper/40 text-copper hover:bg-copper/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
                    aria-label="حذف المستخدم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs font-kufi text-copper">{error}</p>}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="تأكيد حذف المستخدم"
        message={`هل أنت متأكد من حذف المستخدم "${deleteTarget?.full_name || deleteTarget?.email || deleteTarget?.user_id}"؟`}
        confirmLabel="حذف"
        onConfirm={() => deleteTarget && void handleDeleteUser(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
